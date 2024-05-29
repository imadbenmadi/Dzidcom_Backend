const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Freelancers } = require("./Freelnacer");
const { Clients } = require("./Client");

const Messages = sequelize.define("Messages", {
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sentAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    senderType: {
        type: DataTypes.ENUM("freelancer", "client"),
        allowNull: false,
    },
});

Freelancers.hasMany(Messages, {
    as: "sentMessages",
    foreignKey: "senderId",
    constraints: false,
});
Messages.belongsTo(Freelancers, {
    as: "senderFreelancer",
    foreignKey: "senderId",
    constraints: false,
});

Clients.hasMany(Messages, {
    as: "sentMessages",
    foreignKey: "senderId",
    constraints: false,
});
Messages.belongsTo(Clients, {
    as: "senderClient",
    foreignKey: "senderId",
    constraints: false,
});

Clients.hasMany(Messages, {
    as: "receivedMessages",
    foreignKey: "receiverId",
    constraints: false,
});
Messages.belongsTo(Clients, {
    as: "receiverClient",
    foreignKey: "receiverId",
    constraints: false,
});

Freelancers.hasMany(Messages, {
    as: "receivedMessages",
    foreignKey: "receiverId",
    constraints: false,
});
Messages.belongsTo(Freelancers, {
    as: "receiverFreelancer",
    foreignKey: "receiverId",
    constraints: false,
});

module.exports = { Messages };
