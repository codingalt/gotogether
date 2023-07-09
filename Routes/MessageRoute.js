const express = require("express");
const Authenticate = require("../Authenticate/authenticate");
const { sendMessage, getAllMessages } = require("../Controllers/MessageController");

const router = express.Router();

router.post("/message", Authenticate, sendMessage);
router.get("/message/:chatId", Authenticate, getAllMessages);

module.exports = router;
