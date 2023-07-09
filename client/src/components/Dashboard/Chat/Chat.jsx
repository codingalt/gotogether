import React, { useContext, useEffect, useRef, useState } from "react";
import userImg from '../../../images/user.jpg'
import './Chat.scss'
import * as fa from 'react-icons/fa'
import { AiFillStar, AiOutlineSend } from "react-icons/ai";
import { BiSend } from "react-icons/bi";
import { useCreateChatMutation, useGetAllMessagesQuery, useSendMessageMutation } from "../../../services/api/chatApi";
import { skipToken } from "@reduxjs/toolkit/query";
import ScrollableChat from "./ScrollableChat";
import io from 'socket.io-client'
import { useSelector } from "react-redux";
import MainContext from "../../Context/MainContext";

const ENDPOINT = "https://gotogether-283d17c4540b.herokuapp.com/";
var socket,selectedChatCompare;

const Chat = ({ chatCard, setChatCard, driverData }) => {
  const chatRef = useRef();
  const { notification, setNotification } = useContext(MainContext);
  const user = useSelector((state) => state.user);
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([])
  const [senderData, setSenderData] = useState({senderImage: '', senderName: ''});
  const [newMessage, setNewMessage] = useState('')
  const [createChat, result] = useCreateChatMutation();
  const { isLoading, isSuccess, isError } = result;
  const [selectedChat, setSelectedChat] = useState();
  const [sendMessage, {result: messageResult}] = useSendMessageMutation();
  const { data, isLoading: messagesLoading, isError: messagesError } = useGetAllMessagesQuery(selectedChat?._id ? selectedChat._id : skipToken);

  useEffect(()=>{
    setMessages(data?.result);
    setSenderData((prevState) => ({
      ...prevState,
      senderImage: data?.senderImage,
      senderName: data?.senderName
    }));
  },[data]);

    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
    }, []);

  const newChat = async() =>{
    const {data} = await createChat({userId: driverData?.driverId, campaignId: driverData?._id});
    setSelectedChat(data?.chat);
    socket.emit("join chat", user.userId);
  }

  const typingHandler = (e) =>{
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
      setTyping(true);
      socket.emit('typing', selectedChat._id);
    }
      let lastTypingTime = new Date().getTime();
      var timerLength = 3000;
      setTimeout(() => {
        let timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if(timeDiff >= timerLength && typing){
          socket.emit('stop typing', selectedChat._id);
          setTyping(false);
        }
      }, timerLength);
    
  }

  const handleSendMessage = async() => {
    if(newMessage){
      socket.emit('stop typing', selectedChat._id);
      setNewMessage("");
      const {data} = await sendMessage({chatId: selectedChat._id, content: newMessage})
      socket.emit('new message', data?.result)
      setMessages([...messages, data]);
    }
  }

  useEffect(()=>{
    newChat();
    selectedChatCompare = selectedChat
  },[driverData]);

  useEffect(()=>{
    socket.on("message received", (newMessageReceived) => {
        // Give Notification 
        if(!selectedChatCompare){
          if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
          }
        }
         
    });
  });

  useEffect(() => {
    const handler = (event) => {
      if (!chatRef.current?.contains(event.target)) {
        setChatCard(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  return (
    <div
      className={
        !chatCard ? "chat_wrapper" : `chat_wrapper chat_wrapper_active`
      }
    >
      <div className="info-container" ref={chatRef}>
        <div className="info-inner info-inner-chat">
          <div className="close-info">
            <fa.FaChevronDown onClick={() => setChatCard(false)} />
          </div>
          <div className="profile">
            <img
              src={`http://localhost:5000/Uploads/profile/${driverData?.profileImg}`}
              alt=""
            />
          </div>
          <div className="driver-info">
            <span className="name">{driverData?.name}</span>
            <span className="rating">
              Rating {driverData?.totalRating}/5
              <AiFillStar />
            </span>
            {/* <div className="car-info">
              <div className="left">NHH-5678</div>
              <div className="right">Suzuki Swift</div>
            </div> */}
          </div>

          <div className="chat-container">
            <ScrollableChat isTyping={isTyping} senderData={senderData} messages={messages} />

            <div className="send-msg">
              <input
                value={newMessage}
                onChange={typingHandler}
                type="text"
                placeholder="Write message for driver.."
              />
              <div className="send-btn" onClick={handleSendMessage}>
                {/* <AiOutlineSend /> */}
                <BiSend />
              </div>
            </div>
          </div>

          <div className="white-button white-button-chat">
            <div className="wb-chat-inner">
              <button className="white-btn">Call Captain</button>
              <button className="white-btn" onClick={() => setChatCard(false)}>
                Cancel
              </button>
            </div>
            <div className="line"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
