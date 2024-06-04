const { getProfile } = require("./Freelancer/getProfile");
const { EditeProfile } = require("./Freelancer/EditeProfile");
const { GetProcess } = require("./Freelancer/GetProcess");
const FreelancerController = {
    getProfile,
    EditeProfile,
    GetProcess,
};

module.exports = FreelancerController;