import React, { useEffect, useRef, useState } from 'react'
import css from './Campaigns.module.scss'
import * as md from 'react-icons/md';
import * as io from 'react-icons/io5';
import * as ai from 'react-icons/ai';
import * as fa from 'react-icons/fa';
import * as vs from 'react-icons/vsc';
import profile from '../../../images/faheem1.jpg'
import user2 from '../../../images/profile3.jpg'
import time from '../../../images/time.png'
import Car from '../../../images/car.png'
import dateImg from '../../../images/date.png'
import Rupees from '../../../images/rupees.png'
import { useGetCampaignsQuery, useSearchCampaignsMutation } from '../../../services/api/campaignsApi';
import Loader from '../../Loader/Loader';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import noData from '../../../images/empty1.svg'
import SelectSeats from '../SelectSeats/SelectSeats';
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useNavigate } from "react-router-dom";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  border: 'none',
  p: 4,
};

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  // const {data,isLoading,isError,error} = useGetCampaignsQuery();
  const [seatsCard, setSeatsCard] = useState(false);
  const [totalSeats, setTotalSeats] = useState(null); 
  const [seatCost, setSeatCost] = useState(null) 
  const [campaignId, setCampaignId] = useState(null); 
  const [driverId, setDriverId] = useState(null); 
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false); 
    inputRef.current.focus();
  };
  const [searchType, setSearchType] = useState('origin');
  const [query, setQuery] = useState('');
  const [searchCampaigns, result] = useSearchCampaignsMutation();
  const { isLoading: loading, isSuccess: isSearchSuccess, isError: isSearchError } = result;
  const inputRef = useRef();

  const handleCheckBox = (e)=>{
    setSearchType(e.target.name)
  }

  const handleSearch = async()=>{
    const {data} = await searchCampaigns({searchType: searchType, query: query});
    setCampaigns(data?.result);
  }

  const handleCampaigns = async()=>{
    const { data } = await searchCampaigns();
    setCampaigns(data?.result);
    console.log(data);
  }

  useEffect(()=>{
    if(query === ''){
      handleCampaigns();
    }
  },[query]);

  const handleKeyDown = async(event) => {
    if (event.key === "Enter") {
      await handleSearch();
    }
  };

  return (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box className={css.popupModal}>
            <Typography
              fontWeight={600}
              id="transition-modal-title"
              variant="h6"
              component="h3"
            >
              Select Location type to Search Nearest Rides
            </Typography>
            <Box mt={2}>
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox checked={searchType === "origin"} />}
                  checked={searchType === "origin"}
                  label="Start Location"
                  name="origin"
                  onChange={handleCheckBox}
                />
                <FormControlLabel
                  control={<Checkbox />}
                  checked={searchType === "destination"}
                  label="Destination Location"
                  onChange={handleCheckBox}
                  name="destination"
                  sx={{ marginTop: "3px" }}
                />
              </FormGroup>
            </Box>
            <Box mt={2} ml={"auto"} width={"10rem"}>
              <Button
                sx={{ width: "10rem", height: "2.6rem" }}
                variant="contained"
                onClick={() => {
                  handleClose();
                }}
              >
                Done
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
      <SelectSeats
        seatsCard={seatsCard}
        setSeatsCard={setSeatsCard}
        totalSeats={totalSeats}
        seatCost={seatCost}
        campaignId={campaignId}
        driverId={driverId}
      />
      <div className={css.wrapper}>
        <div className={css.header}>
          <div className={css.left}>
            <span onClick={()=> navigate('/home')}>Find your</span>
            <span>Destination</span>
          </div>
          <div className={css.right}>
            {/* <md.MdOutlineNotificationsNone onClick={handleOpen} /> */}
            <io.IoFilterSharp onClick={handleOpen} />
          </div>
        </div>

        <div className={css.searchBox}>
          <io.IoSearch />
          <input
            ref={inputRef}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Search places.."
          />
        </div>

        <div className={css.banner}>
          <div className={css.overlay}>
            <div className={css.text}>
              <span>Browse Rides</span>
              <span>Nearest you</span>
            </div>
          </div>
        </div>

        <div className={css.campaigns}>
          {campaigns?.length === 0 && !loading &&  (
            <div className={css.noData}>
              <img src={noData} alt="" />
              <h1>Oops! Currenlty no ride that matches your route</h1>
              <p>
                Please explore back in a while to find the best and comfortable
                ride in lowest prices.
              </p>
            </div>
          )}
          {loading ? (
            <div
              style={{
                minHeight: "50vh",
                width: "100vw",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Loader width={55} color={"#3784FB"} />
            </div>
          ) : (
            campaigns?.map((item) => (
              <div className={css.card} key={item._id}>
                <div className={css.top}>
                  <div className={css.ridePrice}>
                    <span>Cost/Seat</span>
                    <span>150PKR</span>
                  </div>
                  <div className={css.left}>
                    <img
                      src={`http://localhost:5000/Uploads/profile/${item.profileImg}`}
                      alt=""
                    />
                  </div>
                  <div className={css.right}>
                    <span>{item.name}</span>
                    <div className={css.rating}>
                      <ai.AiFillStar />{" "}
                      <span>{item.totalRating / item.totalReviewsGiven}/5</span>
                    </div>
                  </div>
                </div>
                <div className={css.dateTime}>
                  <div className={css.left}>
                    <vs.VscCalendar />
                    <span>{moment(item.date).format("dddd, MMMM Do")}</span>
                  </div>
                  <div className={css.right}>
                    <span>{moment(item.time).format("hh:mm a")}</span>
                  </div>
                </div>
                <div className={css.group}>
                  <span> From</span>
                  <span> {item.startLocation.split(", Pakistan")}</span>
                </div>
                <div className={css.divider}></div>
                <div className={css.group}>
                  <span>Destination</span>
                  <span>{item.endingLocation.split(", Pakistan")}</span>
                </div>

                {/* <div className={css.rideDetails}>
                <div className={css.item}>
                  <img src={time} alt="" />
                  <span>{item.expectedRideTime}</span>
                </div>
                <div className={css.item}>
                  <img src={dateImg} alt="" />
                  <span>{item.expectedRideDistance}</span>
                </div>
                <div className={css.item}>
                  <img src={Rupees} alt="" />
                  <span>{item.seatCostPerKm}RS</span>
                </div>
               
              </div> */}

                <div className={css.buttons}>
                  <NavLink to={`/campaign/${item._id}`}>
                    <button className={css.msg}>Details</button>
                  </NavLink>
                  <button
                    className={css.book}
                    onClick={() => {
                      setSeatsCard(true);
                      setCampaignId(item._id);
                      setDriverId(item.driverId)
                      setTotalSeats(item.availableSeats);
                      setSeatCost(parseInt(item.seatCost));
                    }}
                  >
                    Book Ride
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Campaigns