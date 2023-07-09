import React, { useEffect, useMemo, useRef, useState } from "react";
import css from "./AddCampaign.module.scss";
import * as bi from "react-icons/bi";
import * as fc from "react-icons/fc";
import * as hi from "react-icons/hi";
import * as md from "react-icons/md";
import * as im from "react-icons/im";
import * as go from "react-icons/go";
import * as io from "react-icons/io5";
import * as fa from "react-icons/fa";
import map from "../../../images/map.png";
import ac from "../../../images/ac4.png";
import smoke from "../../../images/smoke5.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useContext } from "react";
import MainContext from "../../Context/MainContext";
import {
  StandaloneSearchBox,
  DirectionsRenderer,
} from "@react-google-maps/api";
import moment from "moment";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";
import { MobileDatePicker } from "@mui/x-date-pickers";
import { usePostCampaignMutation } from "../../../services/api/driverCampaign";
import { useNavigate } from "react-router-dom";
import { toastError, toastSuccess } from "../../Toast/Toast";
import Loader from "../../Loader/Loader";
import location from "../../../images/location.png";

const AddCampaign = () => {
  const {
    isLoaded,
    campaign,
    setCampaign,
    setRenderDirection,
    setConfirmLocation,
    startingLocation,
    setStartingLocation,
    finalLocation,
    setFinalLocation,
    setPinIcon,
    setOrigin
  } = useContext(MainContext);
  const [postCampaign, result] = usePostCampaignMutation();
  const { isLoading, isSuccess, isError } = result;
  const navigate = useNavigate();
  const [sheduleRide, setSheduleRide] = useState(false);
  const [rideRule, setRideRule] = useState(null);
  const [directionResponse, setDirectionResponse] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const pickupRef = useRef();
  const destinationRef = useRef();
  const [resultArr, setResultArr] = useState([]);
  const [destinationArr, setDestinationArr] = useState([]);
  const handlePlaceChanged = (value) => {
    console.log(value);
    setResultArr([]);
    setStartingLocation(value.description);
    document.getElementById("startLocation").value = value.description;
  };
  const handleDestChanged = (value) => {
    // const [place] = destinationRef.current.getPlaces();
    // if (place) {
    //   console.log(place.formatted_address);
    //   setFinalLocation(place.formatted_address);
    //   console.log("lat", place.geometry.location.lat());
    //   console.log("lng", place.geometry.location.lng());
    // }
    console.log(value);
    setDestinationArr([]);
    setFinalLocation(value.description);
    document.getElementById("endingLocation").value = value.description;
  };

  const calculateRoute = async () => {
    if (startingLocation === "" || finalLocation === "") {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService();
    const results = await directionService.route({
      origin: startingLocation,
      destination: finalLocation,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    });
    // console.log("Start Loc LatLng",results.routes[0].legs[0].start_location.lat());
    setDirectionResponse(results);
    setRenderDirection(results);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
    // console.log("Direction Result", results.routes[0].legs[0]);
  };

  const handleInput = (e) => {
    if (e.target.value === "") {
      setResultArr([]);
      return;
    }
    // eslint-disable-next-line no-undef
    const service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: e.target.value }, (suggestions) => {
      setResultArr(suggestions);
    });
  };

  const handleDestinationInput = (e) => {
    if (e.target.value === "") {
      setDestinationArr([]);
      return;
    }
    // eslint-disable-next-line no-undef
    const service = new google.maps.places.AutocompleteService();
    service.getQueryPredictions({ input: e.target.value }, (suggestions) => {
      setDestinationArr(suggestions);
    });
  };

  const postCampaignSchema = Yup.object({
    startLocation: Yup.string().required("Enter Pickup Location"),
    endingLocation: Yup.string().required("Enter Destination Location"),
    // date: Yup.string().required("Date is Required"),
    // time: Yup.string().required("Campaign Time is Required"),
    seatCost: Yup.string().required("Cost Per Seat is Required"),
    availableSeats: Yup.number().required("Available Seats is Required"),
    // vehicleType: Yup.string().required("Vehicle Type is Required"),
  });

  const formik = useFormik({
    initialValues: {
      startLocation: "",
      endingLocation: "",
      date: "",
      time: "",
      rideRules: {
        isSmoke: false,
        isMusic: false,
        isAc: false,
      },
      seatCost: "",
      availableSeats: 0,
      comment: "",
    },
    validationSchema: postCampaignSchema,
    onSubmit: async(values) => {
      var rideDate;
      var rideTime;
      if (!sheduleRide) {
        var date = new Date();
        rideDate = date;
        rideTime = date;
        // rideDate = date.format("dddd, MMMM Do");
        // rideTime = moment().format("hh:mm a");
      } else {
        // rideDate = moment(formik.values.date).format("dddd, MMMM Do");
        // rideTime = moment(formik.values.time).format("hh:mm a");
        rideDate = formik.values.date;
        rideTime = formik.values.time;
      }

      const userId = localStorage.getItem("userId");
      await postCampaign({
        driverId: userId,
        startLocation: startingLocation,
        endingLocation: finalLocation,
        date: rideDate,
        time: rideTime,
        rideRules: formik.values.rideRules,
        seatCost: formik.values.seatCost,
        availableSeats: formik.values.availableSeats,
        comment: 'Comfort ride with AC and music',
        expectedRideDistance: distance,
        expectedRideTime: duration
      });

      formik.resetForm();

    },
  });

 

  useMemo(()=>{
    if (isSuccess) {
      toastSuccess("Your Campaign posted successfully");
      setTimeout(() => {
        setCampaign(false)
        navigate('/waiting')
      }, 3000);
    }
  },[isSuccess]);

  useEffect(() => {
    calculateRoute();
    if(startingLocation !== ""){
      document.getElementById("startLocation").value = startingLocation;
    }
    if(finalLocation !== ""){
      document.getElementById("endingLocation").value = finalLocation;
    }
  }, [finalLocation, startingLocation]);

  useEffect(() => {
    if (isError) {
      toastError(result?.error?.data?.message);
    }
  }, [isError]);


  return isLoaded ? (
    <div className={campaign ? css.active : css.wrapper}>
      <div className={css.header}>
        <bi.BiArrowBack onClick={() => setCampaign(false)} />
        <span>Post Campaign</span>
      </div>
      <div className={`${css.container} shadow-sm border`}>
        <form onSubmit={formik.handleSubmit}>
          <div className={css.campaignLocation}>
            <div className={css.locationLine}>
              <div className={css.line}></div>
              <div className={css.pickup}>
                <div className={css.dot}></div>
              </div>
              <div className={css.dest}>
                <div className={css.dot}></div>
              </div>
            </div>
            <div className={`${css.location} formGroup`}>
              <label>From</label>
              {/* <StandaloneSearchBox
                onLoad={(ref) => (pickupRef.current = ref)}
                onPlacesChanged={handlePlaceChanged}
              > */}
              <input
                type="text"
                name="startLocation"
                placeholder="Enter Pickup Location"
                onChange={(e) => {
                  handleInput(e);
                  formik.handleChange(e);
                }}
                style={startingLocation ? { background: "#fff" } : {}}
                className="shadow-sm"
                id="startLocation"
                autoComplete="off"
              />
              {/* </StandaloneSearchBox> */}

              <div className={`${css.autocomplete} shadow`}>
                {resultArr?.length != 0 &&
                  resultArr?.map((item, i) => {
                    return (
                      <div
                        className={css.itemValue}
                        key={i}
                        onClick={() => handlePlaceChanged(item)}
                      >
                        <div className={css.icon}>
                          <io.IoLocationSharp />
                        </div>
                        <div className={css.text}>
                          <span>{item.structured_formatting.main_text}</span>
                          <span>
                            {item.structured_formatting.secondary_text}
                          </span>
                        </div>
                        <div className={css.arrow}>
                          <im.ImArrowUpLeft2 />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className={css.chooseOnMap}>
                <img
                  src={map}
                  alt=""
                  onClick={() => {
                    setCampaign(false);
                    setConfirmLocation(true);
                    setOrigin(true);
                    setPinIcon(true);
                  }}
                />
                <span
                  onClick={() => {
                    setCampaign(false);
                    setConfirmLocation(true);
                    setPinIcon(true);
                    setOrigin(true);
                  }}
                >
                  Choose on Map
                </span>
              </div>
              {formik.touched.startLocation && formik.errors.startLocation ? (
                <div className={css.inputError}>
                  {formik.errors.startLocation}
                </div>
              ) : null}
            </div>
            <div className={`${css.location} formGroup`}>
              <label>Where To</label>
              {/* <StandaloneSearchBox
                onLoad={(ref) => (destinationRef.current = ref)}
                onPlacesChanged={handleDestChanged}
              > */}
              <input
                type="text"
                name="endingLocation"
                placeholder="Enter Destination Location"
                onChange={(e) => {
                  handleDestinationInput(e);
                  formik.handleChange(e);
                }}
                style={finalLocation ? { background: "#fff" } : {}}
                className="shadow-sm"
                id="endingLocation"
                autoComplete="off"
              />
              {/* </StandaloneSearchBox> */}
              <div
                className={`${css.autocomplete} shadow`}
                style={{ top: "90%" }}
              >
                {destinationArr?.length != 0 &&
                  destinationArr?.map((item, i) => {
                    return (
                      <div
                        className={css.itemValue}
                        key={i}
                        onClick={() => handleDestChanged(item)}
                      >
                        <div className={css.icon}>
                          {/* <go.GoLocation /> */}
                          <io.IoLocationSharp />
                          {/* <fa.FaSearch /> */}
                        </div>
                        <div className={css.text}>
                          <span>{item.structured_formatting.main_text}</span>
                          <span>
                            {item.structured_formatting?.secondary_text?.slice(
                              0,
                              50
                            )}
                            ..
                          </span>
                        </div>
                        <div className={css.arrow}>
                          <im.ImArrowUpLeft2 />
                        </div>
                      </div>
                    );
                  })}
              </div>

              <div className={css.chooseOnMap}>
                <img
                  src={map}
                  alt=""
                  onClick={() => {
                    setCampaign(false);
                    setConfirmLocation(true);
                    setPinIcon(true);
                    setOrigin(false);
                  }}
                />
                <span
                  onClick={() => {
                    setCampaign(false);
                    setConfirmLocation(true);
                    setPinIcon(true);
                    setOrigin(false);
                  }}
                >
                  Choose on Map
                </span>
              </div>
              {formik.touched.endingLocation && formik.errors.endingLocation ? (
                <div className={css.inputError}>
                  {formik.errors.endingLocation}
                </div>
              ) : null}
            </div>
          </div>
          {distance && duration && (
            <div className={css.routeInfo}>
              <div className={`${css.rinfo}`}>
                <hi.HiLocationMarker />
                <span>{distance}</span>
              </div>
              <div className={css.rinfo}>
                <bi.BiTime />
                <span>{duration}</span>
              </div>
            </div>
          )}
          {distance && duration && (
            <div className={css.viewRoute}>
              <span
                onClick={() => {
                  setCampaign(false);
                }}
              >
                View Route
              </span>
            </div>
          )}
          <div className={css.formGroup}>
            <div className="row">
              <div
                className="col-md-6 mb-2 mb-md-0"
                style={{ position: "relative" }}
              >
                <im.ImPriceTag
                  style={{
                    position: "absolute",
                    left: "5.8%",
                    top: "61.4%",
                    fontSize: "1.03rem",
                    color: "#3784FB",
                    opacity: ".9",
                  }}
                />
                <label style={{ marginBottom: "6px" }}>Cost Per Seat</label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.seatCost}
                  name="seatCost"
                  type="text"
                  placeholder="Cost / Seat  (PKR)"
                  autoComplete="off"
                />
                {formik.touched.seatCost && formik.errors.seatCost ? (
                  <div className={css.inputError}>{formik.errors.seatCost}</div>
                ) : null}
              </div>
              <div
                className="col-md-6 mb-2 mb-md-0"
                style={{ position: "relative" }}
              >
                <md.MdEventSeat
                  style={{
                    position: "absolute",
                    left: "5.8%",
                    top: "57.5%",
                    fontSize: "1.18rem",
                    color: "#3784FB",
                  }}
                />
                <label style={{ marginBottom: "6px" }}>Number Of Seats</label>
                <input
                  onChange={formik.handleChange}
                  value={formik.values.availableSeats}
                  name="availableSeats"
                  type="text"
                  placeholder="Number Of Seats"
                  autoComplete="off"
                  min={0}
                  max={9}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, "");
                  }}
                />
                {formik.touched.availableSeats &&
                formik.errors.availableSeats ? (
                  <div className={css.inputError}>
                    {formik.errors.availableSeats}
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className={css.ruleHeading} style={{ marginBottom: "0px" }}>
            <span style={{ marginBottom: "0px" }}>Shedule Ride</span>
          </div>
          <div className={css.rideShedule}>
            <div
              className={css.shedule}
              style={
                sheduleRide
                  ? {
                      background: "#d9d9d9",
                      color: "#000",
                      transition: "all .2s",
                    }
                  : { background: "#3784FB", transition: "all .2s" }
              }
              onClick={() => setSheduleRide(false)}
            >
              Now
            </div>
            <div
              className={css.shedule}
              style={
                sheduleRide
                  ? {
                      background: "#3784FB",
                      color: "#fff",
                      transition: "all .2s",
                    }
                  : { background: "#d9d9d9", transition: "all .2s" }
              }
              onClick={() => setSheduleRide(true)}
            >
              Shedule
            </div>
          </div>

          {sheduleRide && (
            <div className={css.sheduleData}>
              <div className={css.sheduleProps}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={[
                      "DatePicker",
                      "MobileDatePicker",
                      "DesktopDatePicker",
                    ]}
                  >
                    <DemoItem label="Select Date">
                      <MobileDatePicker
                        onChange={(e) => formik.setFieldValue("date", e.$d)}
                        defaultValue={dayjs("2023-04-17")}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>
                {formik.touched.date && formik.errors.date ? (
                  <div className={css.inputError}>{formik.errors.date}</div>
                ) : null}
              </div>
              <div className={css.sheduleProps}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer
                    components={[
                      "TimePicker",
                      "MobileTimePicker",
                      "DesktopTimePicker",
                    ]}
                  >
                    <DemoItem label="Select Time">
                      <MobileTimePicker
                        onChange={(e) => formik.setFieldValue("time", e.$d)}
                        defaultValue={dayjs("2023-04-17T15:30")}
                      />
                    </DemoItem>
                  </DemoContainer>
                </LocalizationProvider>

                {formik.touched.time && formik.errors.time ? (
                  <div className={css.inputError}>{formik.errors.time}</div>
                ) : null}
              </div>
            </div>
          )}

          <div className={css.ruleHeading}>
            <span>Ride Rules</span>
            <span className="text-secondary">
              Click on the options below to add the rule in your ride
            </span>
          </div>
          <div className={css.rideRules}>
            <div
              style={
                formik.values.rideRules.isMusic
                  ? { background: "#5cb85c", transition: "all .1s" }
                  : {}
              }
              className={`${css.rule} shadow-sm border`}
              onClick={() => {
                formik.setFieldValue("rideRules.isMusic", true);
              }}
            >
              <fc.FcMusic
                hidden={formik.values.rideRules.isMusic}
                style={formik.values.rideRules.isMusic ? { color: "#fff" } : {}}
              />
              {formik.values.rideRules.isMusic && (
                <md.MdDone style={{ color: "#fff", fontSize: "1.8rem" }} />
              )}
              <span
                style={formik.values.rideRules.isMusic ? { color: "#fff" } : {}}
              >
                Music
              </span>
            </div>
            <div
              style={
                formik.values.rideRules.isAc
                  ? { background: "#5cb85c", transition: "all .1s" }
                  : {}
              }
              className={`${css.rule} shadow-sm border`}
              onClick={() => {
                formik.setFieldValue("rideRules.isAc", true);
              }}
            >
              <img src={ac} alt="" hidden={formik.values.rideRules.isAc} />
              {formik.values.rideRules.isAc && (
                <md.MdDone style={{ color: "#fff", fontSize: "1.8rem" }} />
              )}
              <span
                style={formik.values.rideRules.isAc ? { color: "#fff" } : {}}
              >
                AC
              </span>
            </div>
            <div
              style={
                formik.values.rideRules.isSmoke
                  ? { background: "#5cb85c", transition: "all .1s" }
                  : {}
              }
              className={`${css.rule} shadow-sm border`}
              onClick={() => {
                formik.setFieldValue("rideRules.isSmoke", true);
              }}
            >
              <img
                src={smoke}
                alt=""
                hidden={formik.values.rideRules.isSmoke}
              />
              {formik.values.rideRules.isSmoke && (
                <md.MdDone style={{ color: "#fff", fontSize: "1.8rem" }} />
              )}
              <span
                style={formik.values.rideRules.isSmoke ? { color: "#fff" } : {}}
              >
                Smoking
              </span>
            </div>
          </div>

          <div className={css.submitBtn}>
            <button disabled={isLoading} type="submit">
              {isLoading ? <Loader width={25} color="#fff" /> : "Post Campaign"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default AddCampaign;
