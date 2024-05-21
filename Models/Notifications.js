const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Freelancers } = require("./Freelnacer");
const { Clients } = require("./Client");
const Notifications = sequelize.define("Notifications", {
    UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    UserType: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Notification: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Unread",
    },
});

Notifications.belongsTo(Freelancers, {
    as: "Freelancer",
    foreignKey: "UserId",
});
Freelancers.hasMany(Notifications, {
    as: "Notifications",
    foreignKey: "UserId",
});

Notifications.belongsTo(Clients, { as: "Client", foreignKey: "UserId" });
Clients.hasMany(Notifications, { as: "Notifications", foreignKey: "UserId" });
module.exports = { Notifications };
