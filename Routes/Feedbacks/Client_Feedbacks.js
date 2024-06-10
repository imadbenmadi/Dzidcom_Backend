const express = require("express");
const router = express.Router();
const Admin_midllware = require("../../Middlewares/Admin");
const {
    Client_Feedbacks,
    Freelancer_Feedbacks,
} = require("../../Models/Feedbacks");
const { Projects } = require("../../Models/Project");

router.get("/Client_Feedbacks", Admin_midllware, async (req, res) => {
    try {
        const client_Feedbacks = await Client_Feedbacks.findAll({
            where: {},
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ Client_Feedbacks: client_Feedbacks });
    } catch (err) {
        console.error("Error fetching Project Applications:", err);
        res.status(500).json({ message: err });
    }
});
router.get("/Freelancer_Feedbacks", Admin_midllware, async (req, res) => {
    try {
        const freelancer_Feedbacks = await Freelancer_Feedbacks.findAll({
            where: {},
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json({ Freelancer_Feedbacks: freelancer_Feedbacks });
    } catch (err) {
        console.error("Error fetching Project Applications:", err);
        res.status(500).json({ message: err });
    }
});

router.post;
