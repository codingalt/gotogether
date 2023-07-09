const express = require('express');
const DriverCampaignModel = require('../Models/DriverCampaign');
const SearchCampaigns = require("../utils/search");
var ObjectId = require("mongodb").ObjectId;

const postCampaign = async (req,res) => {
    try {
        console.log(req.body);
        const {driverId,startLocation,endingLocation,date,time,rideRules,seatCost,availableSeats,comment,expectedRideDistance,expectedRideTime} = req.body;
        if(!driverId || !startLocation || !endingLocation || !date || !time || rideRules === null || !seatCost || !availableSeats || !expectedRideDistance || !expectedRideTime){
            return res.status(422).json({message: 'Please fill out all the fields properly.', success: false})
        }

        const newCampaign = new DriverCampaignModel({driverId,startLocation,endingLocation,date,time,rideRules,seatCost,availableSeats,comment,expectedRideDistance,expectedRideTime})
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
        const campaigns = await DriverCampaignModel.find({driverId: driverId,status:0});
        res.status(200).json({campaigns: campaigns,success: true})
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get Campaigns By Id 
const getCampaignsById = async (req,res) =>{
    try {
        const campaignId = req.params.id;
        // const campaign = await DriverCampaignModel.findById(campaignId);
        const campaign = await DriverCampaignModel.aggregate([
          {
            $match: {
              _id: ObjectId(campaignId),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "driverId",
              foreignField: "userId",
              as: "UserData",
            },
          },
          {
            $unwind: "$UserData",
          },
          {
            $lookup: {
              from: "drivers",
              localField: "driverId",
              foreignField: "userId",
              as: "Driver",
            },
          },
          {
            $unwind: "$Driver",
          },
          {
            $addFields: {
              name: "$UserData.name",
              profileImg: "$UserData.profileImg",
              city: "$UserData.city",
              gender: "$UserData.gender",
              totalRating: "$Driver.totalRating",
              totalReviewsGiven: "$Driver.totalReviewsGiven",
              vehicleType: "$Driver.vehicleType",
              vehicleBrand: "$Driver.vehicleBrand",
              vehicleNumber: "$Driver.vehicleNumber",
              vehicleImage: "$Driver.vehicleImage",
            },
          },

          {
            $project: {
              UserData: 0,
              Driver: 0,
            },
          },
        ]);
        res.status(200).json({campaign: campaign[0],success: true})
        
    } catch (err) {
    res.status(500).json({ message: err.message, success: false });
    }
}

// Get All Campaigns
const getAllCampaigns = async (req,res) =>{
    try {
        const campaigns = await DriverCampaignModel.aggregate([
          {
            $lookup: {
              from: "users",
              localField: "driverId",
              foreignField: "userId",
              as: "userData",
            },
          },
          {
            $unwind: "$userData",
          },
          {
            $lookup: {
              from: "drivers",
              localField: "driverId",
              foreignField: "userId",
              as: "Driver",
            },
          },
          {
            $unwind: "$Driver",
          },
          {
            $addFields: {
              name: "$userData.name",
              profileImg: "$userData.profileImg",
              city: "$userData.city",
              gender: "$userData.gender",
              totalRating: "$Driver.totalRating",
              totalReviewsGiven: "$Driver.totalReviewsGiven",
              vehicleType: "$Driver.vehicleType",
              vehicleBrand: "$Driver.vehicleBrand",
              vehicleNumber: "$Driver.vehicleNumber",
              vehicleImage: "$Driver.vehicleImage",
            },
          },
          {
            $project: {
              userData: 0,
              Driver: 0,
            },
          },
        ]);
        res.status(200).json({campaigns,success: true})
        
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

// Search campaigns by location
const searchCampaigns = async(req,res) =>{
    try {
        const {searchType,query} = req.body;
        if(searchType && query){
            if (req.body.searchType === "origin") {
              const result = await DriverCampaignModel.aggregate([
                {
                  $match: {
                    startLocation: { $regex: req.body.query, $options: "i" },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "driverId",
                    foreignField: "userId",
                    as: "userData",
                  },
                },
                {
                  $unwind: "$userData",
                },
                {
                  $lookup: {
                    from: "drivers",
                    localField: "driverId",
                    foreignField: "userId",
                    as: "Driver",
                  },
                },
                {
                  $unwind: "$Driver",
                },
                {
                  $addFields: {
                    name: "$userData.name",
                    profileImg: "$userData.profileImg",
                    city: "$userData.city",
                    gender: "$userData.gender",
                    totalRating: "$Driver.totalRating",
                    totalReviewsGiven: "$Driver.totalReviewsGiven",
                    vehicleType: "$Driver.vehicleType",
                    vehicleBrand: "$Driver.vehicleBrand",
                    vehicleNumber: "$Driver.vehicleNumber",
                    vehicleImage: "$Driver.vehicleImage",
                  },
                },
                {
                  $project: {
                    userData: 0,
                    Driver: 0,
                  },
                },
              ]);
              res.status(200).json({ result, success: true });
            } else {
              const result = await DriverCampaignModel.aggregate([
                {
                  $match: {
                    endingLocation: { $regex: req.body.query, $options: "i" },
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "driverId",
                    foreignField: "userId",
                    as: "userData",
                  },
                },
                {
                  $unwind: "$userData",
                },
                {
                  $lookup: {
                    from: "drivers",
                    localField: "driverId",
                    foreignField: "userId",
                    as: "Driver",
                  },
                },
                {
                  $unwind: "$Driver",
                },
                {
                  $addFields: {
                    name: "$userData.name",
                    profileImg: "$userData.profileImg",
                    city: "$userData.city",
                    gender: "$userData.gender",
                    totalRating: "$Driver.totalRating",
                    totalReviewsGiven: "$Driver.totalReviewsGiven",
                    vehicleType: "$Driver.vehicleType",
                    vehicleBrand: "$Driver.vehicleBrand",
                    vehicleNumber: "$Driver.vehicleNumber",
                    vehicleImage: "$Driver.vehicleImage",
                  },
                },
                {
                  $project: {
                    userData: 0,
                    Driver: 0,
                  },
                },
              ]);
              res.status(200).json({ result, success: true });
            }
        }else{
             const result = await DriverCampaignModel.aggregate([
               {
                 $lookup: {
                   from: "users",
                   localField: "driverId",
                   foreignField: "userId",
                   as: "userData",
                 },
               },
               {
                 $unwind: "$userData",
               },
               {
                 $lookup: {
                   from: "drivers",
                   localField: "driverId",
                   foreignField: "userId",
                   as: "Driver",
                 },
               },
               {
                 $unwind: "$Driver",
               },
               {
                 $addFields: {
                   name: "$userData.name",
                   profileImg: "$userData.profileImg",
                   city: "$userData.city",
                   gender: "$userData.gender",
                   totalRating: "$Driver.totalRating",
                   totalReviewsGiven: "$Driver.totalReviewsGiven",
                   vehicleType: "$Driver.vehicleType",
                   vehicleBrand: "$Driver.vehicleBrand",
                   vehicleNumber: "$Driver.vehicleNumber",
                   vehicleImage: "$Driver.vehicleImage",
                 },
               },
               {
                 $project: {
                   userData: 0,
                   Driver: 0,
                 },
               },
             ]);
             res.status(200).json({ result, success: true });
        }
            
    } catch (err) {
        res.status(500).json({ message: err.message, success: false });
    }
}

module.exports = {
  postCampaign,
  getCampaignsByDriverId,
  getAllCampaigns,
  updateCampaignStatus,
  getCampaignsById,
  searchCampaigns,
};