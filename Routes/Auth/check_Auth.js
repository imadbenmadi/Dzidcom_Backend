const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Freelancers } = require("../../Models/Freelnacer");
const { Refresh_tokens } = require("../../Models/RefreshTokens");
const { Clients } = require("../../Models/Client");

router.get("/", async (req, res) => {
    const freelancerAccessTokenSecret =
        process.env.Freelancer_ACCESS_TOKEN_SECRET;
    const freelancerRefreshTokenSecret =
        process.env.Freelancer_REFRESH_TOKEN_SECRET;
    const clientAccessTokenSecret = process.env.Client_ACCESS_TOKEN_SECRET;
    const clientRefreshTokenSecret = process.env.Client_REFRESH_TOKEN_SECRET;
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    let userType = "";
    console.log("daata from checkAuth : ", accessToken, refreshToken);

    const verifyToken = (token, secret) => {
        return new Promise((resolve, reject) => {
            jwt.verify(token, secret, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    };

    const handleTokenExpired = async (
        refreshToken,
        refreshTokenSecret,
        accessTokenSecret,
        res
    ) => {
        if (!refreshToken) {
            if (req.cookies.accessToken) {
                res.clearCookie("accessToken");
            }
            if (req.cookies.refreshToken) {
                res.clearCookie("refreshToken");
            }
            return res
                .status(401)
                .json({ message: "Unauthorized: Refresh token is missing" });
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
            return res
                .status(401)
                .json({ message: "Unauthorized: Refresh token is missing" });
        }

        jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
            if (err) {
                if (req.cookies.accessToken) {
                    res.clearCookie("accessToken");
                }
                if (req.cookies.refreshToken) {
                    res.clearCookie("refreshToken");
                }
                return res
                    .status(401)
                    .json({ message: "Unauthorized: Invalid Tokens" });
            }

            const newAccessToken = jwt.sign(
                {
                    userId: decoded.userId,
                    userType: decoded.userType,
                },
                accessTokenSecret,
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
            userType = "freelancer";
            if (!user) {
                user = await Clients.findOne({ where: { id: decoded.userId } });
                userType = "client";
            }

            if (!user) {
                userType = "";
                if (req.cookies.accessToken) {
                    res.clearCookie("accessToken");
                }
                if (req.cookies.refreshToken) {
                    res.clearCookie("refreshToken");
                }
                return res
                    .status(404)
                    .json({ message: "Unauthorized: User not found" });
            }

            return res.status(200).json({
                message: "check auth true, Access token refreshed successfully",
                userType: userType,
                userId: user.id,
            });
        });
    };

    try {
        // Verify the access token using Freelancer secrets
        try {
            const decoded = await verifyToken(
                accessToken,
                freelancerAccessTokenSecret
            );
            let user = await Freelancers.findOne({
                where: { id: decoded.userId },
            });
            userType = "freelancer";
            if (!user) {
                user = await Clients.findOne({ where: { id: decoded.userId } });
                userType = "client";
            }
            if (!user) {
                return res
                    .status(404)
                    .json({ message: "Unauthorized: User not found" });
            }
            return res.status(200).json({
                message: "check auth: true, Access token is valid",
                userType: userType,
                userId: user.id,
            });
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return await handleTokenExpired(
                    refreshToken,
                    freelancerRefreshTokenSecret,
                    freelancerAccessTokenSecret,
                    res
                );
            }

            // If verifying with Freelancer secret fails, try Client secrets
            try {
                const decoded = await verifyToken(
                    accessToken,
                    clientAccessTokenSecret
                );
                let user = await Freelancers.findOne({
                    where: { id: decoded.userId },
                });
                userType = "freelancer";
                if (!user) {
                    user = await Clients.findOne({
                        where: { id: decoded.userId },
                    });
                    userType = "client";
                }
                if (!user) {
                    return res
                        .status(404)
                        .json({ message: "Unauthorized: User not found" });
                }
                return res.status(200).json({
                    message: "check auth: true, Access token is valid",
                    userType: userType,
                    userId: user.id,
                });
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    return await handleTokenExpired(
                        refreshToken,
                        clientRefreshTokenSecret,
                        clientAccessTokenSecret,
                        res
                    );
                }
                // If both verifications fail
                if (req.cookies.accessToken) {
                    res.clearCookie("accessToken");
                }
                if (req.cookies.refreshToken) {
                    res.clearCookie("refreshToken");
                }
                return res
                    .status(401)
                    .json({ message: "Unauthorized: Access token is invalid" });
            }
        }
    } catch (err) {
        if (req.cookies.accessToken) {
            res.clearCookie("accessToken");
        }
        if (req.cookies.refreshToken) {
            res.clearCookie("refreshToken");
        }
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;
