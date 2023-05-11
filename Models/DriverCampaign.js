const mongoose = require('mongoose');

const driverCampaignSchema = mongoose.Schema(
    {
      driverId: {
        type: String,
        required: true,
      },
      startLocation: {
        type: String,
        required: true,
      },
      endingLocation: {
        type: String,
        required: true,
      },
      date: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
      rideRules: {
            isSmoke: Boolean,
            isMusic: Boolean
      },
      comment: {
        type: String,
      },
      seatCostPerKm: {
        type: Number,
        required: true,
      },
      availableSeats: {
        type: Number,
        required: true,
      },
      vehicleType: {
        type: String,
        required: true,
      },
      rideType: {
        type: String,
        required: true,
      },
      bookedSeats: {
        type: Number,
        default: 0,
        required: true,
      },
      status: {
        type: Number,
        default: 0
      }
     
    },
    { timestamps: true }
  );
  
  const DriverCampaignModel = mongoose.model("DriverCampaigns", driverCampaignSchema);
  module.exports = DriverCampaignModel;