const { Clients } = require("../../Models/Client");
const { SocialMediaLinks } = require("../../Models/Client");
const getProfile = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user_in_db = await Clients.findByPk(userId, {
            attributes: { exclude: ["password"] },
            include: [
                {
                    model: SocialMediaLinks,
                    as: "SocialMediaLinks",
                },
            ],
        });
        console.log(user_in_db);
        if (!user_in_db) {
            return res.status(404).json({ error: "user not found." });
        }
        return res.status(200).json({ User: user_in_db });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

module.exports = { getProfile };
