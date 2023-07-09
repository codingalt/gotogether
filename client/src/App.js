import "./App.css";
import "./styles/global.scss";
import HomePage from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import Signup from "./components/Signup/Signup";
import { Route, Routes } from "react-router-dom";
import VerifyOtp from "./components/VerifyOtp/VerifyOtp";
import UserInfo from "./components/UserInfo/UserInfo";
import RegisterDriver from "./components/RegisterDriver/RegisterDriver";
import Main from "./components/Dashboard/Main/Main";
import AddCampaign from "./components/Dashboard/AddCampaign/AddCampaign";
import { useEffect, useMemo, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";
import MainContext from "./components/Context/MainContext";
import Protected from "./components/Protected/Protected";
import Sidebar from "./components/Dashboard/Sidebar/Sidebar";
import Sidebar2 from "./components/Dashboard/Sidebar/Sidebar2";
import Profile from "./components/Dashboard/Profile/Profile";
import 'boxicons';
import Campaigns from "./components/Dashboard/Campaigns/Campaigns";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData } from "./services/redux/userSlice";
import { useGetDriverQuery, useGetUserQuery } from "./services/api/userApi";
import WaitingTimer from "./components/Dashboard/WaitingTimer/WaitingTimer";
import SheduledRides from "./components/Dashboard/SheduledRides/SheduledRides";
import ViewCampaign from "./components/Dashboard/ViewCampaign/ViewCampaign";
import PassengerRequests from "./components/Dashboard/PassengerRequests/PassengerRequests";
import io from "socket.io-client";

const ENDPOINT = "https://gotogether-283d17c4540b.herokuapp.com/";
var socket, selectedChatCompare;

function App() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const user = useSelector((state) => state.user);
  const {data,isLoading,isSuccess} = useGetUserQuery(userId);
  const [campaign, setCampaign] = useState(false);
  const [renderDirection, setRenderDirection] = useState(null);
  const libraries = useMemo(() => ["places"], []);
  const [confirmLocation, setConfirmLocation] = useState(false);
  const [startingLocation, setStartingLocation] = useState("");
  const [finalLocation, setFinalLocation] = useState("");
  const [pinIcon, setPinIcon] = useState(false);
  const [origin, setOrigin] = useState(null);
  const [sidebar,setSidebar] = useState(false);
  const [notification, setNotification] = useState([]);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API,
    libraries,
  });

  if(isSuccess){
    dispatch(setProfileData({userId: data?.data[0]?.userId, isDriver: data?.data[0]?.isDriver,profileImg: data?.data[0]?.profileImg,phone: data?.data[0]?.phone, name: data?.data[0]?.name,totalRating: data?.data[0]?.totalRating, totalReviewsGiven: data?.data[0]?.totalReviewsGiven}))
  }

  console.log('Notification', notification);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () =>{});
  }, []);

  useEffect(() => {
    socket.emit("setup", userId);
    socket.emit("join chat", userId);
  }, [userId, user, data]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      // Give Notification
      console.log(newMessageReceived);
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
        }   
    });
    socket.on("request received", (newRequest) => {
        console.log("New Request Recv", newRequest);      
    });
  });

  return (
    <div className="App">
      <MainContext.Provider
        value={{
          isLoaded,
          campaign,
          setCampaign,
          renderDirection,
          setRenderDirection,
          confirmLocation,
          setConfirmLocation,
          startingLocation,
          setStartingLocation,
          finalLocation,
          setFinalLocation,
          pinIcon,
          setPinIcon,
          origin,
          setOrigin,
          sidebar,
          setSidebar,
          notification,
          setNotification,
          socket,
        }}
      >
        <wc-toast theme="light"></wc-toast>
        <AddCampaign />
        <Sidebar />
        {/* <Sidebar2 /> */}
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route exact path="/signup" element={<Signup />} />
          <Route exact path="/verify" element={<VerifyOtp />} />
          <Route
            exact
            path="/info"
            element={<Protected Component={UserInfo} />}
          />
          <Route
            exact
            path="/driverinfo"
            element={<Protected Component={RegisterDriver} />}
          />
          <Route exact path="/home" element={<Protected Component={Main} />} />
          <Route
            exact
            path="/profile"
            element={<Protected Component={Profile} />}
          />
          <Route
            exact
            path="/campaigns"
            element={<Protected Component={Campaigns} />}
          />
          <Route
            exact
            path="/campaign/:campaignId"
            element={<Protected Component={ViewCampaign} />}
          />
          <Route
            exact
            path="/waiting"
            element={<Protected Component={WaitingTimer} />}
          />
          <Route
            exact
            path="/sheduledrides"
            element={<Protected Component={SheduledRides} />}
          />
          <Route
            exact
            path="/requests/:campaignId"
            element={<Protected Component={PassengerRequests} />}
          />
        </Routes>
      </MainContext.Provider>
    </div>
  );
}

export default App;
