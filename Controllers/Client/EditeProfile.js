const { Clients, Client_SocialMediaLinks } = require("../../Models/Client");

const EditeProfile = async (req, res) => {
    const userId = req.decoded.userId;
    const newData = req.body;

    try {
        // Find the Client by their ID
        const Client = await Clients.findByPk(userId);

        if (!Client) {
            return res.status(404).json({ error: "Client not found." });
        }

        await Client.update(newData);

        if (newData.Client_SocialMediaLinks) {
            await Client_SocialMediaLinks.destroy({
                where: { ClientId: Client.id },
            });
            await Client_SocialMediaLinks.bulkCreate(
                newData.Client_SocialMediaLinks.map((link) => ({
                    ...link,
                    ClientId: Client.id,
                }))
            );
        }

        return res
            .status(200)
            .json({ message: "Profile updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error." });
    }
};

module.exports = { EditeProfile };
