const express = require("express");
const Authenticate = require("../Authenticate/authenticate");
const {getUserData, verifyOtp, sendOtp, registerUser, sendOtp2 } = require("../Controllers/UserController");
const router = express.Router();
const multer = require('multer');

const upload = multer({
  storage: multer.diskStorage({
    destination: function(req,file,cb){
      cb(null,'Uploads/profile')
    },
    filename: function(req,file,cb){
      cb(null,file.fieldname + "_" + Date.now()+".jpg")
    }
  })
}).single('profileImg')

router.post('/otp',sendOtp);
router.post('/otp2',sendOtp2);
router.post('/otp/verify',verifyOtp);
router.post('/register',upload,Authenticate ,registerUser);
router.get('/user/:userId',Authenticate ,getUserData);

module.exports = router;