const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Freelancers } = require("./Freelnacer");
const { Clients } = require("./Client");

const Client_Feedbacks = sequelize.define("Client_Feedbacks", {
    FreelancerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ClientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0.0,
    },
});
const Freelancer_Feedbacks = sequelize.define("Freelancer_Feedbacks", {
    FreelancerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ClientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ProjectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Comment: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 0.0,
    },
});

Freelancers.hasMany(Client_Feedbacks, {
    as: "Client_Feedbacks",
    foreignKey: "FreelancerId",
});
Client_Feedbacks.belongsTo(Freelancers, {
    as: "Freelancer",
    foreignKey: "FreelancerId",
});

Clients.hasMany(Freelancer_Feedbacks, {
    as: "Freelancer_Feedbacks",
    foreignKey: "ProjectId",
});
Freelancer_Feedbacks.belongsTo(Clients, {
    as: "Client",
    foreignKey: "ProjectId",
});

module.exports = { Client_Feedbacks };
