const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Freelancers } = require("./Freelnacer");
const { Clients } = require("./Client");

const Messages = sequelize.define(
    "Messages",
    {
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        readed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        senderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        receiverId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        senderType: {
            type: DataTypes.ENUM("freelancer", "client"),
            allowNull: false,
        },
        receiverType: {
            type: DataTypes.ENUM("freelancer", "client"),
            allowNull: false,
        },
    },
    {
        scopes: {
            freelancers: {
                where: {
                    [Sequelize.Op.or]: [
                        { senderType: "freelancer" },
                        { receiverType: "freelancer" },
                    ],
                },
            },
            clients: {
                where: {
                    [Sequelize.Op.or]: [
                        { senderType: "client" },
                        { receiverType: "client" },
                    ],
                },
            },
        },
    }
);

Messages.addHook("afterFind", (findResult) => {
    if (!Array.isArray(findResult)) findResult = [findResult];
    for (const instance of findResult) {
        if (instance.senderType === "freelancer" && instance.senderId) {
            instance.sender = instance.getFreelancerSender();
        } else if (instance.senderType === "client" && instance.senderId) {
            instance.sender = instance.getClientSender();
        }
        if (instance.receiverType === "freelancer" && instance.receiverId) {
            instance.receiver = instance.getFreelancerReceiver();
        } else if (instance.receiverType === "client" && instance.receiverId) {
            instance.receiver = instance.getClientReceiver();
        }
    }
});

// Associate sender
Messages.belongsTo(Freelancers, {
    foreignKey: "senderId",
    constraints: false,
    as: "freelancerSender",
});

Messages.belongsTo(Clients, {
    foreignKey: "senderId",
    constraints: false,
    as: "clientSender",
});

// Associate receiver
Messages.belongsTo(Freelancers, {
    foreignKey: "receiverId",
    constraints: false,
    as: "freelancerReceiver",
});

Messages.belongsTo(Clients, {
    foreignKey: "receiverId",
    constraints: false,
    as: "clientReceiver",
});

module.exports = { Messages };
