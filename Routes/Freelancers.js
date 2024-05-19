const express = require("express");
const router = express.Router();
const User_Middlware = require("../Middlewares/User");
const FreelancerController = require("../Controllers/Freelancer");
router.get("/:userId/Profile", User_Middlware, FreelancerController.getProfile);
router.put(
    "/:userId/Profile",
    User_Middlware,
    FreelancerController.EditeProfile
);

module.exports = router;
