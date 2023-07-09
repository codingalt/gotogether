const express = require("express");
const ChatModel = require("../Models/ChatModel");
const AuthModel = require("../Models/AuthModel");
const UserModel = require("../Models/UserModel");

const accessChat = async (req, res) => {
  try {
    const { userId, campaignId } = req.body;
    if (!userId) {
      return res
        .status(400)
        .json({ message: "UserId cannot be empty", success: false });
    }

    // check if chat is already present
    const chat = await ChatModel.findOne({
      users: { $all: [req.userId.toString(), userId] },
    });
    if (chat) {
      return res.status(200).json({
        message: "Chat with this person is already Created",
        success: true,
        chat: chat,
      });
    }else{
      const userData = await UserModel.findOne({userId})
      const newChat = new ChatModel({
        chatName: "sender",
        campaignId: campaignId,
        users: [req.userId.toString(), userId],
        name: userData.name,
        profileImg: userData.profileImg
      });
      const result = await newChat.save();
      res.status(200).json({ result, success: true });
    }

  } catch (err) {
    res.status(500).json({ data: err.message, success: false });
  }
};

const getUserChats = async(req,res)=>{
  try {

    const chats = await ChatModel.find({ users: { $elemMatch: { $eq: req.userId.toString() } } }).sort({updatedAt: -1});
    res.status(200).json({chats, success: true})
    
  } catch (err) {
    res.status(500).json({ data: err.message, success: false });
  }
}

module.exports = { accessChat, getUserChats };
