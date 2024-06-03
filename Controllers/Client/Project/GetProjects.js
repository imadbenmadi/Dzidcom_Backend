// const { Clients } = require("../../Models/Client");
const { Projects } = require("../../../Models/Project");
const GetProjcts = async (req, res) => {
    const userId = req.decoded.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized , missing userId" });
    try {
        const project = await Projects.findAll({
            where: {
                ClientId: userId,
            },
            order: [["createdAt", "DESC"]],
        });
        if (!project)
            return res.status(404).json({ error: "No projects found." });
        return res.status(200).json({ Project: project });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { GetProjcts };
