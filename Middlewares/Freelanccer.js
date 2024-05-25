const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Refresh_tokens } = require("../Models/RefreshTokens");

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    // if (!accessToken) {
    //     return res.status(401).json({ message: "Access token required" });
    // }
    try {
        const decoded = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );
        // const userId = req.body.userId || req.params.userId || req.query.userId;
        let userId = null;
        // console.log(req);
        if (req.body.userId) userId = req.body.userId;
        else if (req.params.userId && !userId) userId = req.params.userId;
        else if (req.userId && !userId) userId = req.userId;
        if (!userId)
            return res
                .status(401)
                .json({ message: "unauthorized : User Id is required" });

        // console.log("userId", userId);
        // console.log("decoded user id", decoded.userId);
        // console.log("decoded.userId == userId", decoded.userId == userId);
        if (req.body.userType) userType = req.body.userType;
        else if (req.params.userType && !userType)
            userType = req.params.userType;
        else if (req.userType && !userType) userType = req.userType;
        if (!userType)
            return res.status
                .status(401)
                .json({ message: "unauthorized : User Type is required" });
        else if (userType != "freelancer" && userType != "client")
            return res
                .status(401)
                .json({ message: "unauthorized : Invalid User Type" });

        if (!decoded)
            return res
                .status(401)
                .json({ message: "unauthorized : Invalid access token" });
        else if (decoded.userId != userId)
            return res
                .status(401)
                .json({ message: "unauthorized : Invalid access token" });
        req.decoded = decoded;
        return next();
    } catch (err) {
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
                    process.env.REFRESH_TOKEN_SECRET,
                    async (err, decoded) => {
                        if (err || foundInDB.userId !== decoded.userId) {
                            return res.status(403).json({
                                message: "unauthorized : Invalid refresh token",
                            });
                        }

                        const newAccessToken = jwt.sign(
                            {
                                userId: decoded.userId,
                                userType: decoded.userType,
                            },
                            process.env.ACCESS_TOKEN_SECRET,
                            { expiresIn: "1h" }
                        );

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
