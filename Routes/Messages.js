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
const { openChatRoom } = require("../Controllers/Chat/openChat");

router.get("/freelancer/:freelancerId/chats", getFreelancerChats);
router.get("/client/:clientId/chats", getClientChats);

router.get("/freelancer/:freelancerId/chats/:clientId", getFreelancerChatRoom);
router.get("/client/:clientId/chats/:freelancerId", getClientChatRoom);

router.post("/freelancer/:freelancerId/chats/:clientId", postFreelancerMessage);
router.post("/client/:clientId/chats/:freelancerId", postClientMessage);

router.post("/openChat", openChatRoom);
module.exports = router;
