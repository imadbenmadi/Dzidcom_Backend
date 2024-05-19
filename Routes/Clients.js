const express = require("express");
const router = express.Router();
const User_Middlware = require("../Middlewares/User");
const ClientController = require("../Controllers/Client");
router.get("/:userId/Profile", User_Middlware, ClientController.getProfile);
router.put("/:userId/Profile", User_Middlware, ClientController.EditeProfile);

module.exports = router;
