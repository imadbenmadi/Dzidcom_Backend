const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const Client = sequelize.define("Client", {
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

// Define SocialMedia model
const SocialMedia = sequelize.define("SocialMedia", {
    type: {
        type: DataTypes.ENUM("insta", "facebook", "linkedin"),
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Client.hasMany(SocialMedia);
module.exports = { Client, SocialMedia };
