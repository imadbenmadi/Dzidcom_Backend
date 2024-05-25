const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Clients } = require("../Models/Client");
const { Refresh_tokens } = require("../Models/RefreshTokens");

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.Client_ACCESS_TOKEN_SECRET
        );
        let userId = null;
        // let userType = null;
        // console.log(req);
        if (req.body.userId) userId = req.body.userId;
        else if (req.params.userId && !userId) userId = req.params.userId;
        else if (reqlog.query.userId && !userId) userId = req.query.userId;
        else if (req.userId && !userId) userId = req.userId;
        if (!userId)
            return res
                .status(401)
                .json({ message: "unauthorized : User Id is required" });

        if (!decoded)
            return res.status(401).json({
                message:
                    "unauthorized : Invalid access token , decoded not found",
            });
        else if (!decoded.userId || !decoded.userType)
            return res.status(401).json({
                message:
                    "unauthorized : Invalid access token , decoded.userId || decoded.userType not found",
            });
        else if (decoded.userId != userId)
            return res.status(401).json({
                message:
                    "unauthorized : Invalid access token , decoded.userId != userId",
            });
        else if (decoded.userType == "client") {
            let client = await Clients.findOne({
                where: { id: decoded.userId },
            });
            if (!client) {
                return res.status(401).json({
                    message: "unauthorized : Invalid access token , !client",
                });
            }
            req.user = client;
        } else if (decoded.userType != "client") {
            return res.status(401).json({
                message: "unauthorized : Invalid access token ",
            });
        } else
            return res.status(401).json({
                message: "unauthorized : Invalid access token ",
            });

        req.decoded = decoded;
        return next();
    } catch (err) {
        console.log(err);
        if (err.name === "TokenExpiredError") {
            if (!refreshToken) {
                return res
                    .status(401)
                    .json({ message: "unauthorized : Refresh token required" });
            }

            try {
                const foundInDB = await Refresh_tokens.findOne({
                    where: {
                        token: refreshToken,
                    },
                });

                if (!foundInDB) {
                    return res.status(403).json({
                        message: "unauthorized : Invalid refresh token",
                    });
                }

                jwt.verify(
                    refreshToken,
                    process.env.Client_REFRESH_TOKEN_SECRET,
                    async (err, decoded) => {
                        if (err || foundInDB.userId !== decoded.userId) {
                            return res.status(403).json({
                                message: "unauthorized : Invalid refresh token",
                            });
                        }
                        let newAccessToken = null;
                        if (decoded.userType == "client") {
                            newAccessToken = jwt.sign(
                                {
                                    userId: decoded.userId,
                                    userType: decoded.userType,
                                },
                                process.env.Client_ACCESS_TOKEN_SECRET,
                                { expiresIn: "1h" }
                            );
                        }
                        res.cookie("accessToken", newAccessToken, {
                            httpOnly: true,
                            sameSite: "None",
                            secure: true,
                            maxAge: 60 * 60 * 1000,
                        });

                        req.decoded = decoded;
                        return next();
                    }
                );
            } catch (refreshErr) {
                return res
                    .status(403)
                    .json({ message: "Invalid refresh token" });
            }
        } else {
            return res.status(401).json({ message: "Invalid access token" });
        }
    }
};

module.exports = verifyUser;
