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

  app.get('/',(req,res) =>{
    res.send('API is Running Successfully.')
  })

  // if (
  //   process.env.NODE_ENV === "production" ||
  //   process.env.NODE_ENV === "staging"
  // ) {
  //   app.use(express.static(path.resolve(__dirname, "client", "build")));
  //   app.get("*", (req, res) => {
  //     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  //   });
  // }
  
  app.listen(PORT, () => {});