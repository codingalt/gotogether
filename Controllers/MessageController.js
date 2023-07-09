const ChatModel = require("../Models/ChatModel");
const MessageModel = require("../Models/MessageModel");
const UserModel = require("../Models/UserModel");

const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
      return res
        .status(422)
        .json({ data: "Please fill out all the fields properly!", success: false });
    }

    const newMessage = new MessageModel({ sender: req.userId.toString(), content: content, chatId: chatId });
    const result = await newMessage.save();

    // Update Latest Message 
    const chat = await ChatModel.findByIdAndUpdate(chatId, {
      latestMessage: content
    });

    
    // console.log(result);
    
    // Get Sender data
    const sender = await UserModel.findOne({userId: req.userId.toString()});
    var newResult = {
      ...result._doc,
      users: chat?.users,
      senderImage: sender.profileImg,
      senderName: sender.name
    };
    return res
      .status(200)
      .json({
        result: newResult,
        senderImage: sender.profileImg,
        senderName: sender.name,
        success: true,
      });

  } catch (err) {
    res.status(500).json({ data: err.message, success: false });
  }
};

const getAllMessages = async(req,res) =>{
  try {
    const {chatId} = req.params;
    const result = await MessageModel.find({chatId});
    // Get Sender Details 
    const sender = await UserModel.findOne({ userId: req.userId.toString() });
    res
      .status(200)
      .json({
        result,
        senderImage: sender.profileImg,
        senderName: sender.name,
        success: true,
      });
    
  } catch (err) {
    res.status(500).json({ data: err.message, success: false }); 
  }
}

module.exports = {sendMessage, getAllMessages}
