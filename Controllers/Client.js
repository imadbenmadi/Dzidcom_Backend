const { getProfile } = require("./Client/Profle/getProfile");
const { EditeProfile } = require("./Client/Profle/EditeProfile");
const { AddProject } = require("./Client/Project/AddProject");
const { DeleteProject } = require("./Client/Project/DeleteProject");
const ClientController = {
    getProfile,
    EditeProfile,
    AddProject,
    DeleteProject,
};

module.exports = ClientController;
