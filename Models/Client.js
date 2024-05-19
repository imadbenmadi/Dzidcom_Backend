const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const Clients = sequelize.define("Clients", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    telephone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true,
    },

    nationalCardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    portfolioWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    companyName: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    creationData: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    centerAdress: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    typeOfWork: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Define Client_SocialMediaLinks model
const Client_SocialMediaLinks = sequelize.define("Client_SocialMediaLinks", {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Clients.hasMany(Client_SocialMediaLinks, {
    as: "Client_SocialMediaLinks",
    foreignKey: "ClientId",
});
module.exports = { Clients, Client_SocialMediaLinks };
