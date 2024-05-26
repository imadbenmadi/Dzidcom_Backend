// Privacy & Terms
const Privacy = require("../Models/Privacy").Privacy;
const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
    const Content = Privacy.findAll();
    res.json(Content);
});
// router.post("/", );

module.exports = router;
