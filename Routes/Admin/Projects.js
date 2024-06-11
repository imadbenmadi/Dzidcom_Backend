const express = require("express");
const router = express.Router();
const { Projects } = require("../../Models/Project");
const Admin_midllware = require("../../Middlewares/Admin");
const { Client_Notifications } = require("../../Models/Notifications");
router.get("/requests", Admin_midllware, async (req, res) => {
    try {
        const requests = await Projects.findAll({
            where: { status: "Pending" },
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ Projects: requests });
    } catch (err) {
        console.error("Error fetching Project Requests:", err);
        res.status(500).json({ message: err });
    }
});
router.get("/requests/:projectId", Admin_midllware, async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId) return res.status(409).json({ message: "Missing data" });
    try {
        const project = await Projects.findOne({
            where: { id: projectId },
        });
        if (!project)
            return res.status(404).json({ message: "Project not found" });

        res.status(200).json({ project });
    } catch (err) {
        console.error("Error fetching Project:", err);
        res.status(500).json({ message: err.message });
    }
});
router.post(
    "/requests/:projectId/Accept",
    Admin_midllware,
    async (req, res) => {
        const projectId = req.params.projectId;
        if (!projectId)
            return res.status(409).json({ message: "Missing data" });
        try {
            const Project = await Projects.findOne({
                where: { id: projectId },
            });
            if (!Project)
                return res.status(404).json({ message: "Project not found" });

            await Project.update({ status: "Accepted" });
            try {
                await Client_Notifications.create({
                    title: "Project Accepted",
                    text: "We have accepted the project you requested. Click here to see the rest of the details",
                    type: "Project_Accepted",
                    ClientId: Project.ClientId,
                    link: `/Client/Projects/${Project.id}`,
                });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ message: "Project Approved" });
        } catch (err) {
            console.error("Error fetching Project Requests:", err);
            res.status(500).json({ message: err.message });
        }
    }
);
router.post(
    "/requests/:projectId/Reject",
    Admin_midllware,
    async (req, res) => {
        const projectId = req.params.projectId;
        if (!projectId)
            return res.status(409).json({ message: "Missing data" });
        try {
            const Project = await Projects.findOne({
                where: { id: projectId },
            });
            if (!Project)
                return res.status(404).json({ message: "Project not found" });

            await Project.update({ status: "Rejected" });
            try {
                await Client_Notifications.create({
                    title: "Project refused",
                    text: "It was rejected for a number of reasons related to our platform, Click here to create a new project",
                    type: "Projet_refused",
                    ClientId: Project.ClientId,
                    link: `/Client/Projects/${Project.id}`,
                });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
            res.status(200).json({ message: "Project Rejected" });
        } catch (err) {
            console.error("Error fetching Project Requests:", err);
            res.status(500).json({ message: err.message });
        }
    }
);
// router.use("/:projectId/Applications", require("./Applications"));
module.exports = router;
