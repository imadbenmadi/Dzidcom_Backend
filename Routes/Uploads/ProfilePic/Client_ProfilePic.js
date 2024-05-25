const fs = require("fs");
const path = require("path");
const { Clients } = require("../../../Models/Client");
const formidableMiddleware = require("express-formidable");

const uploadMiddleware = formidableMiddleware({
    uploadDir: "public/ProfilePics/",
    keepExtensions: true,
    multiples: false,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
});

// Upload handler
const uploadClientProfilePic = async (req, res) => {
    try {
        const { ProfilePic } = req.files;
        const { userId } = req.body;
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/heic",
        ];
        if (!allowedTypes.includes(ProfilePic.type)) {
            throw new Error("Only JPEG and PNG and JPG images are allowed!");
        }

        const fileExtension = path.extname(ProfilePic.name);
        const uniqueSuffix = `Client-${userId}-${Date.now()}${fileExtension}`;

        const fileLink = `/ProfilePics/${uniqueSuffix}`;
        const client = await Clients.findOne({ where: { id: userId } });
        if (client.profile_pic_link) {
            const previousFilename = client.profile_pic_link.split("/").pop();
            const previousImagePath = `public/ProfilePics/${previousFilename}`;
            try {
                fs.unlinkSync(previousImagePath);
            } catch (error) {
                console.error("Error deleting previous image:", error);
            }
        }
        // Move the file to the desired location
        fs.renameSync(
            ProfilePic.path,
            path.join("public/ProfilePics/", uniqueSuffix)
        );

        // Update database with file link
        await Clients.update(
            { profile_pic_link: fileLink },
            { where: { id: userId } }
        );

        // Example response
        res.status(200).send({
            message: "Client profile picture uploaded successfully!",
            fileLink,
        });
    } catch (error) {
        // Error handling
        console.error("Error:", error);
        res.status(500).send({
            message: "Error processing the uploaded file",
            error: error.message,
        });
    }
};

// Export the middleware and upload handler
module.exports = [uploadMiddleware, uploadClientProfilePic];
