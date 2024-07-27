const { Messages, MessagesRoom } = require("../../Models/Messages");
const { Freelancers } = require("../../Models/Freelnacer");
const { Clients } = require("../../Models/Client");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const getFreelancerChats = async (req, res) => {
    try {
        const freelancerId = req.params.freelancerId;

        // Fetch the rooms that the freelancer is part of, including the latest message for each room
        const rooms = await MessagesRoom.findAll({
            where: {
                freelancerId: freelancerId,
            },
            include: [
                {
                    model: Clients,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profile_pic_link",
                    ],
                },
                {
                    model: Freelancers,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profile_pic_link",
                    ],
                },
                {
                    model: Messages,
                    attributes: ["message"],
                    where: {
                        senderId: freelancerId,
                        senderType: "freelancer",
                        receiverType: "client",
                    },
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                    required: false, // This allows rooms with no messages
                },
            ],
        });

        // Format the data to include the latest message
        const chatList = rooms.map((room) => {
            const latestMessage = room.Messages[0] || {}; // Get the latest message or an empty object if no messages
            return {
                ...room.toJSON(),
                lastMessage: latestMessage || "No messages yet",
            };
        });

        res.status(200).json({ rooms: chatList });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving chat rooms.",
        });
    }
};

const getClientChats = async (req, res) => {
    try {
        const clientId = req.params.clientId;

        // Fetch the rooms that the client is part of, including the latest message for each room
        const rooms = await MessagesRoom.findAll({
            where: {
                clientId: clientId,
            },
            include: [
                {
                    model: Clients,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profile_pic_link",
                    ],
                },
                {
                    model: Freelancers,
                    attributes: [
                        "id",
                        "firstName",
                        "lastName",
                        "profile_pic_link",
                    ],
                },
                {
                    model: Messages,
                    attributes: ["message"],
                    where: {
                        receiverId: clientId,
                        receiverType: "client",
                        senderType: "freelancer",
                    },
                    order: [["createdAt", "DESC"]],
                    limit: 1,
                    required: false, // This allows rooms with no messages
                },
            ],
        });

        // Format the data to include the latest message
        const chatList = rooms.map((room) => {
            const latestMessage = room.Messages[0] || {}; // Get the latest message or an empty object if no messages
            return {
                ...room.toJSON(),
                lastMessage: latestMessage || "No messages yet",
            };
        });

        res.status(200).json({ rooms: chatList });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving chat rooms.",
        });
    }
};


const getFreelancerChatRoom = async (req, res) => {
    try {
        const { freelancerId, clientId } = req.params;

        // Fetch the messages between the freelancer and the client
        const messages = await Messages.findAll({
            where: {
                [Op.or]: [
                    {
                        senderId: freelancerId,
                        receiverId: clientId,
                        senderType: "freelancer",
                        receiverType: "client",
                    },
                    {
                        senderId: clientId,
                        receiverId: freelancerId,
                        senderType: "client",
                        receiverType: "freelancer",
                    },
                ],
            },
            order: [["createdAt", "ASC"]],
            include: [
                {
                    model: Freelancers,
                    as: "freelancerSender",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Clients,
                    as: "clientSender",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Freelancers,
                    as: "freelancerReceiver",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Clients,
                    as: "clientReceiver",
                    attributes: ["id", "firstName", "lastName"],
                },
            ],
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getClientChatRoom = async (req, res) => {
    try {
        const { clientId, freelancerId } = req.params;

        // Fetch the messages between the client and the freelancer
        const messages = await Messages.findAll({
            where: {
                [Op.or]: [
                    {
                        senderId: clientId,
                        receiverId: freelancerId,
                        senderType: "client",
                        receiverType: "freelancer",
                    },
                    {
                        senderId: freelancerId,
                        receiverId: clientId,
                        senderType: "freelancer",
                        receiverType: "client",
                    },
                ],
            },
            order: [["createdAt", "ASC"]],
            include: [
                {
                    model: Freelancers,
                    as: "freelancerSender",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Clients,
                    as: "clientSender",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Freelancers,
                    as: "freelancerReceiver",
                    attributes: ["id", "firstName", "lastName"],
                },
                {
                    model: Clients,
                    as: "clientReceiver",
                    attributes: ["id", "firstName", "lastName"],
                },
            ],
        });

        res.json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const postFreelancerMessage = async (req, res) => {
    try {
        const { freelancerId, clientId } = req.params;
        const { message } = req.body;

        // Validate message
        if (!message) {
            return res
                .status(400)
                .json({ error: "Message content is required" });
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

        // Create new message
        const newMessage = await Messages.create({
            message,
            senderId: freelancerId,
            receiverId: clientId,
            senderType: "freelancer",
            receiverType: "client",
            roomId: req.body.roomId,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const postClientMessage = async (req, res) => {
    try {
        const { clientId, freelancerId } = req.params;
        const { message } = req.body;

        // Validate message
        if (!message) {
            return res
                .status(400)
                .json({ error: "Message content is required" });
        }

        // Check if the client exists
        const client = await Clients.findByPk(clientId);
        if (!client) {
            return res.status(404).json({ error: "Client not found" });
        }

        // Check if the freelancer exists
        const freelancer = await Freelancers.findByPk(freelancerId);
        if (!freelancer) {
            return res.status(404).json({ error: "Freelancer not found" });
        }

        // Create new message
        const newMessage = await Messages.create({
            message,
            senderId: clientId,
            receiverId: freelancerId,
            senderType: "client",
            receiverType: "freelancer",
            roomId: req.body.roomId,
        });

        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

module.exports = {
    getFreelancerChats,
    getClientChats,
    getFreelancerChatRoom,
    getClientChatRoom,
    postFreelancerMessage,
    postClientMessage,
};
