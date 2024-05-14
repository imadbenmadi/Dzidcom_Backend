const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const Freelancer = sequelize.define("Freelancer", {
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
    location: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    telephone: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    type: {
        type: DataTypes.ENUM("freelancer", "client"),
        allowNull: false,
    },
    nationalCardNumber: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    portfolioWebsite: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    workField: {
        type: DataTypes.ENUM("Graphic Design", "Content creation", "CEO/SEO"),
        allowNull: true,
    },
    socialMedia: {
        type: DataTypes.JSON,
        allowNull: true,
    },
});

// Define Portfolio model
const PortfolioItem = sequelize.define("PortfolioItem", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    stillWorking: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    livePreviewLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Define SocialMedia model
const SocialMedia = sequelize.define("SocialMedia", {
    type: {
        type: DataTypes.ENUM("insta", "fb", "linkedin"),
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});
// Define associations
Freelancer.hasMany(PortfolioItem);
Freelancer.hasMany(SocialMedia);
module.exports = { Freelancer, PortfolioItem, SocialMedia };
