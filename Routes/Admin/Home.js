const express = require("express");
const router = express.Router();
const { Projects } = require("../../Models/Project");
const Admin_midllware = require("../../Middlewares/Admin");
const { Op } = require("sequelize");

const { Freelancers } = require("../../Models/Freelnacer");
const { Clients } = require("../../Models/Client");
const { Projects } = require("../../Models/Project");
const { Applications } = require("../../Models/Applications");
router.get("/", Admin_midllware, async (req, res) => {
    try {
        const freelancers = await Freelancers.count({
            where: {},
        });
        const clients = await Clients.count({
            where: {},
        });
        const projects = await Projects.count({
            where: {},
        });
        const payments = await Projects.count({
            where: { status: "Payed" },
        });
        const applications = await Applications.count({
            where: {},
        });
        if (!freelancers) freelancers = 0;
        if (!clients) clients = 0;
        res.status(200).json({
            Freelancers: freelancers,
            Clients: clients,
            Projects: projects,
            Payments: payments,
            Applications: applications,
        });
    } catch (err) {
        console.error("Error fetching Project Applications:", err);
        res.status(500).json({ message: err });
    }
});

module.exports = router;
