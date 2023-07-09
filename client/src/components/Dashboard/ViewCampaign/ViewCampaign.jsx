import React, { useEffect, useState } from 'react'
import css from './ViewCampaign.module.scss'
import { useNavigate, useParams } from 'react-router-dom'
import * as ai from 'react-icons/ai'
import * as bi from 'react-icons/bi'
import * as fa from 'react-icons/fa'
import * as md from 'react-icons/md'
import * as bs from 'react-icons/bs'
import * as io from 'react-icons/io5'
import profileImg from '../../../images/faheem1.jpg'
import { toastSuccess } from '../../Toast/Toast'
import vehicle from '../../../images/c4.jpg'
import loadingProfile from '../../../images/loadingProfile.png'
import { useGetCampaignsByIdQuery } from '../../../services/api/campaignsApi'
import Chat from '../Chat/Chat'

const ViewCampaign = () => {
  const [chatCard, setChatCard] = useState(false);
  const [driverData, setDriverData] = useState(null)
    const navigate = useNavigate();
    const {campaignId} = useParams();
    let pathname = window.location;
    const {data,isLoading,isError} = useGetCampaignsByIdQuery(campaignId);
    console.log(data);

    useEffect(() => {
        pathname = window.location.href;
      }, [window.location.href]);

    const copyUrl = () => {
        navigator.clipboard.writeText(pathname);
        toastSuccess("URL Copied to clipboard.");
      };
  return (
    <div className={css.wrapper}>
      {/* Calling chat Component  */}
      <Chat chatCard={chatCard} driverData={driverData} setChatCard={setChatCard} />

      <div className={`${css.profileHeader}`}>
        <md.MdArrowBackIosNew onClick={() => navigate("/campaigns")} />
        <span>Ride Details</span>
        <img src={profileImg} alt="" />
      </div>

      <div className={css.profileDetail}>
        <div className={css.profileCover}></div>
        <img
          src={`http://localhost:5000/Uploads/profile/${data?.campaign?.profileImg}`}
          alt=""
        />
        <div className={css.right}>
          <h3>{data?.campaign?.name}</h3>
          <span>
            4.8/5 {"  "}{" "}
            <ai.AiFillStar style={{ color: "#FDCC0D", marginBottom: "4px" }} />
          </span>
        </div>
        {/* <div className={`${css.copyUrl} border`} onClick={copyUrl}>
             <span>
              <bs.BsLink45Deg />
            </span>
            </div> */}
      </div>

      {/* Actions Buttons  */}
      <div className={css.actionBtns}>
        <button>
          <io.IoCallOutline /> Call
        </button>
        <button onClick={()=> {setChatCard(true); setDriverData(data?.campaign);}}>
          <bi.BiMessageSquareDots /> Message
        </button>
      </div>

      <div className={css.group}>
        <span style={{ color: "#3784FB" }}>Pick up</span>
        <div className={css.location}>{data?.campaign?.startLocation}</div>
      </div>

      <div className={css.group} style={{ marginTop: "0rem" }}>
        <span style={{ color: "#499C3C" }}>Destination</span>
        <div className={css.location}>{data?.campaign?.endingLocation}</div>
      </div>

      <div className={css.campaignDetail}>
        <div className={css.item}>
          <span>Cost / Seat</span>
          <div>
            <fa.FaMoneyCheck />
            <span>{data?.campaign?.seatCost} Rupees</span>
          </div>
        </div>
        <div className={css.item}>
          <span>Expected Time</span>
          <div>
            <md.MdOutlineAccessTimeFilled />
            <span>
              {data?.campaign?.expectedRideTime?.split("mins")} minutes
            </span>
          </div>
        </div>
        <div className={css.item}>
          <span>Expected Distance</span>
          <div>
            <fa.FaWallet />
            <span>{data?.campaign?.expectedRideDistance}</span>
          </div>
        </div>
      </div>

      <h2>Vehicle Image</h2>
      <div className={css.vehicleImg}>
        <img
          src={`http://localhost:5000/Uploads/driver/vehicles/${data?.campaign?.vehicleImage}`}
          alt=""
        />
      </div>
    </div>
  );
}

export default ViewCampaign