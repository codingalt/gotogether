const mongoose = require("mongoose");

const driverSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    birthDate: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
    },
    cnicImgFront: {
      type: String,
    },
    cnicImgBack: {
      type: String,
    },
    totalReviewsGiven: {
      type: Number,
      required: true,
      default:1
    },
    totalRating: {
      type: Number,
      required: true,
      default:5
    },
    profileStatus: {
      type: Boolean,
      default: false,
    },
    residentialAddress: {
      type: String,
      required: true,
    },
    vehicleType: String,
    vehicleNumber: String,
    vehicleBrand: String,

    vehicleRegisterCertificate: {
      type: String,
    },
    vehicleImage: {
      type: String,
    },
    liscenseNumber: String,
    liscenseExpiryDate: String,

    liscenseImage: {
      type: String,
    },
  
  },
  { timestamps: true }
);

const DriverModel = mongoose.model("Drivers", driverSchema);
module.exports = DriverModel;
