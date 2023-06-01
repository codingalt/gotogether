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
            isMusic: Boolean,
            isAc: Boolean
      },
      comment: {
        type: String,
      },
      seatCostPerKm: {
        type: String,
        required: true,
      },
      expectedRideDistance: {
        type: String,
        required: true
      },
      expectedRideTime: {
        type: String,
        required: true
      },
      availableSeats: {
        type: String,
        required: true,
      },
      bookedSeats: {
        type: Number,
        default: 0,
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