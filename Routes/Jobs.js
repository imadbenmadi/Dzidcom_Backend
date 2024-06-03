const express = require("express");
const router = express.Router();
const { Projects } = require("../Models/Project");
const { Applications } = require("../Models/Applications");
const Freelancer_Middleware = require("../Middlewares/Freelancer");

router.get("/", Freelancer_Middleware, async (req, res) => {
    try {
        const requests = await Projects.findAll({
            where: { Status: "Pending" },
        });
        res.status(200).json({ Projects: requests });
    } catch (err) {
        console.error("Error fetching Project Requests:", err);
        res.status(500).json({ message: err.message });
    }
});

router.get("/:projectId", Freelancer_Middleware, async (req, res) => {
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

router.post("/:projectId/Apply", Freelancer_Middleware, async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId)
        return res
            .status(409)
            .json({ message: "Missing data, project ID is required" });

    const freelancerId = req.body.freelancerId;
    if (!freelancerId)
        return res
            .status(409)
            .json({ message: "Missing data, freelancer ID is required" });

    try {
        const Project = await Projects.findOne({
            where: { id: projectId },
        });
        if (!Project)
            return res.status(404).json({ message: "Project not found" });

        await Applications.create({
            ProjectId: projectId,
            FreelancerId: freelancerId,
            ProjectTitle: Project.Title,
            ProjectDescription: Project.Description,
        });

        res.status(200).json({ message: "Application submitted successfully" });
    } catch (err) {
        console.error("Error applying for project:", err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
