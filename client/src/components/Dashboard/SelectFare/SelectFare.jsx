import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import css from './SelectFare.module.scss'
import * as fa from 'react-icons/fa'
import { usePostPassengerRequestMutation } from '../../../services/api/passengerRequestApi';
import { toastError, toastSuccess } from '../../Toast/Toast';
import MainContext from '../../Context/MainContext';

const SelectFare = ({
  seatsCard,
  setSeatsCard,
  seats,
  seatCost,
  campaignId,
  driverId,
}) => {
  const { socket } = useContext(MainContext);
  const seatRef = useRef(null);
  const [offerFare, setOfferFare] = useState(null);
  const [activeCard, setActiveCard] = useState(0);
  const [postPassengerRequest, result] = usePostPassengerRequestMutation();
  const { isLoading, isSuccess, isError } = result;

  useEffect(() => {
    setOfferFare(parseInt(seatCost) * seats);
  }, [seatCost, seats]);

  useMemo(() => {
    if (isSuccess) {
      toastSuccess("Request Sent Successfully");
      setSeatsCard(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      toastError(result?.error?.data?.message);
    }
  }, [isError]);

  useEffect(() => {
    const handler = (event) => {
      if (!seatRef.current?.contains(event.target)) {
        setSeatsCard(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const {data} = await postPassengerRequest({
      passengerId: userId,
      campaignId: campaignId,
      requireSeats: seats,
      costPerSeat: seatCost,
    });
    const newObj = {
      requestId: data?.postRequest?._id,
      passengerId: userId,
      campaignId,
      driverId,
      requireSeats: seats,
      costPerSeat: seatCost,
    };
    socket.emit("send passenger request", newObj);
  };

  return (
    <div
      className={!seatsCard ? css.wrapper : `${css.wrapper} ${css.activeCard}`}
    >
      <div className={css.card} ref={seatRef}>
        <div className={css.line}></div>

        <div className={css.seatInfo}>
          <div className={css.left}>
            <fa.FaCalendar />
            <span>Seats to book</span>
          </div>
          <div className={css.right}>
            <span>{seats}</span>
          </div>
        </div>
        <div className={css.seatInfo}>
          <div className={css.left}>
            <fa.FaMoneyCheck />
            <span>Cost/Seat</span>
          </div>
          <div className={css.right}>
            <span>{seatCost}PKR</span>
          </div>
        </div>

        <div className={css.offersWrap}>
          <h3
            onClick={() => {
              setOfferFare(0.9 * parseInt(seatCost) * seats);
            }}
          >
            Your Offer
          </h3>
          <div className={css.offers}>
            <div
              className={
                activeCard === 0 ? `${css.offer} ${css.active}` : `${css.offer}`
              }
              onClick={() => {
                setOfferFare(parseInt(seatCost) * seats);
                setActiveCard(0);
              }}
            >
              {parseInt(seatCost)}PKR
            </div>
            <div
              onClick={() => {
                setOfferFare(0.9 * parseInt(seatCost) * seats);
                setActiveCard(1);
              }}
              className={
                activeCard === 1 ? `${css.offer} ${css.active}` : `${css.offer}`
              }
            >
              {0.9 * parseInt(seatCost)}PKR
            </div>
            <div
              onClick={() => {
                setOfferFare(0.8 * parseInt(seatCost) * seats);
                setActiveCard(2);
              }}
              className={
                activeCard === 2 ? `${css.offer} ${css.active}` : `${css.offer}`
              }
            >
              {0.8 * parseInt(seatCost)}PKR
            </div>
            <div
              onClick={() => {
                setOfferFare(0.7 * parseInt(seatCost) * seats);
                setActiveCard(3);
              }}
              className={
                activeCard === 3 ? `${css.offer} ${css.active}` : `${css.offer}`
              }
            >
              {0.7 * parseInt(seatCost)}PKR
            </div>
          </div>
        </div>

        <div className={css.total}>
          <span>Total Bill: </span>
          <span> {offerFare}PKR</span>
        </div>

        <button onClick={handleSubmit} className={css.requestBtn}>
          Request Ride
        </button>
      </div>
    </div>
  );
};

export default SelectFare