const express = require('express');
const DriverCampaignModel = require('../Models/DriverCampaign');
const PassengerRequestModel = require('../Models/PassengerRequest');

const postRequest = async (req,res) =>{
    try {
        const {passengerId,campaignId,startLocation,endingLocation,requireSeats,costPerSeat,comment,requestStatus,rideType} = req.body;
        if(!passengerId || !campaignId || !startLocation || !endingLocation || !requireSeats || !costPerSeat || !rideType){
            return res.status(422).json({message: 'Please fill out all the fields properly.', success: false})
        }

        // Check for Seats 
        const checkSeats = await DriverCampaignModel.findById(campaignId);
        const remainingSeats = checkSeats.availableSeats - checkSeats.bookedSeats;
        if(remainingSeats === 0){
            return res.status(422).json({message: `No Seat available for this Ride`,success: false})
        }
        if(remainingSeats < requireSeats){
            return res.status(422).json({message: `You can't book more than ${remainingSeats} seats`,success: false})
        }

        // Adding Passenger Request 
        const newRequest = new PassengerRequestModel({passengerId,campaignId,startLocation,endingLocation,requireSeats,costPerSeat,comment,requestStatus,rideType});
        const postRequest = await newRequest.save();

        // Updating Booked Seat of Driver Campaign 
        await DriverCampaignModel.findByIdAndUpdate(campaignId,{bookedSeats: checkSeats.bookedSeats + requireSeats},{
            new: true,
            useFindAndModify: false,
        });
        res.status(200).json({postRequest,success: true});
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = {postRequest}