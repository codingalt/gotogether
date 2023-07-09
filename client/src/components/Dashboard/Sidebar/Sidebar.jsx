import React, { useContext, useEffect, useRef, useState } from "react";
import MainContext from "../../Context/MainContext";
import "./sidebar.scss";
import profile from "../../../images/faheem1.jpg";
import * as hi from "react-icons/hi";
import * as ai from "react-icons/ai";
import * as bi from "react-icons/bi";
import * as cg from "react-icons/cg";
import * as tb from "react-icons/tb";
import * as gr from "react-icons/gr";
import * as ri from "react-icons/ri";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotificationModal from "../../NotificationModal/NotificationModal";

const Sidebar = () => {
  const { sidebar, setSidebar, campaign, setCampaign, notification } =
    useContext(MainContext);
  const navigate = useNavigate();
  const { isDriver,name,profileImg,totalRating,totalReviewsGiven } = useSelector((state) => state.user);
  const sidebarRef = useRef(null);
  let pathname = window.location.pathname;
  const location = useLocation();
  const logoutUser = () => {
    localStorage.removeItem("jwtoken_auth");
    localStorage.removeItem("userId");
    navigate("/");
    window.location.reload(false);
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handler = (event) => {
      if (!sidebarRef.current?.contains(event.target)) {
        setSidebar(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);
  useEffect(() => {
    pathname = window.location.pathname;
  }, [window.location.pathname]);
  return (
    <>
      <NotificationModal open={open} handleOpen={handleOpen} handleClose={handleClose} />
      <div className={sidebar ? "sidebar-overlay sidebar-active" : ""}></div>
      <div
        ref={sidebarRef}
        className={sidebar ? "sidebar sidebar-active" : "sidebar"}
      >
        <div className="sidebar-profile">
          <NavLink
            to="/profile"
            state={{ from: location }}
            onClick={() => setSidebar(false)}
          >
            <div className="inner">
              <img
                src={`http://localhost:5000/Uploads/profile/${profileImg}`}
                alt=""
              />
              <div className="online-dot"></div>
              <div className="name">
                <span>{name}</span>
                {isDriver ? (
                  <span>
                    Rating {totalRating / totalReviewsGiven}{" "}
                    <ai.AiFillStar
                      style={{ color: "#FDCC0D", marginBottom: "2px" }}
                    />
                  </span>
                ) : (
                  <span style={{ fontSize: ".8rem" }}>Passenger Mode</span>
                )}
              </div>
              <div className="icon">
                <label className="nav-toggle" htmlFor="nav-toggle">
                  <i className="fa-solid fa-xmark"></i>
                </label>
              </div>
            </div>
          </NavLink>
        </div>
        <div className="sidebar-menu">
          <ul>
            <li
              className={pathname.match("/home") ? "activeli" : ""}
              onClick={() => setSidebar(false)}
            >
              <NavLink to="/home">
                <hi.HiOutlineHome
                  className={pathname.match("/home") ? "white" : ""}
                />
                <span className={pathname.match("/home") ? "white" : ""}>
                  Dashboard
                </span>
              </NavLink>
            </li>
            <li onClick={() => setSidebar(false)}>
              {isDriver ? (
                <NavLink
                  to="#"
                  onClick={() => {
                    setCampaign(true);
                  }}
                >
                  <tb.TbLocation />
                  <span>Post Campaign</span>
                </NavLink>
              ) : (
                <NavLink
                  to="/campaigns"
                  className={pathname.match("/campaigns") ? "activeli" : ""}
                >
                  <tb.TbLocation
                    className={pathname.match("/campaigns") ? "white" : ""}
                  />
                  <span className={pathname.match("/campaigns") ? "white" : ""}>
                    Campaigns
                  </span>
                </NavLink>
              )}
            </li>
            <li onClick={() => {setSidebar(false); handleOpen()}}>
              <NavLink
                to="#"
                className={pathname.match("/notification") ? "activeli" : ""}
              >
                <ri.RiNotification2Line
                  className={pathname.match("/notification") ? "white" : ""}
                />
                <span
                  className={pathname.match("/notification") ? "white" : ""}
                >
                  Notification
                </span>
                {notification.length > 0 && (
                  <div className="notification_count">
                    {notification?.length}
                  </div>
                )}
              </NavLink>
            </li>
            {isDriver && (
              <li onClick={() => setSidebar(false)}>
                <NavLink to="/sheduledrides">
                  <ai.AiOutlineCalendar />
                  <span>Sheduled Rides</span>
                </NavLink>
              </li>
            )}
            <li onClick={() => setSidebar(false)}>
              <NavLink to="#">
                <ai.AiOutlineHistory />
                <span>Previous Rides</span>
              </NavLink>
            </li>
            <li onClick={() => setSidebar(false)}>
              <NavLink to="/profile">
                <cg.CgProfile />
                <span>Profile</span>
              </NavLink>
            </li>
            <li onClick={() => setSidebar(false)}>
              <NavLink to="/profile">
                <ai.AiOutlineSetting />
                <span>Settings</span>
              </NavLink>
            </li>
            <li onClick={() => setSidebar(false)}>
              <NavLink to="#">
                <bi.BiHelpCircle />
                <span>Help</span>
              </NavLink>
            </li>
            <li
              onClick={() => {
                setSidebar(false);
                logoutUser();
              }}
            >
              <NavLink to="#">
                <bi.BiLogOutCircle />
                <span>Logout</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
