const express = require('express');
const DriverCampaignModel = require('../Models/DriverCampaign');

const postCampaign = async (req,res) => {
    try {
        console.log(req.body);
        const {driverId,startLocation,endingLocation,dateTime,rideRules,seatCostPerKm,availableSeats,vehicleType,rideType,bookedSeats,comment} = req.body;
        if(!driverId || !startLocation || !endingLocation || !dateTime || rideRules === null || !seatCostPerKm || !availableSeats || !vehicleType || !rideType || bookedSeats === null){
            return res.status(422).json({message: 'Please fill out all the fields properly.', success: false})
        }

        const newCampaign = new DriverCampaignModel({driverId,startLocation,endingLocation,dateTime,rideRules,seatCostPerKm,availableSeats,vehicleType,rideType,bookedSeats,comment})
        const campaign = await newCampaign.save();
        if(campaign){
            res.status(200).json({campaign: campaign,success: true});
        }
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get Campaigns By DriverId 
const getCampaignsByDriverId = async (req,res) =>{
    try {
        const driverId = req.params.driverId;
        const campaigns = await DriverCampaignModel.find({driverId: driverId});
        res.status(200).json({campaigns: campaigns,success: true})
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get All Campaigns
const getAllCampaigns = async (req,res) =>{
    try {
        const campaigns = await DriverCampaignModel.find();
        res.status(200).json({campaigns: campaigns,success: true})
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get Campaigns within Specific Range 

module.exports = {postCampaign,getCampaignsByDriverId,getAllCampaigns}