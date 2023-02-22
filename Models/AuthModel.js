const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

const authSchema = mongoose.Schema(
    {
      phone: {
        type: String,
        required: true,
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

    // Generating token
    authSchema.methods.generateAuthToken = async function () {
        try {
          let token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
          this.tokens = this.tokens.concat({ token: token });
          await this.save();
          return token;
        } catch (error) {
          console.log(error);
        }
      };
  
  const AuthModel = mongoose.model("Auth", authSchema);
  module.exports = AuthModel;