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
                ProjectId: projectId
            },
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
    "/:projectId/:ApplicationId/Accept",
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
                    status: "Accepted",
                },
                {
                    where: {
                        id: ApplicationId,
                    },
                }
            );
            const Project = await Projects.findOne({
                where: { id: projectId },
            });
            await Project.update({
                status: "Accepted",
            });
            res.status(200).json({ message: "Application Approved" });
        } catch (err) {
            console.error("Error fetching Project Applications:", err);
            res.status(500).json({ message: err });
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
