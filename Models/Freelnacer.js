const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const Freelancers = sequelize.define("Freelancers", {
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
const Skills = sequelize.define("Skills", {
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

// Define associations
Freelancers.hasMany(Skills, { as: "Skills" });
Freelancers.hasMany(PortfolioItem, { as: "portfolioItems" });
Freelancers.hasMany(SocialMedia, { as: "socialMediaLinks" });
module.exports = {
    Freelancers,
    PortfolioItem,
    Skills,
    SocialMedia,
};
