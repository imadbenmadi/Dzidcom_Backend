const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Clients } = require("./Client");
const Projects = sequelize.define("Projects", {
    ClientId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    Pyament_ScreenShot_Link: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    Status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Pending",
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
Projects.hasMany(Required_Skills, {
    as: "Required_Skills",
    foreignKey: "ProjectId",
});
Projects.belongsTo(Clients, { as: "owner", foreignKey: "ClientId" });
Clients.hasMany(Projects, { as: "Projects", foreignKey: "ClientId" });

module.exports = { Projects, Required_Skills };
