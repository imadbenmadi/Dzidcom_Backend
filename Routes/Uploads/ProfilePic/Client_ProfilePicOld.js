const multer = require("multer");
const path = require("path");
const { Clients } = require("../../../Models/Client");

// Configure storage for Client profile pics
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/ProfilePics/");
    },
    filename: (req, file, cb) => {
        const ClientId = req.body.ClientId;
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = `Client-${ClientId}-${Date.now()}${fileExtension}`;
        req.uploadedFilename = uniqueSuffix;
        cb(null, uniqueSuffix);
    },
});

// Initialize Multer with file size limit
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );

        if (mimeType && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only .png, .jpg and .jpeg formats allowed!"));
        }
    },
}).single("ProfilePic");

// Upload handler
const Upload_Client_ProfilePic = (req, res) => {
    const Client = Clients.findOne({
        where: { id: req.userId },
    });
    console.log("req.body", req.body);
    console.log("-------------------------");
    if (!Client) {
        return res.status(404).send({ message: "Client not found" });
    }

    if (Client.profile_pic_link) {
        // Extract the filename from the profile picture link
        const previousFilename = Client.profile_pic_link.split("/").pop();

        // Delete the previous image from the server
        const previousImagePath = `public/ProfilePics/${previousFilename}`;
        fs.unlink(previousImagePath, (err) => {
            if (err) {
                console.error("Error deleting previous image:", err);
            }
        });
    }
    upload(req, res, async (err) => {
        // console.log("req", req);
        console.log("req files : ", req.file, res.files);
        console.log("req userId : ", req.body.userId);
        if (err) {
            return res
                .status(400)
                .send({ message: "Could not upload image . " + err.message });
        }
        try {
            const fileLink = `/ProfilePics/${req.uploadedFilename}`;
            await Clients.update(
                { profile_pic_link: fileLink },
                { where: { id: req.body.ClientId } }
            );
            res.send({
                message: "Client profile picture uploaded successfully!",
                fileLink,
            });
        } catch (dbError) {
            res.status(500).send({
                message: "Error saving file link to database",
                error: dbError.message,
            });
        }
    });
};

module.exports = Upload_Client_ProfilePic;
