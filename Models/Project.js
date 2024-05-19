const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const client = require("./Client");
const Project = sequelize.define("Project", {
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    projectField: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});
const Required_Skills = sequelize.define("Required_Skills", {
    skill: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    years_of_experiance: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

Project.hasMany(Required_Skills, { as: "Required_Skills" });
Project.belongsTo(client, { as: "owner", foreignKey: "clientId" });

module.exports = { Project, Required_Skills};
