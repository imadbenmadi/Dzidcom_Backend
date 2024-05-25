const multer = require("multer");
const path = require("path");
const { Freelancers } = require("../../../Models/Freelnacer");

// Configure storage for freelancer profile pics
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/ProfilePics/");
    },
    filename: (req, file, cb) => {
        const freelancerId = req.body.freelancerId;
        const fileExtension = path.extname(file.originalname);
        const uniqueSuffix = `freelancer-${freelancerId}-${Date.now()}${fileExtension}`;
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
const Upload_Freelancer_ProfilePic = (req, res) => {
    const Freelancer = Freelancers.findOne({
        where: { id: req.body.userId },
    });
    console.log(req.body);
    if (!Freelancer) {
        return res.status(404).send({ message: "Freelancer not found" });
    }
     if (Freelancer.profile_pic_link) {
         // Extract the filename from the profile picture link
         const previousFilename = Freelancer.profile_pic_link.split("/").pop();

         // Delete the previous image from the server
         const previousImagePath = `public/ProfilePics/${previousFilename}`;
         fs.unlink(previousImagePath, (err) => {
             if (err) {
                 console.error("Error deleting previous image:", err);
             }
         });
     }
    upload(req, res, async (err) => {
        if (err) {
            return res
                .status(400)
                .send({ message: "Could not upload image . " + err.message });
        }
        try {
            const fileLink = `/ProfilePics/${req.uploadedFilename}`;
            await Freelancers.update(
                { profile_pic_link: fileLink },
                { where: { id: req.body.freelancerId } }
            );
            res.send({
                message: "Freelancer profile picture uploaded successfully!",
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

module.exports = Upload_Freelancer_ProfilePic;
