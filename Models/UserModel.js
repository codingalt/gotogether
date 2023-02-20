const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password: {
        type: String,
        required: true,
        min: [6, "Password must be atleast 6 character"],
      },
      phone: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      gender: {
        type: String,
        required: true,
      },
      isDriver: {
        type: Boolean,
        default: false,
      },
      profileImg: {
        public_id: {
          type: String,
        },
        url: {
          type: String,
        },
      },
      tokens: [
        {
          token: {
            type: String,
            required: true,
          },
        },
      ],
    },
    { timestamps: true }
  );
  
  //Password hashing
  
  userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      this.password = await bcrypt.hash(this.password, 12);
    }
    next();
  });
  
  // Generating token
  userSchema.methods.generateAuthToken = async function () {
    try {
      let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
      this.tokens = this.tokens.concat({ token: token });
      await this.save();
      return token;
    } catch (error) {
      console.log(error);
    }
  };
  
  const UserModel = mongoose.model("Users", userSchema);
  module.exports = UserModel;