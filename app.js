const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const cookieParser = require("cookie-parser");
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const UserModel = require("./Models/UserModel");
require("./conn");
const PORT = process.env.PORT || 5000;
const path = require("path");

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/Uploads',express.static('Uploads'));

const corsOptions = {
    origin: true, 
    credentials: true, 
  };
  
  app.use(cors(corsOptions));

  // Linking Routes
  app.use(require("./Routes/UserRoute"));
  app.use(require("./Routes/DriverRoute"));
  app.use(require("./Routes/DriverCampaign"));
  app.use(require("./Routes/PassengerRequest"));
  app.use(require("./Routes/ChatRoute"));
  app.use(require("./Routes/MessageRoute"));

  const __dirname1 = path.resolve();
  if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "staging"
  ) {
    app.use(express.static(path.join(__dirname1, "/client/build")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
    });
  }else{
     app.get("/", (req, res) => {
       res.send("API is Running Successfully.");
     });
  }
  
  const server = app.listen(PORT, () => {});

  // Socket IO Code Starts 
  const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
      origin: "https://gotogether-283d17c4540b.herokuapp.com/",
    },
  });

  io.on("connection", (socket) => {
    console.log('Connected to socket.io');

    socket.on('setup', (user) =>{
      socket.join(user?.userId);
      socket.emit('connected')
    });

    socket.on('join chat', (room) => {
      socket.join(room);
      console.log('User Joined room', room);
    });

    socket.on('new message', (chat) =>{
      if(!chat.users) return console.log('chat.users is undefined');
      
      chat.users.forEach(user => {
        if(user == chat.sender) return;
        socket.in(user).emit('message received', chat);
      })
    });

    socket.on('typing', (room) => socket.in(room).emit('typing'));

    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.off('setup', ()=>{
      console.log('User Disconnected');
      socket.leave(user.userId);
    });

    // send Passenger Request 
    socket.on("send passenger request", (request) => {
      if (!request) return console.log("request is undefined");
      socket.in(request.driverId).emit("request received", request);
     
    });

  });