const express = require("express");
const { registerUser, loginUser, getUserData } = require("../Controllers/UserController");
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:userId', getUserData)

module.exports = router;