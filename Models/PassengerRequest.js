const mongoose = require('mongoose');

const passengerRequestSchema = mongoose.Schema(
    {
      driverId: {
        type: String,
        required: true,
      },
      passengerId: {
        type: String,
        required: true,
      },
      campaignId: {
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
      requireSeats: {
        type: Number,
        required: true,
      },
      costPerSeat: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
      },
      requestStatus: {
        type: String,
        default: 'pending'
      },
      rideType: {
        type: String,
        required: true,
      },
      journeyStatus: {
        type: String,
        default: 'idle',
      }
     
    },
    { timestamps: true }
  );
  
  const PassengerRequestModel = mongoose.model("PassengerRequests", passengerRequestSchema);
  module.exports = PassengerRequestModel;