const mongoose = require('mongoose');

const journeySchema = mongoose.Schema(
    {
      driverId: {
        type: String,
        required: true,
      },
      campaignId: {
        type: String,
        required: true,
      },
      journeyStatus: {
        type: String,
        required: true
      },
      currentLocation: {
        type: String,
        required: true,
      },
     
    },
    { timestamps: true }
  );
  
  const JourneyModel = mongoose.model("Journey", journeySchema);
  module.exports = JourneyModel;