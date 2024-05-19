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

// Define SocialMediaLinks model
const SocialMediaLinks = sequelize.define("SocialMediaLinks", {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Clients.hasMany(SocialMediaLinks, {
    as: "SocialMediaLinks",
    foreignKey: "ClientId",
});
module.exports = { Clients, SocialMediaLinks };
