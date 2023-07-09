import React, { useContext, useEffect, useState } from 'react'
import css from './PassengerRequests.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import RequestCard from './RequestCard';
import { useDispatch, useSelector } from 'react-redux';
import * as md from 'react-icons/md'
import Loader from '../../Loader/Loader';
import {
  useGetPassengerRequestsQuery,
  passengerRequestApi,
} from "../../../services/api/passengerRequestApi";
import MainContext from '../../Context/MainContext';
// import { requestsRefetch } from '../../../services/redux/userSlice';
import axios from 'axios'

const PassengerRequests = () => {
  const { socket, setNotification, notification } = useContext(MainContext);
  const dispatch = useDispatch();
  const [newRequest, setNewRequest] = useState(false);
  const [passengerRequests, setPassengerRequests] = useState([]);
    const {campaignId} = useParams();
    const { data, isLoading, isError, error } = useGetPassengerRequestsQuery(
      campaignId,
      { refetchOnMountOrArgChange: true }
    );
    const { profileImg } = useSelector((state) => state.user);
    const navigate = useNavigate();

    const requestsRefetch = async(id) =>{
      const { data } = await axios.get(
        `http://localhost:5000/passenger/request/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtoken_auth")}`,
          },
        }
      );
      console.log(data);
      setPassengerRequests(data?.requests);
   
    }

    useEffect(()=> {
       socket.on("request received", (newRequest) => {
        if(newRequest){
          setNewRequest(!newRequest);
          requestsRefetch(campaignId);
          console.log('New Request Recv', newRequest);   
        setNotification([passengerRequests[0], ...notification]);
        }
       });
    });

    useEffect(()=>{
      if(campaignId){
        requestsRefetch(campaignId)
      }
    },[newRequest]);
    
  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <md.MdArrowBackIosNew onClick={() => navigate("/sheduledrides")} />
        <h1>Ride Requests</h1>
        {isLoading ? (
          <Loader width={10} color="#3784FB" />
        ) : (
          <img
            src={`http://localhost:5000/Uploads/profile/${profileImg}`}
            alt=""
          />
        )}
      </div>
      <div className={css.cards}>
        {passengerRequests?.map((item) => {
          return <RequestCard key={item._id} data={item} />;
        })}
      </div>
    </div>
  );
}

export default PassengerRequests