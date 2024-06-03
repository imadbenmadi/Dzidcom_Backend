const express = require("express");
const router = express.Router();
const { Projects } = require("../../Models/Project");
const Admin_midllware = require("../../Middlewares/Admin");
const { Op } = require("sequelize");
const { Applications } = require("../../Models/Applications");
router.get("/", Admin_midllware, async (req, res) => {
    try {
        const applications = await Applications.findAll({
            // where: { status: "Pending" },
            where: {},
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ Applications: applications });
    } catch (err) {
        console.error("Error fetching Project Applications:", err);
        res.status(500).json({ message: err });
    }
});

router.get("/:projectId", Admin_midllware, async (req, res) => {
    const projectId = req.params.projectId;
    if (!projectId)
        return res
            .status(409)
            .json({ message: "Missing data ProjectId is required" });
    try {
        const applications = await Applications.findAll({
            where: {
                // status: "Pending",
                ProjectId: projectId,
            },
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ Applications: applications });
    } catch (err) {
        console.error("Error fetching Project Applications:", err);
        res.status(500).json({ message: err });
    }
});
router.get("/:projectId/:ApplicationId", Admin_midllware, async (req, res) => {
    const projectId = req.params.projectId;
    const ApplicationId = req.params.ApplicationId;
    if (!projectId)
        return res
            .status(409)
            .json({ message: "Missing data ProjectId is required" });
    else if (!ApplicationId)
        return res
            .status(409)
            .json({ message: "Missing data ApplicationId is required" });
    try {
        const applications = await Applications.findOne({
            where: {
                // status: "Pending",
                ProjectId: projectId,
                id: ApplicationId,
            },
        });
        res.status(200).json({ Application: applications });
    } catch (err) {
        console.error("Error fetching Project Applications:", err);
        res.status(500).json({ message: err });
    }
});

router.post(
    "/:projectId/:applicationId/accept",
    Admin_midllware,
    async (req, res) => {
        const { projectId, applicationId } = req.params;

        if (!projectId) {
            return res
                .status(409)
                .json({ message: "Missing data: ProjectId is required" });
        }

        if (!applicationId) {
            return res
                .status(409)
                .json({ message: "Missing data: ApplicationId is required" });
        }

        try {
            const application = await Applications.findOne({
                where: { ProjectId: projectId, id: applicationId },
            });
            console.log(application.FreelancerId);
            if (!application) {
                return res
                    .status(404)
                    .json({ message: "Application not found" });
            }

            const project = await Projects.findOne({
                where: { id: projectId },
            });

            if (!project) {
                return res.status(404).json({ message: "Project not found" });
            }

            await Applications.update(
                { status: "Accepted" },
                { where: { id: applicationId } }
            );

            await Projects.update(
                { FreelancerId: application.FreelancerId },
                { where: { id: projectId } }
            );

            res.status(200).json({ message: "Application Approved" });
        } catch (err) {
            console.error("Error processing application approval:", err);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
);
router.post(
    "/:projectId/:ApplicationId/Reject",
    Admin_midllware,
    async (req, res) => {
        const projectId = req.params.projectId;
        const ApplicationId = req.params.ApplicationId;
        if (!projectId)
            return res
                .status(409)
                .json({ message: "Missing data ProjectId is required" });
        else if (!ApplicationId)
            return res
                .status(409)
                .json({ message: "Missing data ApplicationId is required" });
        try {
            const application = await Applications.findOne({
                where: {
                    // status: "Pending",
                    ProjectId: projectId,
                    id: ApplicationId,
                },
            });
            if (!application)
                return res
                    .status(404)
                    .json({ message: "Application not found" });

            await Applications.update(
                {
                    status: "Rejected",
                },
                {
                    where: {
                        id: ApplicationId,
                    },
                }
            );

            res.status(200).json({ message: "Application Rejected" });
        } catch (err) {
            console.error("Error fetching Project Applications:", err);
            res.status(500).json({ message: err });
        }
    }
);

module.exports = router;
