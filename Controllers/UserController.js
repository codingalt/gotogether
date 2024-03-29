const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
router.use(express.json());
const UserModel = require("../Models/UserModel");
const _ = require('lodash')
const otpGenerator = require('otp-generator');
const OtpModel = require("../Models/OtpModel");
const AuthModel = require("../Models/AuthModel");
const DriverModel = require("../Models/DriverModel");

//SendOtp Route
const sendOtp = async (req, res) => {
    try {
      const {phone} = req.body;
      if (!phone) {
        return res
          .status(422)
          .json({ data: "Mobile Number cannot be empty", success: false });
      }

      // Generating OTP 
      // const otp = otpGenerator.generate(4,{
      //   digits: true,
      //   lowerCaseAlphabets: false,
      //   upperCaseAlphabets: false,
      //   specialChars: false
      // });
      const otp = 6765;
      console.log('OTP',otp);

      const newOtp = new OtpModel({number: phone,otp: otp});
      newOtp.otp = await bcrypt.hash(newOtp.otp,12);
      const result = await newOtp.save();
      return res.status(200).json({data: 'OTP sent successfully.',success: true})

      // const accountSid = process.env.TWILIO_SID;
      // const authToken = process.env.TWILIO_TOKEN;
      // const client = require("twilio")(accountSid, authToken);

      //  client.messages
      //   .create({ body: `Your OTP verification code is ${otp}`, from: "+12765337560", to: phone})
      //   .then((message) =>  {
      //     return res.status(200).json({data: 'OTP sent successfully.',success: true})
      //   });
  
    } catch (err) {
      res.status(500).json({ data: err.message, success: false });
    }
  };

  //SendOtp Route 2
