const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3500",
];
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error(`Not allowed by CORS , origin : ${origin}`));
        }
    },
    optionsSuccessStatus: 200,
};
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header("Access-Control-Allow-Credentials", true);
    }
    next();
};
require("dotenv").config();

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const multer = require("multer");
// app.use(multer().none());

app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/", express.static(path.join(__dirname, "/public/ProfilePics")));
app.use("/", express.static(path.join(__dirname, "/public/Work")));
app.use("/", express.static(path.join(__dirname, "/Public/Portfolio")));

app.get("/", (req, res) => {
    res.send("Hello from DzidCom");
});
app.use("/check_Auth", require("./Routes/Auth/check_Auth"));
app.use("/Login", require("./Routes/Auth/Login"));
app.use("/Register", require("./Routes/Auth/Register"));
app.use("/Logout", require("./Routes/Auth/Logout"));

app.use("/Contact", require("./Routes/Contact"));

app.use("/Freelancers", require("./Routes/Freelancers"));
app.use("/Clients", require("./Routes/Clients"));
app.use("/upload", require("./Routes/Uploads/Upload"));

app.use("/Admin_Login", require("./Routes/Auth/Admin/Admin_Login"));
app.use("/Add_Admin", require("./Routes/Auth/Admin/Admin_Add"));
app.use("/Admin", require("./Routes/Admin/Admin"));

const { Freelancers } = require("./Models/Freelnacer");
const { Clients } = require("./Models/Client");
const { Applications } = require("./Models/Applications");
const { Messages } = require("./Models/Messages");
const { Skills } = require("./Models/Freelnacer");
const { PortfolioItems } = require("./Models/Freelnacer");
const { Contact_Messages } = require("./Models/Contact_Messages");
const { Notifications } = require("./Models/Notifications");
const { Projects } = require("./Models/Project");
// app.use("/Jobs", require("./Routes/Jobs"));

// app.use("/Dashboard/Login", require("./Routes/Dashboard/Admin_Login"));
// app.use(
//     "/Dashboard/check_Auth",
//     require("./Routes/Dashboard/check_Admin_Auth")
// );
// app.use("/Dashboard/Users", require("./Routes/Dashboard/Users"));
// app.use("/Dashboard/Courses", require("./Routes/Dashboard/Courses"));
// app.use("/Dashboard/Services", require("./Routes/Dashboard/Servicecs"));
// app.use("/Dashboard/Blogs", require("./Routes/Dashboard/Blogs"));
// app.use("/Dashboard/Events", require("./Routes/Dashboard/Events"));
// app.use("/Dashboard/AddAdmin", require("./Routes/Dashboard/Add_Admin"));

// app.use("/Dashboard", require("./Routes/Dashboard/Dashboard"));
// app.use(verifyJWT);

app.listen(3000);

module.exports = app;
