const express = require("express");
const DriverModel = require("../Models/DriverModel");
const UserModel = require("../Models/UserModel");

const registerDriver = async (req, res) => {
  // console.log(req.files);
  try {
    const {
      userId,
      fatherName,
      birthDate,
      cnic,
      totalReviewsGiven,
      totalRating,
      profileStatus,
      residentialAddress,
      vehicleDetails,
      liscenseDetails,
    } = req.body;

    const cnicImgFront = req.files.cnicfront[0].filename;
    const cnicImgBack = req.files.cnicback[0].filename;
    const vehicleRegisterCertificate = req.files.vehicleCertificate[0].filename;
    const vehicles = req.files.vehicles;
    const liscense = req.files.liscense;
    const vehicleImages = [];
    const liscenseImages = [];
    vehicles.map((item)=>{
      vehicleImages.push({path: item.filename})
    });

    liscense.map((item)=>{
      liscenseImages.push({path: item.filename})
    })

    if(!userId || !fatherName || !birthDate || !cnic || !totalReviewsGiven || !totalRating || !residentialAddress || !vehicleDetails || !liscenseDetails){
        return res.status(422).json({message: 'Please fill out all the fields properly.', success: false})
    }

    const isUser = await UserModel.findById(userId);
    if(!isUser){
       return res.status(401).json({message: "Record not Found.",success: false})
    }
    if(!isUser.isDriver){
        // Adding Driver
        const driver = new DriverModel({userId,fatherName,birthDate,cnic,cnicImgFront,cnicImgBack,totalReviewsGiven,totalRating,profileStatus,residentialAddress,vehicleDetails,liscenseDetails,vehicleImages,liscenseImages,vehicleRegisterCertificate})
        const driverRegister = await driver.save();

        // Updating isDriver Property in User Table 
        const updateUser = await UserModel.findByIdAndUpdate(isUser._id, {isDriver: true});
        if(driverRegister){
            res.status(200).json({message: 'Driver Registered Successfully.', success: true,driverRegister})
        } 
    }else{
        res.status(400).json({message: "You are already Registered as a driver",success: false})
    }

  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};

const updateDriver = async (req,res) =>{
  try {
    const userId = req.params.userId;
    const isDriver = await DriverModel.findOne({userId: userId});
    if(isDriver){
      const updateDriver = await DriverModel.findByIdAndUpdate(isDriver._id, req.body,{
        new: true,
        useFindAndModify: false,
      })
      res.status(200).json({updateDriver,success: true});
    }else{
      res.status(401).json({message: 'No Record Found', success: false});
    }
    
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
}

const getDriverData = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await DriverModel.find({userId: userId});
    res.status(200).json({ user: user, success: true });
  } catch (error) {
    res.status(500).json(error);
  }
};

module.exports = { registerDriver, updateDriver,getDriverData };
