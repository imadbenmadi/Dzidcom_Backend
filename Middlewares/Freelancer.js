const jwt = require("jsonwebtoken");
require("dotenv").config();
const { Freelancers } = require("../Models/Freelnacer");
const { Refresh_tokens } = require("../Models/RefreshTokens");

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // console.log("daata from freelancer : ", req.cookies);
    // console.log("daata from freelancer : ", accessToken, refreshToken);
    // console.log("daata from freelancer : ", req);
    try {
        let decoded = null;

        decoded = jwt.verify(
            accessToken,
            process.env.Freelancer_ACCESS_TOKEN_SECRET
        );
        if (!decoded.userId || !decoded.userType)
            return res.status(401).json({
                message: "unauthorized : Invalid tokens",
            });
        else if (decoded.userType != "freelancer") {
            return res.status(401).json({
                message: "unauthorized : Invalid tokens ",
            });
        } else if (decoded.userType == "freelancer") {
            let freelancer = await Freelancers.findOne({
                where: { id: decoded.userId },
            });
            if (!freelancer) {
                return res.status(401).json({
                    message: "unauthorized : Invalid tokens ",
                });
            }
            req.user = freelancer;
        } else if (decoded.userType != "freelancer") {
            return res.status(401).json({
                message: "unauthorized : Invalid tokens ",
            });
        } else
            return res.status(401).json({
                message: "unauthorized : Invalid tokens ",
            });

        req.decoded = decoded;
        return next();
    } catch (err) {
        console.log(err);
        if (err.name !== "TokenExpiredError" || !refreshToken) {
            return res.status(401).json({ message: "Invalid tokens" });
        } else if (err.name === "TokenExpiredError" || !accessToken) {
            if (!refreshToken) {
                return res.status(401).json({
                    message: "unauthorized : Refresh token required",
                });
            }

            try {
                const foundInDB = await Refresh_tokens.findOne({
                    where: {
                        token: refreshToken,
                    },
                });

                if (!foundInDB) {
                    return res.status(401).json({
                        message: "unauthorized : Invalid tokens",
                    });
                }

                jwt.verify(
                    refreshToken,
                    process.env.Freelancer_REFRESH_TOKEN_SECRET,
                    async (err, decoded) => {
                        if (err || foundInDB.userId !== decoded.userId) {
                            return res.status(401).json({
                                message: "unauthorized : Invalid tokens",
                            });
                        }
                        if (decoded.userType == "freelancer") {
                            let newAccessToken = jwt.sign(
                                {
                                    userId: decoded.userId,
                                    userType: decoded.userType,
                                },
                                process.env.Freelancer_ACCESS_TOKEN_SECRET,
                                { expiresIn: "1h" }
                            );

                            res.cookie("accessToken", newAccessToken, {
                                httpOnly: true,
                                sameSite: "None",
                                secure: true,
                                maxAge: 60 * 60 * 1000,
                            });
                            req.decoded = decoded;
                        } else
                            res.status(401).json({
                                message: "unauthorized  : Invalid tokens",
                            });

                        return next();
                    }
                );
            } catch (refreshErr) {
                return res.status(401).json({ message: "Invalid tokens" });
            }
        } else {
            return res.status(401).json({ message: "Invalid tokens" });
        }
    }
};

module.exports = verifyUser;
