import React, { useState, useContext, useEffect, useRef } from "react";
import * as bi from "react-icons/bi";
import * as ai from "react-icons/ai";
import * as si from "react-icons/si";
import * as go from "react-icons/go";
import * as cg from "react-icons/cg";
import * as gr from "react-icons/gr";
import * as fa from "react-icons/fa";
import * as md from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";
import "./sidebar2.scss";
import MainContext from "../../Context/MainContext";

const Sidebar2 = () => {
  let pathname = window.location.pathname;
  const { sidebar,setSidebar } = useContext(MainContext);
  const sidebarRef = useRef(null);
  
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
      <div className={sidebar ? 'sidebar-overlay activeSidebar' : ''}></div>
    <aside ref={sidebarRef} className={sidebar ? "sidebar activeSidebar" : "sidebar"}>
      {/* Sidebar Header */}
      {sidebar && (
        <div className="sidebar-header text-dark mb-3 text-cente">
          <NavLink style={{ textDecoration: "none" }} to={"/"}>
            SellMyPM
          </NavLink>
        </div>
      )}

      {/* Sidebar Links */}
      <div className="sidebar-menu">
        <div className="sidebar-links">
          <ul
            style={
              sidebar ? { paddingLeft: ".8rem" } : { paddingLeft: ".5rem" }
            }
          >
            <li
              className={
                pathname.match("/home") ? "active-sidebar-li" : ""
              }
            >
              <NavLink
                to="/home"
                className={pathname.match("/home") ? "white" : ""}
              >
                <span className={pathname.match("/home") ? "white" : ""}>
                  <bi.BiHome
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>Dashboard</span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li
              to={"/mylistings"}
              className={
                pathname.match("/mylistings") ? "active-sidebar-li" : ""
              }
            >
              <NavLink
                to="/mylistings"
                className={pathname.match("/mylistings") ? "white" : ""}
              >
                <span className={pathname.match("/mylistings") ? "white" : ""}>
                  <fa.FaListUl
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>
                  My Listings
                </span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li
              className={
                pathname.match("/buyerrequests") ? "active-sidebar-li" : ""
              }
            >
              <NavLink
                to="/buyerrequests"
                className={pathname.match("/buyerrequests") ? "white" : ""}
              >
                <span
                  className={pathname.match("/buyerrequests") ? "white" : ""}
                >
                  <bi.BiGitPullRequest
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>
                  Buyer Requests
                </span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li className={pathname.match("/chat") ? "active-sidebar-li" : ""}>
              <NavLink
                to="/chat"
                className={pathname.match("/chat") ? "white" : ""}
              >
                <span className={pathname.match("/chat") ? "white" : ""}>
                  <bi.BiMessageSquareDots
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>Messages</span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li
              className={
                pathname.match("/approvedrequests") ? "active-sidebar-li" : ""
              }
            >
              <NavLink
                to="/approvedrequests"
                className={pathname.match("/approvedrequests") ? "white" : ""}
              >
                <span
                  className={pathname.match("/approvedrequests") ? "white" : ""}
                >
                  <ai.AiOutlineFileDone
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>
                  Approved Requests
                </span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li
              className={
                pathname.match("/profile")
                  ? "active-sidebar-li sidebar-profile-li"
                  : "sidebar-profile-li"
              }
            >
              <NavLink
                to={"/profile"}
                className={pathname.match("/profile") ? "white" : ""}
              >
                <span className={pathname.match("/profile") ? "white" : ""}>
                  <cg.CgProfile
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>Profile</span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li
              className={
                pathname.match("/advisors")
                  ? "active-sidebar-li sidebar-advisor-li"
                  : "sidebar-advisor-li"
              }
            >
              <NavLink
                to={"/advisors"}
                className={pathname.match("/advisors") ? "white" : ""}
              >
                <span className={pathname.match("/advisors") ? "white" : ""}>
                  <gr.GrDocumentUser
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>Advisors</span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
            <li className={pathname === "/listing" ? "active-sidebar-li" : ""}>
              <NavLink
                to={"/listing"}
                className={pathname === "/listing" ? "white" : ""}
              >
                <span className={pathname === "/listing" ? "white" : ""}>
                  <go.GoBrowser
                    style={
                      sidebar
                        ? { marginLeft: "0px" }
                        : { marginLeft: "17px", fontSize: "30px" }
                    }
                  />
                </span>
                <span className={sidebar ? "" : "sidebar-txt"}>
                  Browse Listings
                </span>
              </NavLink>
              {sidebar && (
                <p>
                  <md.MdOutlineArrowForwardIos />{" "}
                </p>
              )}
            </li>
          </ul>
        </div>
      </div>
      <div className="logout-container d-flex justify-content-center mt-5">
        <div className="logout mt-5">
          <span>Logout</span>
          <span>
            <bi.BiLogOut />
          </span>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar2;
