const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Freelancers = require("../../Models/Freelnacer");
const Clients = require("../../Models/Client");
const Refresh_tokens = require("../../Models/RefreshTokens");

const handleLogin = async (req, res) => {
    try {
        const { email, password, userType } = req.body;
        if (!email || !password) {
            return res.status(409).json({ message: "Missing Data" });
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            return res.status(409).json({ message: "Invalid email" });
        } else if (userType !== "client" && userType !== "freelancer") {
            return res.status(409).json({ message: "Invalid user type" });
        }
        let user = null;
        if (userType === "client") {
            user = await Clients.findOne({ where: { email: email } }); // Added 'where' keyword
        } else if (userType === "freelancer") {
            user = await Freelancers.findOne({ where: { email: email } }); // Added 'where' keyword
        }
        if (user && user.password === password) {
            const accessToken = jwt.sign(
                { userId: user._id },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "5m" }
            );
            const refreshToken = jwt.sign(
                { userId: user._id },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d" }
            );

            try {
                await Refresh_tokens.create({
                    userId: user._id,
                    token: refreshToken,
                });
            } catch (err) {
                return res.status(500).json({
                    message: err,
                });
            }
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 60 * 60 * 1000,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                sameSite: "None",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            });
            if (req.cookies.admin_accessToken) {
                res.clearCookie("admin_accessToken");
            }
            if (req.cookies.admin_refreshToken) {
                res.clearCookie("admin_refreshToken");
            }
            // const today = new Date();
            // const lastMonth = new Date(
            //     today.getFullYear(),
            //     today.getMonth() - 1,
            //     today.getDate()
            // );
            // // Filter notifications that are unread or from the last month
            // const notificationsToSend = user.Notifications.filter(
            //     (notification) => {
            //         // Include notification if it's unread or from the last month
            //         return (
            //             !notification.Readed || notification.Date >= lastMonth
            //         );
            //     }
            // );
            // const UserData_To_Send = {
            //     id: user.id,
            //     email: user.email,
            //     FirstName: user.FirstName,
            //     LastName: user.LastName,
            //     // Notifications: notificationsToSend,
            //     Courses: user.Courses,
            //     Services: user.Services,
            //     Gender: user.Gender,
            //     IsemailVerified: user.IsemailVerified,
            // };
            return res.status(200).json({
                message: "Logged In Successfully",
                // userData: UserData_To_Send,
                // jwt: accessToken,
            });
        } else {
            return res.status(401).json({
                message: "Username or password isn't correct",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};
router.post("/", handleLogin);

module.exports = router;
