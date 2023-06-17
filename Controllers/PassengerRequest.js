const DriverCampaignModel = require("../Models/DriverCampaign");
const PassengerRequestModel = require("../Models/PassengerRequest");

const postRequest = async (req, res) => {
  try {
    const { passengerId, campaignId, requireSeats, costPerSeat } = req.body;
    if (!passengerId || !campaignId || !requireSeats || !costPerSeat) {
      return res
        .status(422)
        .json({
          message: "Please fill out all the fields properly.",
          success: false,
        });
    }

    // Check for Seats if available
    const checkSeats = await DriverCampaignModel.findById(campaignId);
    const remainingSeats = checkSeats.availableSeats - checkSeats.bookedSeats;
    if (remainingSeats === 0) {
      return res
        .status(422)
        .json({
          message: `Oops! No Seat available for this Ride`,
          success: false,
        });
    }
    if (remainingSeats < requireSeats) {
      return res
        .status(422)
        .json({
          message: `You can't book more than ${remainingSeats} seats. ${remainingSeats} seats available only for this ride.`,
          success: false,
        });
    }

    // Adding Passenger Request
    const newRequest = new PassengerRequestModel({
      passengerId,
      campaignId,
      requireSeats,
      costPerSeat,
    });
    const postRequest = await newRequest.save();
    res.status(200).json({ postRequest, success: true });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const approvePassengerRequest = async (req, res) => {
  try {
    const { campaignId, passengerRequestId } = req.body;
    const campaign = await DriverCampaignModel.findById(campaignId);
    const passengerRequest = await PassengerRequestModel.findById(passengerRequestId);
       if (!passengerRequest) {
         return res
           .status(400)
           .json({ message: "Passenger Request Id is wrong", success: false });
       }

    // Check for Seats if available
    const remainingSeats = campaign.availableSeats - campaign.bookedSeats;
    if (remainingSeats === 0) {
      return res.status(422).json({
        message: `Oops! No Seat available for this Ride`,
        success: false,
      });
    }

    if (remainingSeats < passengerRequest.requireSeats) {
      return res.status(422).json({
        message: `You can't book more than ${remainingSeats} seats. ${remainingSeats} seats available only for this ride.`,
        success: false,
      });
    }

    if (campaign) {
      // Updating Booked Seats of Driver Campaign
      await DriverCampaignModel.findByIdAndUpdate(
        campaignId,
        {
          bookedSeats: campaign.bookedSeats + passengerRequest.requireSeats,
        },
        {
          new: true,
          useFindAndModify: false,
        }
      );

    //   Updating Passenger Request Status 
    await PassengerRequestModel.findByIdAndUpdate(
      passengerRequestId,
      {
        requestStatus: 'approved',
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );

      res.status(200).json({
        message: `Request Approved Successfully. ${passengerRequest.requireSeats} Seats Booked for this campaign`,
        success: true,
      });
    } else {
      return res
        .status(400)
        .json({ message: "No Campaign Found with this Id.", success: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

module.exports = { postRequest, approvePassengerRequest };
