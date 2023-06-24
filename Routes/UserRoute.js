const express = require("express");
const Authenticate = require("../Authenticate/authenticate");
const {getUserData, verifyOtp, sendOtp, registerUser, sendOtp2, uploadVideoFn } = require("../Controllers/UserController");
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

const videoStorage = multer.diskStorage({
  destination: "videos",
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const videoUpload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "Uploads/video");
    },
    filename: function (req, file, cb) {
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv|webm)$/)) {
        return cb(new Error("Please upload a video"));
      }
      cb(null, file.fieldname + "_" + Date.now() + file.originalname);
    },
  }),
}).single('video');

router.post('/otp',sendOtp);
router.post('/otp2',sendOtp2);
router.post('/otp/verify',verifyOtp);
router.post('/register',upload,Authenticate ,registerUser);
router.post("/video", videoUpload, uploadVideoFn);
router.get('/user/:userId',Authenticate ,getUserData);

module.exports = router;