// const { Clients } = require("../../Models/Client");
const { Projects } = require("../../../Models/Project");
const { Clients } = require("../../../Models/Client");
const { Rejection_Resons } = require("../../../Models/Rejection_Resons");
const Accept_work = async (req, res) => {
    const userId = req.decoded.userId;
    const projectId = req.params.projectId;
    // const Reason = req.body.Reason;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized , missing userId" });
    else if (!projectId)
        return res
            .status(400)
            .json({ error: "Please provide the project ID." });
    // else if (!Reason)
    //     return res.status(400).json({ error: "Please provide the Reason." });
    try {
        // Find the Client by their ID
        const Client = await Clients.findByPk(userId);
        if (!Client) {
            return res.status(404).json({ error: "Client not found." });
        }
        const Project = await Projects.findByPk(projectId);
        if (!Project) {
            return res.status(404).json({ error: "Project not found." });
        }
        if (Project.ClientId !== userId) {
            return res.status(401).json({
                error: "You are not authorized to accept this project.",
            });
        }
        await Project.update({
            status: "Completed",
            isProjectDone: true,
            isWorkRejected: false,
            isWorkUploaded: true,
        });
        return res.status(200).json({ message: "Work Accepted successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};
const Reject_work = async (req, res) => {
    const userId = req.decoded.userId;
    const projectId = req.params.projectId;
    const Reason = req.body.Reason;
    if (!userId)
        return res.status(401).json({ error: "Unauthorized , missing userId" });
    else if (!projectId)
        return res
            .status(400)
            .json({ error: "Please provide the project ID." });
    else if (!Reason)
        return res.status(400).json({ error: "Please provide the Reason." });
    try {
        // Find the Client by their ID
        const Client = await Clients.findByPk(userId);
        if (!Client) {
            return res.status(404).json({ error: "Client not found." });
        }
        const Project = await Projects.findByPk(projectId);
        if (!Project) {
            return res.status(404).json({ error: "Project not found." });
        }
        if (Project.ClientId !== userId) {
            return res.status(401).json({
                error: "You are not authorized to reject this project.",
            });
        }
        await Project.update({ isWorkRejected: true });
        await Rejection_Resons.create({
            ClientId: userId,
            FreelancerId: Project.FreelancerId,
            ProjectId: projectId,
            Reason,
        });
        return res.status(200).json({ message: "Work Rejected successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { Accept_work, Reject_work };
