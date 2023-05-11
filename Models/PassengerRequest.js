const mongoose = require('mongoose');

const passengerRequestSchema = mongoose.Schema(
    {
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
     
    },
    { timestamps: true }
  );
  
  const PassengerRequestModel = mongoose.model("PassengerRequests", passengerRequestSchema);
  module.exports = PassengerRequestModel;