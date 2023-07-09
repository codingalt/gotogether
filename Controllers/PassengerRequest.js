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
        requestStatus: 'accepted',
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

// Decline Passenger Request
const declineRequest = async(req,res)=>{
  try {
    const {requestId} = req.params;
    await PassengerRequestModel.findByIdAndUpdate(
      requestId,
      {
        requestStatus: 'decline',
      },
      {
        new: true,
        useFindAndModify: false,
      }
    );
    res.status(200).json({message: 'Request Declined Successfully.', success: true})
    
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
}

// Get All Passenger Requests  
const getPassengerRequests = async (req,res) =>{
    try {
      const {campaignId} = req.params;
        const passengerRequests = await PassengerRequestModel.aggregate([
          {
            $match: {
              campaignId: campaignId,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "passengerId",
              foreignField: "userId",
              as: "UserData",
            },
          },
          {
            $unwind: "$UserData",
          },
          {
            $addFields: {
              convertedId: { $toObjectId: "$passengerId" },
            },
          },
          {
            $lookup: {
              from: "auths",
              localField: "convertedId",
              foreignField: "_id",
              as: "Phone",
            },
          },
          {
            $unwind: "$Phone",
          },
          {
            $addFields: {
              name: "$UserData.name",
              profileImg: "$UserData.profileImg",
              city: "$UserData.city",
              phone: "$Phone.phone",
            },
          },

          {
            $project: {
              UserData: 0,
              convertedId: 0,
              Phone: 0,
            },
          },
        ]);
        res.status(200).json({requests: passengerRequests,success: true})
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get Passenger Requests By his/her Id

const getRequestsByPassengerId = async(req,res)=>{
    try {

       const requests = await PassengerRequestModel.aggregate([
         {
           $match: {
             passengerId: req.userId.toString(),
           },
         },
         {
           $addFields: {
             convertedId: { $toObjectId: "$campaignId" },
           },
         },
         {
           $lookup: {
             from: "drivercampaigns",
             localField: "convertedId",
             foreignField: "_id",
             as: "Campaign",
           },
         },
         {
           $unwind: "$Campaign",
         },
         {
           $addFields: {
             startLocation: "$Campaign.startLocation",
             endingLocation: "$Campaign.endingLocation",
             expectedRideDistance: "$Campaign.expectedRideDistance",
             expectedRideTime: "$Campaign.expectedRideTime",
             availableSeats: "$Campaign.availableSeats",
             bookedSeats: "$Campaign.bookedSeats",
           },
         },
         {
           $project: {
             Campaign: 0,
             convertedId: 0,
             __v: 0
           },
         },
       ]);
      res.status(200).json({requests, success: true});
      
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = {
  postRequest,
  approvePassengerRequest,
  getPassengerRequests,
  declineRequest,
  getRequestsByPassengerId,
};
