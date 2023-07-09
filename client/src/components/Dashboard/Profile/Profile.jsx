import React, { useEffect } from 'react'
import './Profile.scss'
import profile from '../../../images/faheem1.jpg'
import * as md from 'react-icons/md';
import * as bi from 'react-icons/bi';
import * as ai from 'react-icons/ai';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetUserQuery } from '../../../services/api/userApi';
import { toastError } from '../../Toast/Toast';
import Loader from '../../Loader/Loader';
import { useSelector } from 'react-redux';

const Profile = () => {
    const userId = localStorage.getItem("userId");
    const {data,isLoading,isSuccess,isError,error} = useGetUserQuery(userId);
    console.log(data);
    const location = useLocation();
    let fromRoute = location.state?.from?.pathname;
    const navigate = useNavigate();
    const logoutUser = ()=>{
        localStorage.removeItem("jwtoken_auth");
        localStorage.removeItem("userId");
        navigate('/')
        window.location.reload(false);
    }

    useEffect(()=>{
        if(isError){
            toastError(error?.data?.message);
            console.log(error?.data?.message);
          }
    },[]);

  return (
    <div className='profile-wrapper'>
        <div className="profile-header">
            <md.MdArrowBackIosNew onClick={()=> navigate('/home')} />
            <span>Profile Details</span>
            <bi.BiEditAlt />
        </div>
        {
            isLoading ? (
                <div style={{minHeight:'80vh',width:'100vw',display:'flex',justifyContent:'center',alignItems:'center'}}>
                <Loader width={55} color={'#3784FB'} />
            </div>
            ) : (
                <div className="user_profile_wrap">
                <div className="profile_info">
                  <div className="img">
                    <img src={`http://localhost:5000/Uploads/profile/${data?.data[0]?.profileImg}`} alt="" />
                  </div>
                  <div className="detail">
                    <h3>{data?.data[0]?.name}</h3>
                    <span>Rating {""} {data?.data[0]?.totalRating/data?.data[0]?.totalReviewsGiven}<ai.AiFillStar style={{color:'#FDCC0D',marginBottom:'2px'}} /></span>
                  </div>
                </div>
    
                <div className="personal_data">
                  <div className="p_item">
                    <i className="bx bxs-phone"></i>
                    <span>{data?.data[0]?.phone}</span>
                  </div>
                  <div className="p_item">
                    <i className="bx bx-envelope"></i>
                    <span>{data?.data[0]?.email}</span>
                  </div>
                </div>
    
                <div className="wallet_container">
                  <div className="left">
                    <span>$00.00</span>
                    <span>Wallet</span>
                  </div>
                  <div className="left">
                    <span>12</span>
                    <span>Rides</span>
                  </div>
                </div>
    
                <div className="user_features">
                  <ul>
                    <li>
                        <div className="left-item">
                        <i className="bx bx-heart"></i>
                        <span>Your Favorites</span>
                        </div>
                        <md.MdArrowForwardIos />
                    </li>
                    <li>
                    <div className="left-item">
                      <i className="bx bx-wallet"></i>
                      <span>Payment</span>
                      </div>
                      <md.MdArrowForwardIos />
                    </li>
                    <li>
                    <div className="left-item">
                      <i className="bx bx-user"></i>
                      <span>Invite Friend</span>
                      </div>
                      <md.MdArrowForwardIos />
                    </li>
                    <li>
                    <div className="left-item">
                      <i className="bx bx-cog"></i>
                      <span>Settings</span>
                      </div>
                      <md.MdArrowForwardIos />
                    </li>
                    <li>
                    <div className="left-item">
                      <i className="bx bx-purchase-tag-alt"></i>
                      <span>Promotions</span>
                      </div>
                      <md.MdArrowForwardIos />
                    </li>
                    <li>
                    <div className="left-item" onClick={logoutUser}>
                      <i className="bx bx-power-off"></i>
                      <span>Logout</span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            )
        }
       
        </div>
  )
}

export default Profile