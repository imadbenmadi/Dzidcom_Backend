const {Freelacers} = require("../../Models/Freelnacer");

const getProfile = async (req, res) => {
    const userId = req.body.userId;
    try {
        const user_in_db = await Freelacers.findByPk(userId, {
            attributes: { exclude: ["password"] },
            include: [
                { model: PortfolioItem, as: "portfolioItems" },
                { model: Skills, as: "Skills" },
                { model: SocialMedia, as: "socialMediaLinks" },
            ],
        });
        console.log(user_in_db);
        if (!user_in_db) {
            return res.status(404).json({ error: "user not found." });
        }
        return res.status(200).json(user_in_db);
    } catch (error) {
        return res.status(500).json({ error: error });
    }
};

module.exports = { getProfile };