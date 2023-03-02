const mongoose = require('mongoose');

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
        type: String
      },
      cnicImgBack: {
        type: String
      },
      totalReviewsGiven: {
        type: Number,
        required: true,
      },
      totalRating: {
        type: Number,
        required: true
      },
      profileStatus: {
        type: Boolean,
        default: false
      },
      residentialAddress: {
        type: String,
        required: true,
      },
      vehicleDetails: [
        {
            vehicleType: String,
            vehicleNumber: String,
            vehicleColor: String,
            vehicleBrand: String,
            vehicleSeats: Number,
        }
      ],
      vehicleRegisterCertificate: {
        type: String
      },
      vehicleImages: [{
        path: String
      }],

      liscenseDetails: [
        {
            liscenseNumber: String,
            liscenseExpiryDate: String,
            liscenseType: String
        }
      ],
      liscenseImages: [{
        path: String
      }],
     
    },
    { timestamps: true }
  );
  
  const DriverModel = mongoose.model("Drivers", driverSchema);
  module.exports = DriverModel;