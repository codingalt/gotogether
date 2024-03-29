const mongoose = require('mongoose');

const otpSchema = mongoose.Schema(
    {
      number: {
        type: String,
        required: true,
      },
      otp: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: 2000
        }
      }
     
    },
    { timestamps: true }
  );
  
  const OtpModel = mongoose.model("Otp", otpSchema);
  module.exports = OtpModel;