const fs = require("fs");
const path = require("path");
const { Projects } = require("../../../Models/Project");
const formidableMiddleware = require("express-formidable");

const uploadMiddleware = formidableMiddleware({
    uploadDir: "public/ProfilePics/",
    keepExtensions: true,
    multiples: false,
    maxFileSize: 10 * 1024 * 1024, // 10 MB
});

// Delete handler
const deleteProjectProfilePic = async (req, res) => {
    try {
        const { userId } = req.body;
        const project = await Projects.findOne({ where: { ClientId: userId } });

        if (!project) {
            return res.status(404).send({
                message: "Project not found for the given userId",
            });
        }

        if (project.Pyament_ScreenShot_Link) {
            const previousFilename = path.basename(
                project.Pyament_ScreenShot_Link
            );
            const previousImagePath = path.join(
                "public/ProfilePics/",
                previousFilename
            );

            try {
                if (fs.existsSync(previousImagePath)) {
                    fs.unlinkSync(previousImagePath);
                }
            } catch (error) {
                console.error("Error deleting previous image:", error);
                return res.status(400).send({
                    message:
                        "Could not delete profile picture: " + error.message,
                });
            }

            await Projects.update(
                { Pyament_ScreenShot_Link: null },
                { where: { ClientId: userId } }
            );

            return res.status(200).send({
                message: "Project profile picture deleted successfully!",
            });
        } else {
            return res.status(200).send({
                message: "Profile picture not found",
            });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send({
            message: "Error processing the request",
            error: error.message,
        });
    }
};

// Export the middleware and delete handler
module.exports = [uploadMiddleware, deleteProjectProfilePic];
