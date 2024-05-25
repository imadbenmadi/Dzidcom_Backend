const express = require("express");
const router = express.Router();

const Client_Middlware = require("../Middlewares/Client");
const ClientController = require("../Controllers/Client");
router.get("/:userId/Profile", Client_Middlware, ClientController.getProfile);
router.put("/:userId/Profile", Client_Middlware, ClientController.EditeProfile);

module.exports = router;
