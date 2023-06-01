const express = require('express');
const DriverCampaignModel = require('../Models/DriverCampaign');

const postCampaign = async (req,res) => {
    try {
        console.log(req.body);
        const {driverId,startLocation,endingLocation,date,time,rideRules,seatCostPerKm,availableSeats,comment,expectedRideDistance,expectedRideTime} = req.body;
        if(!driverId || !startLocation || !endingLocation || !date || !time || rideRules === null || !seatCostPerKm || !availableSeats || !expectedRideDistance || !expectedRideTime){
            return res.status(422).json({message: 'Please fill out all the fields properly.', success: false})
        }

        const newCampaign = new DriverCampaignModel({driverId,startLocation,endingLocation,date,time,rideRules,seatCostPerKm,availableSeats,comment,expectedRideDistance,expectedRideTime})
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

// Update Campaign Status
const updateCampaignStatus = async (req,res) =>{
    try {
        const campaignId = req.params.campaignId;
        const {status} = req.body;
   
       const result = await DriverCampaignModel.findByIdAndUpdate(campaignId,{status: status},{
            new: true,
            useFindAndModify: false,
        });
        res.status(200).json({result,success: true});
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get Campaigns within Specific Range 

module.exports = {postCampaign,getCampaignsByDriverId,getAllCampaigns,updateCampaignStatus}