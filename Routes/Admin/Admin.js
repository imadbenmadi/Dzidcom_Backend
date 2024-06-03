const express = require("express");
const router = express.Router();
const { Admins } = require("../../Models/Admin/Admin");
const { Projects } = require("../../Models/Project");

const Admin_midllware = require("../../Middlewares/Admin");
router.get("/Admins", Admin_midllware, async (req, res) => {
    try {
        const admins = await Admins.findAll().select([
            "id",
            "email",
            "firstName",
            "lastName",
            "telephone",
        ]);
        res.status(200).json(admins);
    } catch (err) {
        console.error("Error fetching Admins:", err);
        res.status(500).json({ message: err });
    }
});
router.use("/Projects", require("./Projects"));
router.use("/Applications", require("./Applications"));
module.exports = router;
