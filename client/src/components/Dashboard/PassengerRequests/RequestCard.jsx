import React, { useEffect, useMemo, useState } from 'react'
import css from './PassengerRequests.module.scss'
import * as fa from 'react-icons/fa'
import * as md from "react-icons/md";
import { useApproveRequestMutation, useDeclineRequestMutation } from '../../../services/api/passengerRequestApi';
import { toastError, toastSuccess } from '../../Toast/Toast';

const RequestCard = ({data}) => {
    const [declineRequest, result] = useDeclineRequestMutation();
    const [approveRequest] = useApproveRequestMutation();
    const { isLoading, isSuccess, isError } = result;
    const [message, setMessage] = useState(false);
    const [error, setError] = useState('');

    const handleDeclineRequest = async(id) =>{
      await declineRequest(id)
    }

     const handleApproveRequest = async (campaignId, passengerRequestId) => {
       const result = await approveRequest({ campaignId, passengerRequestId });
       if (result.data?.success) {
         setMessage(true);
       }
       if (!result.error?.data.success) {
        toastError(result.error.data.message);
       }
     };

    useMemo(() => {
      if (isSuccess) {
        toastSuccess("Request Declined Successfully");
      }
    }, [isSuccess]);

    useMemo(() => {
      if (message) {
        toastSuccess("Request Approved Successfully");
      }
    }, [message]);

    useEffect(() => {
      if (error) {
        toastError(error);
      }
    }, [error]);

  return (
    <div className={`${css.card} border shadow-sm`}>
      <div className={css.top}>
        <div className={css.left}>
          <img
            src={`http://localhost:5000/Uploads/profile/${data?.profileImg}`}
            alt=""
          />
          <div className={css.data}>
            <span>{data?.name}</span>
            <span>{data?.phone?.split("+92")}</span>
          </div>
        </div>
        <div
          className={
            data?.requestStatus === "pending" ||
            data?.requestStatus === "decline"
              ? `${css.right} text-danger`
              : `${css.right} text-success`
          }
        >
          {data?.requestStatus}
        </div>
      </div>

      <div className={`${css.seatInfo} mt-4`}>
        <div className={css.left}>
          <md.MdOutlineAirlineSeatReclineExtra />
          <span>Requested Seats</span>
        </div>
        <div className={css.right}>
          <span>{data?.requireSeats}</span>
        </div>
      </div>
      <div className={css.seatInfo}>
        <div className={css.left}>
          <fa.FaMoneyCheck />
          <span>Charges Offer</span>
        </div>
        <div className={css.right}>
          <span>{data?.costPerSeat}RS</span>
        </div>
      </div>

      <div className={css.total}>
        <span>Total Bill: </span>
        <span>
          {" "}
          {parseInt(data?.costPerSeat) * parseInt(data?.requireSeats)}PKR
        </span>
      </div>

      <div className={css.buttons}>
        {data?.requestStatus === "pending" ? (
          <>
            <button onClick={()=>handleDeclineRequest(data._id)}>Decline</button>
            <button onClick={()=> {handleApproveRequest(data.campaignId, data._id)}}>Accept</button>
          </>
        ) : data?.requestStatus === "decline" ? (
          <button
            className={`${css.declinedBtn} btn btn-success`}
            disabled={true}
          >
            Declined
          </button>
        ) : (
          <button
            className={`${css.acceptedBtn} btn btn-success`}
            disabled={true}
          >
            Accepted
          </button>
        )}
      </div>
    </div>
  );
}

export default RequestCard