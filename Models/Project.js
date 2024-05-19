const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db_connection");
const { Clients } = require("./Client");
const Projects = sequelize.define("Projects", {
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

Projects.hasMany(Required_Skills, { as: "Required_Skills" });
Projects.belongsTo(Clients, { as: "owner", foreignKey: "clientId" });

module.exports = { Projects, Required_Skills };
