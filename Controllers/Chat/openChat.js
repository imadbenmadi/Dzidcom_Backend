const { Messages } = require("../../Models/Messages");
const { Freelancers } = require("../../Models/Freelnacer");
const { Clients } = require("../../Models/Client");

const openChatRoom = async (req, res) => {
    try {
        const { freelancerId, clientId } = req.body;

        // Validate freelancerId and clientId
        if (!freelancerId || !clientId) {
            return res
                .status(400)
                .json({ error: "Freelancer ID and Client ID are required" });
        } else if (isNaN(freelancerId) || isNaN(clientId)) {
            return res
                .status(400)
                .json({ error: "Freelancer ID and Client ID must be numbers" });
        }
        // Check if the freelancer exists
        const freelancer = await Freelancers.findByPk(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }

        // Check if the client exists
        const client = await Clients.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        // Check if a chat room already exists
        const existingChat_freelancer = await Messages.findOne({
            where: {
                senderId: freelancerId,
                receiverId: clientId,
            },
        });
        const existingChat_client = await Messages.findOne({
            where: {
                senderId: clientId,
                receiverId: freelancerId,
            },
        });

        if (existingChat_freelancer || existingChat_client) {
            return res.status(409).json({ error: "Chat room already exists" });
        }

        // Create a new chat room by creating an initial message entry
        const newMessage = await Messages.create({
            message: "", // Initial empty message
            senderId: freelancerId,
            receiverId: clientId,
            senderType: "freelancer",
            receiverType: "client",
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = { openChatRoom };
