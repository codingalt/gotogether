const express = require("express");
const Authenticate = require("../Authenticate/authenticate");
const {getUserData, verifyOtp, sendOtp, registerUser } = require("../Controllers/UserController");
const router = express.Router();

router.post('/otp', sendOtp);
router.post('/otp/verify',verifyOtp);
router.post('/register', registerUser);
router.get('/user/:userId',Authenticate ,getUserData);

module.exports = router;