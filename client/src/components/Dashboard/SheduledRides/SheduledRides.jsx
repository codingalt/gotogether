import React from 'react'
import css from './SheduledRides.module.scss'
import * as md from 'react-icons/md'
import * as ci from 'react-icons/ci'
import * as fa from 'react-icons/fa'
import * as bs from "react-icons/bs";
import * as vs from 'react-icons/vsc'
import * as hi from "react-icons/hi";
import * as io from "react-icons/io5";
import * as fc from "react-icons/fc";
import profile from '../../../images/faheem1.jpg'
import { NavLink, useNavigate } from 'react-router-dom'
import { useGetCampaignsByDriverIdQuery } from '../../../services/api/driverCampaign'
import Loader from '../../Loader/Loader'
import { useSelector } from 'react-redux'
import moment from 'moment'
import noData from '../../../images/empty1.svg'

const SheduledRides = () => {
    const navigate = useNavigate();
    const {profileImg} = useSelector((state) => state.user)
    const userId = localStorage.getItem("userId");
    const {data,isLoading,isError} = useGetCampaignsByDriverIdQuery(userId);
    console.log(data);
  return (
    <div className={css.wrapper}>
      <div className={css.top}>
        <md.MdArrowBackIosNew onClick={() => navigate("/home")} />
        <h1>Sheduled</h1>
        {isLoading ? (
          <Loader width={10} color="#3784FB" />
        ) : (
          <img
            src={`http://localhost:5000/Uploads/profile/${profileImg}`}
            alt=""
          />
        )}
      </div>

      <div className={css.shedules}>
        {data?.campaigns?.length === 0 && (
          <div className={css.noData}>
            <img src={noData} alt="" />
            <h1>You Currently have no sheduled rides</h1>
            <p>Shedule trip, save fuel price, share ride and earn money</p>
          </div>
        )}
        {isLoading ? (
          <div
            style={{
              minHeight: "55vh",
              width: "100vw",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader width={55} color={"#3784FB"} />
          </div>
        ) : (
          data?.campaigns?.map((item) => (
            <div className={`${css.card} border shadow-sm`} key={item._id}>
              <div className={css.head}>
                <span>Trip</span>
                <span>Edit Ride</span>
              </div>
              <div className={css.location}>
                <div className={css.icon}>
                  <fa.FaDotCircle />
                </div>
                <div className={css.text}>{item.startLocation}</div>
              </div>
              <div className={`${css.location} drop`}>
                <div className={css.icon}>
                  {/* <ci.CiLocationOn style={{ fontSize: "1.2rem" }} /> */}
                  <hi.HiLocationMarker style={{ fontSize: "1.2rem" }} />
                </div>
                <div className={css.text}>{item.endingLocation}</div>
              </div>

              <div className={css.details}>
                <div className={css.item} style={{ background: "#ECF8EB" }}>
                  <span>{item.seatCost}RS</span>
                  <span>Price</span>
                </div>
                <div className={css.item} style={{ background: "#F5E4F7" }}>
                  <span>{item.expectedRideTime}</span>
                  <span>Time</span>
                </div>
                <div className={css.item} style={{ background: "#E2F9FF" }}>
                  <span>{item.expectedRideDistance}</span>
                  <span>Distance</span>
                </div>
              </div>

              <div className={css.seats}>
                <div className={css.left}>
                  <md.MdOutlineAirlineSeatReclineExtra />
                  <span>Seats: </span>
                </div>
                <span>
                  {item.bookedSeats}/{item.availableSeats}
                </span>
              </div>
              {/* <div className={css.time}>
                <div>
                  <vs.VscCalendar />
                  <span>{moment(item.date).format("dddd, MMMM Do")}</span>
                </div>
                <span>{moment(item.time).format("hh:mm a")}</span>
              </div> */}
              <ul>
                {/* <li>
                  <div className={css.left}>
                    <fa.FaMoneyCheck />
                    <span>Price</span>
                  </div>
                  <div className={css.right}>
                    <span>{item.seatCost}</span>
                  </div>
                </li>
                <li>
                  <div className={css.left}>
                    <fa.FaCarAlt />
                    <span>Distance</span>
                  </div>
                  <div className={css.right}>
                    <span>{item.expectedRideDistance}</span>
                  </div>
                </li>
                <li>
                  <div className={css.left}>
                    <fa.FaCalendar />
                    <span>Time</span>
                  </div>
                  <div className={css.right}>
                    <span>{item.expectedRideTime}</span>
                  </div>
                </li> */}

                <li style={{ marginBottom: "3px" }}>
                  <div className={css.startRideBtns}>
                    <button
                    // style={{
                    //   background: "#f8d7da",
                    //   color: "#555",
                    // }}
                    >
                      Cancel
                    </button>

                    <button>
                      <NavLink to={`/requests/${item._id}`}>
                        <md.MdRequestQuote style={{ marginRight: "5px" }} />{" "}
                        Requests
                      </NavLink>
                    </button>
                  </div>
                </li>
                <li>
                  <button className={css.cancelBtn}>
                    <io.IoSpeedometerSharp style={{ marginRight: "5px" }} />{" "}
                    Start Ride
                  </button>
                </li>
              </ul>

              {/* <div className={css.buttons}>
                <button>Cancel</button>
                <button className={css.start}>Start Ride</button>
                </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SheduledRides