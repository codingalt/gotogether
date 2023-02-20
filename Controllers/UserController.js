const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
router.use(express.json());
const UserModel = require("../Models/UserModel");

//Registeration Route
const registerUser = async (req, res) => {
    try {
      const { name, email, password, phone, city, gender, isDriver, profileImg, confirmPass} = req.body;
      if (!name || !email || !password || !phone || !city || !gender || isDriver === null || isDriver === undefined || !confirmPass || !profileImg) {
        return res
          .status(422)
          .json({ message: "Please fill out all the fileds properly.", success: false });
      }
  
      if (password != confirmPass) {
        return res
          .status(422)
          .json({ message: "Password do not match", success: false });
      }
  
      const userExist = await UserModel.findOne({ email: email });
      if (userExist) {
        return res
          .status(422)
          .json({ message: "Email already exist", success: false });
      }
      const user = new UserModel({ name, email, password, phone, city, gender, isDriver, profileImg });
      const userRegister = await user.save();
      if (userRegister) {
        res
          .status(200)
          .json({ message: "User registered successfully..", success: true });
      }
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
  };

  //Login Route
const loginUser = async (req, res) => {
    try {
      let token;
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email or Password cannot be empty", success: false });
      }
      const signin = await UserModel.findOne({ email: email });
      if (signin) {
        const isMatch = await bcrypt.compare(password, signin.password);
        if (isMatch) {
          //Generating JSON web token
          token = await signin.generateAuthToken();
          res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 2592000000),
            httpOnly: true,
          });
          res.status(200).json({ message: "Login Successfully", success: true,token: token });
        } else {
          res
            .status(400)
            .json({ message: "Invalid login details", success: false });
        }
      } else {
        res
          .status(404)
          .json({ message: "Invalid login details", success: false });
      }
    } catch (error) {
      res
        .status(500)
        .json({
          message: "Something went wrong Please try again",
          success: false,
        });
    }
  };
  
  
  
  const getUserData = async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await UserModel.findById(userId);
      const { password, ...other } = user._doc;
      res.status(200).json({ user: other, success: true });
    } catch (error) {
      res.status(500).json(error);
    }
  };

  module.exports = {registerUser,loginUser,getUserData}