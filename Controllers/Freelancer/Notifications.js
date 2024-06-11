// const { Clients } = require("../../Models/Client");
const { Freelancer_Notifications } = require("../../Models/Notifications");
const GetNotifications = async (req, res) => {
    const userId = req.decoded.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized , missing userId" });
    try {
        const notifications = await Freelancer_Notifications.findAll({
            where: {
                FreelancerId: userId,
            },
            order: [["createdAt", "DESC"]],
        });
        if (!notifications)
            return res.status(404).json({ error: "No notifications found." });
        return res.status(200).json({ Notifications: notifications });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { GetNotifications };
