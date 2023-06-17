const express = require("express");
const ChatModel = require("../Models/ChatModel");
const AuthModel = require("../Models/AuthModel");
const UserModel = require("../Models/UserModel");

const accessChat = async (req, res) => {
  try {
    const { userId } = req.body;
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
      return res.status(400).json({
        message: "Chat with this person is already Created",
        success: false,
        chat: chat,
      });
    }else{
      const userData = await UserModel.findOne({userId})
      const newChat = new ChatModel({
        chatName: "sender",
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

module.exports = { accessChat };
