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
const PortfolioItems = sequelize.define("PortfolioItems", {
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

Freelancers.hasMany(Skills, { as: "Skills", foreignKey: "FreelancerId" });
Freelancers.hasMany(PortfolioItems, {
    as: "PortfolioItems",
    foreignKey: "FreelancerId",
});
Freelancers.hasMany(SocialMediaLinks, {
    as: "SocialMediaLinks",
    foreignKey: "FreelancerId",
});

module.exports = {
    Freelancers,
    PortfolioItems,
    Skills,
    SocialMediaLinks,
};
