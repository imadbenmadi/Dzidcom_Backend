const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Clients } = require("./Client");
import { Applications } from "./Freelnacer";
const Projects = sequelize.define("Projects", {
    Title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Description: {
        type: DataTypes.STRING,
        allowNull: false,
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
