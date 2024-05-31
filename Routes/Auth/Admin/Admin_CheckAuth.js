const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Admins } = require("../../../Models/Admin/Admin");
const { Refresh_tokens } = require("../../../Models/RefreshTokens");

router.get("/", async (req, res) => {
    const AdminAccessTokenSecret = process.env.ADMIN_ACCESS_TOKEN_SECRET;
    const AdminRefreshTokenSecret = process.env.ADMIN_REFRESH_TOKEN_SECRET;
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
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
                    userType: "admin",
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

            const user = await Admins.findOne({
                where: { id: decoded.userId },
            });

            if (!user) {
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
            });
        });
    };

    try {
        // Verify the access token using Admin secrets
        try {
            const decoded = await verifyToken(
                accessToken,
                AdminAccessTokenSecret
            );
            let user = await Admins.findOne({ where: { id: decoded.userId } });
            if (!user) {
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
                message: "check auth: true, Access token is valid",
            });
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return await handleTokenExpired(
                    refreshToken,
                    AdminRefreshTokenSecret,
                    AdminAccessTokenSecret,
                    res
                );
            }
        }
    } catch (err) {
        if (req.cookies.accessToken) {
            res.clearCookie("accessToken");
        }
        if (req.cookies.refreshToken) {
            res.clearCookie("refreshToken");
        }
        console.log("Error in Admin checkAuth: ", err);
        return res.status(500).json({ message: err.message });
    }
});

module.exports = router;
