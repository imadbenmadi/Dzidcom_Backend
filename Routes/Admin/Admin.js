const express = require("express");
const router = express.Router();
const { Admins } = require("../../Models/Admin/Admin");

router.get("/Admins", async (req, res) => {
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
module.exports = router;
