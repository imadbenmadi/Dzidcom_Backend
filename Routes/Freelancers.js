const express = require("express");
const router = express.Router();
const User_Middlware = require("../Middlewares/User");

router.get("/:userId/Profile", UserController.getProfile);
// router.get("/:userId", UserController.getUser);
router.put("/:userId", UserController.EditProfile);
