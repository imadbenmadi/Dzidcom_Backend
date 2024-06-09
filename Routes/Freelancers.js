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
router.use("/Jobs", require("./Jobs"));

router.get(
    "/:userId/Process",
    Freelancer_Middlware,
    FreelancerController.GetProcess
);
router.get(
    "/:userId/Process/:projectId",
    Freelancer_Middlware,
    FreelancerController.GetProcess_item
);
module.exports = router;
