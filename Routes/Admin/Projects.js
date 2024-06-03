const express = require("express");
const router = express.Router();
const { Projects } = require("../../Models/Project");
const Admin_midllware = require("../../Middlewares/Admin");

router.get("/requests", Admin_midllware, async (req, res) => {
    try {
        const requests = await Projects.findAll({
            where: { Status: "Pending" },
        });
        res.status(200).json({ Projects: requests });
    } catch (err) {
        console.error("Error fetching Project Requests:", err);
        res.status(500).json({ message: err });
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

            await Project.update({ Status: "Approved" });

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

            await Project.update({ Status: "Rejected" });

            res.status(200).json({ message: "Project Rejected" });
        } catch (err) {
            console.error("Error fetching Project Requests:", err);
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
