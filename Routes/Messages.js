const express = require("express");
const router = express.Router();
const {
    getFreelancerChats,
    getClientChats,
    getFreelancerChatRoom,
    getClientChatRoom,
    postFreelancerMessage,
    postClientMessage,
} = require("../Controllers/Chat/chatController");
const {
    openChatRoom,
    deleteChatRoom,
} = require("../Controllers/Chat/RoomController");
const ClientMiddleware = require("../Middlewares/Client");
const FreelancerMiddleware = require("../Middlewares/Freelancer");

router.get(
    "/freelancer/:freelancerId/chats",
    FreelancerMiddleware,
    getFreelancerChats
);
router.get("/client/:clientId/chats", ClientMiddleware, getClientChats);

router.get(
    "/freelancer/:freelancerId/chats/:clientId",
    FreelancerMiddleware,
    getFreelancerChatRoom
);
router.get(
    "/client/:clientId/chats/:freelancerId",
    ClientMiddleware,
    getClientChatRoom
);

router.post(
    "/freelancer/:freelancerId/chats/:clientId",
    FreelancerMiddleware,
    postFreelancerMessage
);
router.post(
    "/client/:clientId/chats/:freelancerId",
    ClientMiddleware,
    postClientMessage
);

router.post("/room", openChatRoom);
router.delete("/room/:roomId", deleteChatRoom);

module.exports = router;
