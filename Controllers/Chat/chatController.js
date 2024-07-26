const { Messages } = require("../../Models/Messages");
const { Freelancers } = require("../../Models/Freelnacer");
const { Clients } = require("../../Models/Client");
const { Sequelize } = require("sequelize");
const { Op } = require("sequelize");
const getFreelancerChats = async (req, res) => {
    try {
        const freelancerChats = await Messages.findAll({
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
            where: {
                [Op.or]: [
                    { senderId: req.user.id, senderType: "freelancer" },
                    { receiverId: req.user.id, receiverType: "freelancer" },
                ],
            },
            group: [
                "Messages.id",
                "Messages.message",
                "Messages.readed",
                "Messages.senderId",
                "Messages.receiverId",
                "Messages.senderType",
                "Messages.receiverType",
                "Messages.createdAt",
                "Messages.updatedAt",
                "freelancerSender.id",
                "freelancerSender.firstName",
                "freelancerSender.lastName",
                "clientSender.id",
                "clientSender.firstName",
                "clientSender.lastName",
                "freelancerReceiver.id",
                "freelancerReceiver.firstName",
                "freelancerReceiver.lastName",
                "clientReceiver.id",
                "clientReceiver.firstName",
                "clientReceiver.lastName",
            ],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(freelancerChats);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving chats.",
        });
    }
};

const getClientChats = async (req, res) => {
    try {
        const clientChats = await Messages.findAll({
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
            where: {
                [Op.or]: [
                    { senderId: req.user.id, senderType: "client" },
                    { receiverId: req.user.id, receiverType: "client" },
                ],
            },
            group: [
                "Messages.id",
                "Messages.message",
                "Messages.readed",
                "Messages.senderId",
                "Messages.receiverId",
                "Messages.senderType",
                "Messages.receiverType",
                "Messages.createdAt",
                "Messages.updatedAt",
                "freelancerSender.id",
                "freelancerSender.firstName",
                "freelancerSender.lastName",
                "clientSender.id",
                "clientSender.firstName",
                "clientSender.lastName",

                "freelancerReceiver.id",
                "freelancerReceiver.firstName",
                "freelancerReceiver.lastName",
                "clientReceiver.id",
                "clientReceiver.firstName",
                "clientReceiver.lastName",
            ],
            order: [["createdAt", "DESC"]],
        });
        res.status(200).json(clientChats);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "An error occurred while retrieving chats.",
        });
    }
};

// const getClientChats = async (req, res) => {
//     try {
//         const { clientId } = req.params;
//         const chats = await Messages.findAll({
//             where: {
//                 [Sequelize.Op.or]: [
//                     { senderId: clientId, senderType: "client" },
//                     { receiverId: clientId, receiverType: "client" },
//                 ],
//             },
//             include: [
//                 {
//                     model: Freelancers,
//                     as: "freelancerSender",
//                     attributes: ["id", "firstName", "lastName"],
//                 },
//                 {
//                     model: Clients,
//                     as: "clientSender",
//                     attributes: ["id", "firstName", "lastName"],
//                 },
//                 {
//                     model: Freelancers,
//                     as: "freelancerReceiver",
//                     attributes: ["id", "firstName", "lastName"],
//                 },
//                 {
//                     model: Clients,
//                     as: "clientReceiver",
//                     attributes: ["id", "firstName", "lastName"],
//                 },
//             ],
//             order: [["createdAt", "DESC"]],
//             group: ["senderId", "receiverId"],
//         });

//         res.json(chats);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// };
const getFreelancerChatRoom = async (req, res) => {
    try {
        const { freelancerId, clientId } = req.params;
        const messages = await Messages.findAll({
            where: {
                [Sequelize.Op.or]: [
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
        const messages = await Messages.findAll({
            where: {
                [Sequelize.Op.or]: [
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
