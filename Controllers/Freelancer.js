const { getProfile } = require("./Freelancer/getProfile");
const { EditeProfile } = require("./Freelancer/EditeProfile");
const { GetProcess } = require("./Freelancer/GetProcess");
const { GetProcess_item } = require("./Freelancer/GetProcess_item");
const { GetRejections } = require("./Freelancer/GetRejection");
const {
    GetNotifications,
    DeleteNotification,
} = require("./Freelancer/Notifications");
const FreelancerController = {
    getProfile,
    EditeProfile,
    GetProcess,
    GetProcess_item,
    GetRejections,
    GetNotifications,
    DeleteNotification,
};

module.exports = FreelancerController;
