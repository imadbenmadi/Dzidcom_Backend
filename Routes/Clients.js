const express = require("express");
const router = express.Router();

const Client_Middlware = require("../Middlewares/Client");
const ClientController = require("../Controllers/Client");
router.get("/:userId/Profile", Client_Middlware, ClientController.getProfile);
router.put("/:userId/Profile", Client_Middlware, ClientController.EditeProfile);

router.get("/:userId/Project", Client_Middlware, ClientController.GetProjcts);
router.post("/:userId/Project", Client_Middlware, ClientController.AddProject);
router.delete(
    "/:userId/Project/:projectId",
    Client_Middlware,
    ClientController.DeleteProject
);
module.exports = router;
