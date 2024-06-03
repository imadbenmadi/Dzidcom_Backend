const { getProfile } = require("./Client/Profle/getProfile");
const { EditeProfile } = require("./Client/Profle/EditeProfile");
const { AddProject } = require("./Client/Project/AddProject");
const { DeleteProject } = require("./Client/Project/DeleteProject");
const { GetProjcts } = require("./Client/Project/GetProjects");
const { GetProject } = require("./Client/Project/GetProject");
const ClientController = {
    getProfile,
    EditeProfile,
    AddProject,
    DeleteProject,
    GetProjcts,
    GetProject,
};

module.exports = ClientController;