const sendOtp2 = async (req, res) => {
  try {
    const {phone} = req.body;
    if (!phone) {
      return res
        .status(422)
        .json({ message: "Mobile Number cannot be empty", success: false });
    }

    // Generating OTP 
    // const otp = otpGenerator.generate(4,{
    //   digits: true,
    //   lowerCaseAlphabets: false,
    //   upperCaseAlphabets: false,
    //   specialChars: false
    // });
    const otp = 6765;
    console.log('OTP',otp);

    const newOtp = new OtpModel({number: phone,otp: otp});
    newOtp.otp = await bcrypt.hash(newOtp.otp,12);
    const result = await newOtp.save();
    return res.status(200).json({data: 'OTP sent successfully.',success: true})

  //   const accountSid = process.env.TWILIO_SID2;
  //   const authToken = process.env.TWILIO_TOKEN2;
  //   const client = require("twilio")(accountSid, authToken);

  // client.messages
  //     .create({ body: `Your OTP verification code is ${otp}`, from: "+12762901463", to: phone})
  //     .then((message) => {
  //       return res.status(200).json({message: 'OTP sent successfully.',success: true})
  //     });

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

  // Verify Otp 
  const verifyOtp = async (req,res) =>{
    console.log(req.body);
    const otpHolder = await OtpModel.find({number: req.body.phone});
    if(otpHolder.length === 0){
      return res.status(400).json({message: 'You have used an Expired OTP!',success: false});
    }
    
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);

    if(rightOtpFind.number === req.body.phone && validUser){
      const {phone} = req.body;
      const user = new AuthModel(_.pick(req.body, ["phone"]));
      const isUser = await AuthModel.findOne({phone: phone}) 
      if(isUser){
      //Generating JSON web token
       const token = await isUser.generateAuthToken();
       const otpDelete = await OtpModel.deleteMany({number: rightOtpFind.number});

      //  Checking if user profile is already created  
       const isProfile = await UserModel.findOne({ userId: isUser._id });
       if(isProfile?.isDriver){
        var isDriverProfile = await DriverModel.findOne({userId: isUser._id})
      }
      const isDriverProfileCreated = isDriverProfile ? true : false;
      const isDriver = isProfile?.isDriver ? true : false;
       if(isProfile){
         return res.status(200).json({success: true,message:'OTP Authenticated Successfully.',data: isUser,userId: isUser._id,token: token,isProfileCreated: true,isDriver,isDriverProfileCreated})
       }else{
        return res.status(200).json({success: true,message:'OTP Authenticated Successfully.',data: isUser,userId: isUser._id,token: token,isProfileCreated: false,isDriver,isDriverProfileCreated})
       }

      }else{
        //Generating JSON web token
       const token = await user.generateAuthToken();
        const result = await user.save();
       const otpDelete = await OtpModel.deleteMany({number: rightOtpFind.number});

       return res.status(200).json({success: true,message:'OTP Authenticated Successfully.',data: result,userId: result._id,token: token,isProfileCreated: false,isDriver: false, isDriverProfileCreated: false})

      }

       
    }else{
      return res.status(400).json({message: 'Your OTP was wrong',success: false});
    }
  }

  const registerUser = async (req,res) =>{
    const profileImg = (req.file) ? req.file.filename : null;
    console.log(req.body);
    try {
      const { name, email, city, gender, isDriver,userId} = req.body;
      if (!name || !email || !city || !gender || isDriver === null || isDriver === undefined || !userId) {
        return res
          .status(422)
          .json({ message: "Please fill out all the fileds properly.", success: false });
      }
  
      const userExist = await UserModel.findOne({ email: email.toLowerCase() });
      if (userExist) {
        return res
          .status(422)
          .json({ message: "Email already exist", success: false });
      }

      const isUserIdExist = await UserModel.findOne({ userId: userId });
      if (isUserIdExist) {
        return res
          .status(422)
          .json({ message: "Your Profile is Already Created", success: false });
      }

      const isUserId = await AuthModel.findById(userId);
      if (!isUserId) {
        return res
          .status(422)
          .json({ message: "Invalid UserId. Please provide correct user id", success: false });
      }
      const user = new UserModel({ name, email, city, gender, isDriver, profileImg,userId });
      const userRegister = await user.save();
      if (userRegister) {
        res
          .status(200)
          .json({ message: "User Profile Registered successfully..", success: true });
      }
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
  }
  
  const getUserData = async (req, res) => {
    try {
      const userId = req.params.userId;
      const isDriver = await UserModel.find({userId});
      const isDriverProfileCreated = await DriverModel.find({userId});
      if(isDriver[0].isDriver){
        if(isDriverProfileCreated.length === 0){
          res.status(401).json({message: 'You are driver but your driver profile is not created! Please setup your driver profile first', success: false})
          return;
        }
      }
      
      if(isDriver[0].isDriver){
        const user = await UserModel.aggregate([
          {
            $match: {
              userId:userId,
            }
          },
          {
            $lookup: {
              from: 'drivers',
              localField: 'userId',
              foreignField: 'userId',
              as: 'DriverData'
            }
          },
          {
            $unwind: "$DriverData"
          },
          {
            $addFields: {
                convertedId: { $toObjectId: "$userId" }
            }
        },
          {
            $lookup: {
              from: 'auths',
              localField: 'convertedId',
              foreignField: '_id',
              as: 'Phone'
            }
          },
          {
            $unwind: "$Phone"
          },
          {
            $addFields: {
              "totalRating": "$DriverData.totalRating",
              "totalReviewsGiven": "$DriverData.totalReviewsGiven",
              "fatherName": "$DriverData.fatherName",
              "liscenseExpiryDate": "$DriverData.liscenseExpiryDate",
              "phone": "$Phone.phone",
              "vehicleType": "$DriverData.vehicleType"
            }
          },
          {
            $project: {
              DriverData: 0,
              Phone: 0,
              convertedId: 0
            }
          }
        ]);
        res.status(200).json({ data: user, success: true });

      }else{
        const user = await UserModel.aggregate([
          {
            $match: {
              userId:userId,
            }
          },
          {
            $addFields: {
                convertedId: { $toObjectId: "$userId" }
            }
        },
          {
            $lookup: {
              from: 'auths',
              localField: 'convertedId',
              foreignField: '_id',
              as: 'Phone'
            }
          },
          {
            $unwind: "$Phone"
          },
          {
            $addFields: {
              "phone": "$Phone.phone"
            }
          },
          {
            $project: {
              Phone: 0,
              convertedId: 0
            }
          }
        ]);
        res.status(200).json({ data: user, success: true });
      }
     
    } catch (error) {
      res.status(500).json(error);
    }
  };

  const uploadVideoFn = async(req,res)=>{
    try {
      res.send(req.file)
    } catch (error) {
      res.send(error)
    }
  }

  module.exports = {
    sendOtp,
    sendOtp2,
    getUserData,
    verifyOtp,
    registerUser,
    uploadVideoFn,
  };
