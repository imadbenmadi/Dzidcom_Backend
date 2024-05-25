const fs = require("fs");
const path = require("path");
const { Projects } = require("../../../Models/Project");
const formidableMiddleware = require("express-formidable");

const uploadMiddleware = formidableMiddleware({
    uploadDir: "public/Payment/",
    keepExtensions: true,
    multiples: false,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
});

// Upload handler
const Upload_Payment_ScreenShot = async (req, res) => {
    try {
        const { image } = req.files;
        if (!image) {
            return res.status(400).send({
                message: "No file uploaded",
            });
        }
        const { userId } = req.decoded.userId;
        const { projectId } = req.body;
        if (!userId) {
            return res.status(400).send({
                message: "User ID is required",
            });
        }
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/heic",
        ];
        if (!allowedTypes.includes(image.type)) {
            throw new Error("Only JPEG and PNG and JPG images are allowed!");
        }

        const fileExtension = path.extname(image.name).toLowerCase();
        if (![".jpeg", ".jpg", ".png", ".heic"].includes(fileExtension)) {
            throw new Error("Invalid file extension");
        }
        const uniqueSuffix = `Payment-${userId}-${projectId}-${Date.now()}${fileExtension}`;

        const fileLink = `/Payment/${uniqueSuffix}`;
        const project = await Projects.findOne({
            where: { id: projectId },
        });
        if (!project) {
            return res.status(404).send({
                message: "Project not found for the given userId",
            });
        }
        if (project.Pyament_ScreenShot_Link) {
            const previousFilename =
                project.Pyament_ScreenShot_Link.split("/").pop();
            const previousImagePath = `public/Payment/${previousFilename}`;
            try {
                if (fs.existsSync(previousImagePath)) {
                    fs.unlinkSync(previousImagePath);
                }
            } catch (error) {
                console.error("Error deleting previous image:", error);
            }
        }
        // Move the file to the desired location
        fs.renameSync(image.path, path.join("public/Payment/", uniqueSuffix));

        // Update database with file link
        await Projects.update(
            { Pyament_ScreenShot_Link: fileLink },
            { where: { id: projectId } }
        );

        // Example response
        res.status(200).send({
            message: "Payment ScreenShot uploaded successfully!",
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
module.exports = [uploadMiddleware, Upload_Payment_ScreenShot];
