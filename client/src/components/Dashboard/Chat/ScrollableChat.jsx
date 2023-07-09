import React, { useEffect } from 'react'
import ScrollableFeed from "react-scrollable-feed";

const ScrollableChat = ({messages, senderData, isTyping}) => {
  const userId = localStorage.getItem("userId");
  const isFirstMessage = (messages, i) =>{
    return (
      i === messages[0] &&
      messages[0].sender !== userId &&
      messages[0].sender
    );
  }

  return (
    <div className="chat-body">
      <ScrollableFeed>
        {messages?.map((item, i) =>
          item.sender === userId ? (
            <div key={item._id} className="my-msg">
              <div className="my-message">{item.content}</div>
            </div>
          ) : (
            <div key={item._id} className="driver-msg">
              <div className="img">
                {/* {isFirstMessage(messages, i) && ( */}
                  <img
                    src={`http://localhost:5000/Uploads/profile/${senderData?.senderImage}`}
                    alt=""
                  />
                {/* )}    */}
              </div>
              <div className="message">{item.content}</div>
            </div>
          )
        )}
        {isTyping && (
          <div className="driver-msg ml-4">
            <div className="message">Typing...</div>
          </div>
        )}
      </ScrollableFeed>
    </div>
  );
}

export default ScrollableChat