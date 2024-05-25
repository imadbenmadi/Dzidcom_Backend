const express = require("express");
const router = express.Router();
const Upload_Client_ProfilePic = require("./ProfilePic/Client_ProfilePic");
const Upload_Freelancer_ProfilePic = require("./ProfilePic/Freelancer_ProfilePic");
const Freelancer_Middlware = require("../../Middlewares/Freelanccer");
const Client_Middlware = require("../../Middlewares/Client");

const formidableMiddleware = require("express-formidable");
router.use(formidableMiddleware());
router.post(
    "/Client/ProfilePic",
    (req, res, next) => {
        req.body = req.fields;
        next();
    },
    Client_Middlware,
    Upload_Client_ProfilePic
);
router.post(
    "/Freelancer/ProfilePic",
    (req, res, next) => {
        req.body = req.fields;
        next();
    },
    Freelancer_Middlware,
    Upload_Freelancer_ProfilePic
);
module.exports = router;
