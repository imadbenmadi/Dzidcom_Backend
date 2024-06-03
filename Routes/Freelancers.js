const express = require("express");
const router = express.Router();
const Freelancer_Middlware = require("../Middlewares/Freelancer");
const FreelancerController = require("../Controllers/Freelancer");
router.get(
    "/:userId/Profile",
    Freelancer_Middlware,
    FreelancerController.getProfile
);
router.put(
    "/:userId/Profile",
    Freelancer_Middlware,
    FreelancerController.EditeProfile
);
router.use("/:userId/Jobs", require("./Jobs"));
module.exports = router;
