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
    Rate: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: 0.0,
    },
    nstgram_Link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    linkedIn_Link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    facebook_Link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_pic_link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

module.exports = { Clients };
