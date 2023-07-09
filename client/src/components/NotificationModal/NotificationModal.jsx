import React, { useContext, useState } from 'react'
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import './Notification.scss'
import css from "./Notification.scss";
import MainContext from '../Context/MainContext';

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  border: "none",
  p: 4,
};

const NotificationModal = ({open, handleClose, handleOpen}) => {
  const {notification} = useContext(MainContext);
  return (
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
        <Box className={"popupModal"}>
          <div className="noti_dropdown">
            <div className="shadow-sm noti-header">
              <Typography
                fontWeight={600}
                id="transition-modal-title"
                variant="h6"
                component="h3"
              >
                Notifications
              </Typography>
              <span className="count bg-primary">{notification?.length}</span>
            </div>
            <ul>
              {notification && notification.length > 0 ? (
                notification?.map((item) => {
                  return (
                    <li className='unread'>
                      <div className="icon">
                        {item.senderImage ? (
                          <img
                            src={`http://localhost:5000/Uploads/profile/${item.senderImage}`}
                            alt=""
                          />
                        ) : (
                          <img
                            src={`http://localhost:5000/Uploads/profile/${item.profileImg}`}
                            alt=""
                          />
                        )}
                      </div>
                      <div className="content">
                        {item.senderName ? (
                          <span style={{ fontWeight: "600" }}>
                            {item.senderName}{" "}
                          </span>
                        ) : (
                          <span style={{ fontWeight: "600" }}>
                            {item.name}{" "}
                          </span>
                        )}

                        {item.content ? (
                          <>
                            <span
                              style={{ color: "#212121", fontWeight: "500" }}
                            >
                              sent you a message against your campaign{" "}
                              <span style={{ color: "#3784FB !important" }}>
                                {item.content?.slice(0, 5)}..
                              </span>
                            </span>
                            <div className="noti_btns">
                              <button>Reply</button>
                              <button>Details</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <span
                              style={{ color: "#212121", fontWeight: "500" }}
                            >
                              sent you a ride request on your campaign{" "}
                            </span>
                            <div className="noti_btns">
                              <button style={{ background: "#66D379" }}>
                                Accept
                              </button>
                              <button
                                style={{
                                  border: "1px solid #d9534f",
                                  color: "#d9534f",
                                }}
                              >
                                Decline
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })
              ) : (
                <>
                  <Typography
                    fontWeight={600}
                    id="transition-modal-title"
                    variant="h6"
                    textAlign={"center"}
                    mt={12}
                    component="h4"
                  >
                    No Notifications yet
                  </Typography>
                  <Typography
                    fontWeight={500}
                    color={'#555'}
                    id="transition-modal-title"
                    textAlign={"center"}
                    mt={0.7}
                    component="h3"
                    fontSize={'.87rem'}
                  >
                    Please Check Back later
                  </Typography>
                </>
              )}
            </ul>
          </div>

          <Box mt={4} mr={2.4} ml={"auto"} width={"10rem"}>
            <Button
              sx={{ width: "10rem", height: "2.6rem" }}
              variant="contained"
              onClick={() => {
                handleClose();
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}

export default NotificationModal