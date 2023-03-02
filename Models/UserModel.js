const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true
      },
      userId: {
        type: String,
        required: true
      },
      email: {
        type: String,
        unique: true,
        required: true
      },
      city: {
        type: String,
        required: true
      },
      gender: {
        type: String,
        required: true
      },
      isDriver: {
        type: Boolean,
        default: false,
      },
      profileImg: {
        type: String,
      },
     
    },
    { timestamps: true }
  );
  
  const UserModel = mongoose.model("Users", userSchema);
  module.exports = UserModel;