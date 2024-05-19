const {
    Freelancers,
    Skills,
    PortfolioItems,
    Freelancer_SocialMediaLinks,
} = require("../../Models/Freelnacer");

const EditeProfile = async (req, res) => {
    const userId = req.params.userId;
    const newData = req.body;

    try {
        // Find the freelancer by their ID
        const freelancer = await Freelancers.findByPk(userId);

        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found." });
        }

        await freelancer.update(newData);

        if (newData.Skills) {
            await Skills.destroy({ where: { FreelancerId: freelancer.id } });
            await Skills.bulkCreate(
                newData.Skills.map((skill) => ({
                    ...skill,
                    FreelancerId: freelancer.id,
                }))
            );
        }

        if (newData.PortfolioItems) {
            await PortfolioItems.destroy({
                where: { FreelancerId: freelancer.id },
            });
            await PortfolioItems.bulkCreate(
                newData.PortfolioItems.map((item) => ({
                    ...item,
                    FreelancerId: freelancer.id,
                }))
            );
        }

        if (newData.Freelancer_SocialMediaLinks) {
            await Freelancer_SocialMediaLinks.destroy({
                where: { FreelancerId: freelancer.id },
            });
            await Freelancer_SocialMediaLinks.bulkCreate(
                newData.Freelancer_SocialMediaLinks.map((link) => ({
                    ...link,
                    FreelancerId: freelancer.id,
                }))
            );
        }

        return res
            .status(200)
            .json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { EditeProfile };
