const express = require('express');
const { accessChat, getUserChats } = require('../Controllers/ChatController');
const Authenticate = require('../Authenticate/authenticate');

const router = express.Router();

router.post('/chat', Authenticate ,accessChat)
router.get("/chats",Authenticate, getUserChats);


module.exports = router;