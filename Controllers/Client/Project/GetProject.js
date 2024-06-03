// const { Clients } = require("../../Models/Client");
const { Projects } = require("../../../Models/Project");
const GetProjcts = async (req, res) => {
    const projectId = req.body.projectId;
    const userId = req.decoded.userId;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized , missing userId" });
    try {
        const projects = await Projects.findOne({
            where: {
                id: projectId,
                ClientId: userId,
            },
        });
        return res.status(200).json({ Projects: projects });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { GetProjcts };
