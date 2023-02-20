const express = require('express');
const JourneyModel = require('../Models/Journey');

const startJourney = async (req,res) =>{
    try {
        const {driverId,campaignId,journeyStatus,currentLocation} = req.body;
        if(!driverId || !campaignId || !currentLocation){
         return res.status(422).json({message: 'Please fill out all the fields properly.', success: false})
        }

        const newJourney = new JourneyModel({driverId,campaignId,journeyStatus,currentLocation});
        const journey = await newJourney.save();
        res.status(200).json({journey: journey,success: true});
        
    } catch (err) {
      res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = {startJourney}