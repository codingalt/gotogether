const express = require('express');
const { accessChat } = require('../Controllers/ChatController');
const Authenticate = require('../Authenticate/authenticate');

const router = express.Router();

router.post('/chat', Authenticate ,accessChat)
router.get("/chat");


module.exports = router;