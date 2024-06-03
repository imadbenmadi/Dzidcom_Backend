const express = require("express");
const router = express.Router();

const Client_Middlware = require("../Middlewares/Client");
const ClientController = require("../Controllers/Client");
router.get("/:userId/Profile", Client_Middlware, ClientController.getProfile);
router.put("/:userId/Profile", Client_Middlware, ClientController.EditeProfile);

router.get("/:userId/Projects", Client_Middlware, ClientController.GetProjcts);
router.get(
    "/:userId/Projects/:projectId",
    Client_Middlware,
    ClientController.GetProject
);
router.post("/:userId/Projects", Client_Middlware, ClientController.AddProject);
router.delete(
    "/:userId/Projects/:projectId",
    Client_Middlware,
    ClientController.DeleteProject
);

router.get("/:userId/Payment/:projectId/status", Client_Middlware, ClientController.PaymentStatus);
module.exports = router;
