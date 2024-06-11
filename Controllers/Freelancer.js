const { getProfile } = require("./Freelancer/getProfile");
const { EditeProfile } = require("./Freelancer/EditeProfile");
const { GetProcess } = require("./Freelancer/GetProcess");
const { GetProcess_item } = require("./Freelancer/GetProcess_item");
const { GetRejections } = require("./Freelancer/GetRejection");
const FreelancerController = {
    getProfile,
    EditeProfile,
    GetProcess,
    GetProcess_item,
    GetRejections,
};

module.exports = FreelancerController;
