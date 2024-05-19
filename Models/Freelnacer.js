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
    JobTitle: {
        type: DataTypes.STRING,
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
    ImageLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
const Skills = sequelize.define("SocialMedia", {
    skill: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    years_of_experiance: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Define SocialMedia model
const SocialMedia = sequelize.define("Skills", {
    type: {
        type: DataTypes.ENUM("insta", "facebook", "linkedin"),
        allowNull: false,
    },
    link: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

// Define associations
Freelancer.hasMany(Skills, { as: "Skills" });
Freelancer.hasMany(PortfolioItem, { as: "portfolioItems" });
Freelancer.hasMany(SocialMedia, { as: "socialMediaLinks" });
module.exports = {
    Freelancer,
    PortfolioItem,
    Skills,
    SocialMedia,
};
