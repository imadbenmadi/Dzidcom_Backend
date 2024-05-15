const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Freelancers = require("../../Models/Freelnacer");
const Refresh_tokens = require("../../Models/RefreshTokens");
const Clients = require("../../Models/Client");
const { where } = require("sequelize");
router.get("/", async (req, res) => {
    const secretKey = process.env.ACCESS_TOKEN_SECRET;
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (req.cookies.admin_accessToken) {
        res.clearCookie("admin_accessToken");
    }
    if (req.cookies.admin_refreshToken) {
        res.clearCookie("admin_refreshToken");
    }
    try {
        // Verify the access token
        jwt.verify(accessToken, secretKey, async (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    // Access token expired, attempt to refresh it
                    try {
                        if (!refreshToken) {
                            if (req.cookies.accessToken) {
                                res.clearCookie("accessToken");
                            }
                            if (req.cookies.refreshToken) {
                                res.clearCookie("refreshToken");
                            }
                            return res.status(401).json({
                                message:
                                    "Unauthorized: Refresh token is missing",
                            });
                        }

                        const found_in_DB = await Refresh_tokens.findOne({
                            where: { token: refreshToken },
                        });

                        if (!found_in_DB) {
                            if (req.cookies.accessToken) {
                                res.clearCookie("accessToken");
                            }
                            if (req.cookies.refreshToken) {
                                res.clearCookie("refreshToken");
                            }
                            return res.status(401).json({
                                message:
                                    "Unauthorized : Refresh token is missing ",
                            });
                        }

                        jwt.verify(
                            refreshToken,
                            process.env.REFRESH_TOKEN_SECRET,
                            async (err, decoded) => {
                                if (err) {
                                    if (req.cookies.accessToken) {
                                        res.clearCookie("accessToken");
                                    }
                                    if (req.cookies.refreshToken) {
                                        res.clearCookie("refreshToken");
                                    }
                                    return res.status(401).json({
                                        message:
                                            "Unauthorized : invalide Tokens",
                                    });
                                }
                                // else if (
                                //     found_in_DB.userId != decoded.userId
                                // ) {
                                //     if (req.cookies.accessToken) {
                                //         res.clearCookie("accessToken");
                                //     }
                                //     if (req.cookies.refreshToken) {
                                //         res.clearCookie("refreshToken");
                                //     }
                                //     return res.status(401).json({
                                //         message: "Unauthorized",
                                //     });
                                // }

                                // Generate new access token
                                const newAccessToken = jwt.sign(
                                    { userId: decoded.userId },
                                    process.env.ACCESS_TOKEN_SECRET,
                                    { expiresIn: "1h" }
                                );
                                res.cookie("accessToken", newAccessToken, {
                                    httpOnly: true,
                                    sameSite: "None",
                                    secure: true,
                                    maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
                                });
                                let user = await Freelancers.findOne({
                                    where: { id: decoded.userId },
                                });
                                if (!user) {
                                    user = await Clients.findOne({
                                        where: { id: decoded.userId },
                                    });
                                }
                                if (!user) {
                                    return res.status(404).json({
                                        message:
                                            "Unauthorized : User not found",
                                    });
                                }
                                return res.status(200).json({
                                    message:
                                        "check auth true , Access token refreshed successfully",
                                });
                            }
                        );
                    } catch (refreshErr) {
                        console.log("refreshErr", refreshErr);
                        if (req.cookies.accessToken) {
                            res.clearCookie("accessToken");
                        }
                        if (req.cookies.refreshToken) {
                            res.clearCookie("refreshToken");
                        }
                        return res
                            .status(500)
                            .json({ message: "Unauthorized", refreshErr });
                    }
                } else {
                    if (req.cookies.accessToken) {
                        res.clearCookie("accessToken");
                    }
                    if (req.cookies.refreshToken) {
                        res.clearCookie("refreshToken");
                    }
                    return res.status(401).json({
                        message: "Unauthorized: Access token is invalid",
                    });
                }
            } else {
                let user = await Freelancers.findOne({
                    where: { id: decoded.userId },
                });
                if (!user)
                    user = await Clients.findOne({
                        where: { id: decoded.userId },
                    });
                if (!user) {
                    return res.status(404).json({
                        message: "Unauthorized : User not found",
                    });
                }

                return res.status(200).json({
                    message: "check auth : true , Access token is valid",
                });
            }
        });
    } catch (err) {
        if (req.cookies.accessToken) {
            res.clearCookie("accessToken");
        }
        if (req.cookies.refreshToken) {
            res.clearCookie("refreshToken");
        }
        return res.status(500).json({ message: err });
    }
});

module.exports = router;
