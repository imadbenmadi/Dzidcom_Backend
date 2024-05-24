const {
    Freelancers,
    Skills,
    PortfolioItems,
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
        if (newData.Skills && newData.Skills.length > 0) {
            // Ensure newData.Skills is an array of strings
            const skills = newData.Skills.map((skill) => ({
                skill: skill, // Use the skill name directly
                FreelancerId: freelancer.id,
            }));

            // Destroy existing skills
            await Skills.destroy({ where: { FreelancerId: freelancer.id } });

            // Create new skills
            await Skills.bulkCreate(skills);
        } else if (newData.Skills && newData.Skills.length == 0) {
            await Skills.destroy({ where: { FreelancerId: freelancer.id } });
        }
        console.log(newData.PortfolioItems);
        if (newData.PortfolioItems && newData.PortfolioItems.length > 0) {
            const portfolioItems = newData.PortfolioItems.map((item) => ({
                ...item,
                FreelancerId: freelancer.id,
            }));

            // Destroy existing portfolio items
            await PortfolioItems.destroy({
                where: { FreelancerId: freelancer.id },
            });

            // Create new portfolio items
            await PortfolioItems.bulkCreate(portfolioItems);
        } else if (
            newData.PortfolioItems &&
            newData.PortfolioItems.length == 0
        ) {
            await PortfolioItems.destroy({
                where: { FreelancerId: freelancer.id },
            });
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user: freelancer,
            
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { EditeProfile };
