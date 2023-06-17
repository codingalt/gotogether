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
      requireSeats: {
        type: Number,
        required: true,
      },
      costPerSeat: {
        type: Number,
        required: true,
      },
      requestStatus: {
        type: String,
        default: 'pending'
      },
     
    },
    { timestamps: true }
  );
  
  const PassengerRequestModel = mongoose.model("PassengerRequests", passengerRequestSchema);
  module.exports = PassengerRequestModel;