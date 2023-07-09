const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: true,
    },
    campaignId: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Auth",
      },
    ],
    latestMessage: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      trime: true,
    },
    profileImg: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", chatSchema);
module.exports = ChatModel;
