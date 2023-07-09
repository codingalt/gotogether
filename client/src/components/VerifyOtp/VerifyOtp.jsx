import React, { useEffect, useRef, useState } from 'react'
import css from './VerifyOtp.module.scss';
import mobileOtp from '../../images/otp.png';
import { useDispatch, useSelector } from 'react-redux';
import { useGetOtpMutation, useVerifyOtpMutation } from '../../services/api/userApi';
import { useNavigate } from "react-router-dom";
import { setUserData } from '../../services/redux/userSlice';
import Loader from '../Loader/Loader';
import { toastError, toastSuccess } from '../Toast/Toast';

const VerifyOtp = () => {
  const { phone } = useSelector((state) => state.user);
  const [otpText,setOtpText] = useState([]);
  const [verifyOtp, result] = useVerifyOtpMutation();
  const [getOtp,response] = useGetOtpMutation();
  const {isLoading,isSuccess,data,isError,error} = result;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pin1 = useRef();
  const pin2 = useRef();
  const pin3 = useRef();
  const pin4 = useRef();

  const handleSubmit = async()=>{
    const otpCode = otpText.toString();
    const otp = otpCode.replace(/,/g,'');
    if(otp === ""){
      toastError('Please enter your 4 digit OTP Code.');
      return;
    }
    await verifyOtp({phone,otp})
  }

  const resendCode = async()=>{
    const resend = await getOtp(`${phone}`);
    if(resend.data.success){
      toastSuccess('Code Resent');
    }
  }

  const handleChange = (e)=>{
    setOtpText(current => [...current, e.target.value]);
  }

    if(isSuccess){
      const {userId,token,isProfileCreated,isDriver,isDriverProfileCreated} = data;
      dispatch(setUserData({userId, token}))
      localStorage.setItem('userId',userId);
      localStorage.setItem('jwtoken_auth',token);
      if(isProfileCreated){
        if(isDriver){
          if(isDriverProfileCreated){
            navigate('/home')
          }else{
            navigate('/driverinfo')
          }
        }else{
          navigate('/home');
        }
      }else{
        navigate('/info');
      }
      
    }

    useEffect(()=>{
      if(isError){
        toastError(error.data.message);
      }
    },[isError]);
    

  return (
    <div className={css.wrapper}>
      <header>
        <div className={css.circle}>
          <img src={mobileOtp} alt="" />
        </div>
        <h3>Registration</h3>
        <p>
          Enter the 4 digit code sent to your mobile number
        </p>

        <div className={css.mobileOtp}>
         <input type="text" autoComplete='off' ref={pin1} onChange={(text) => {text && pin2.current.focus(); handleChange(text);}} min={0} max={9} maxLength={1} onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9]/g,'')}} />
         <input type="text" autoComplete='off' ref={pin2} onChange={(text) => {text ? pin3.current.focus() : pin1.current.focus(); handleChange(text);}} min={0} max={9} maxLength={1} onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9]/g,'')}} />
         <input type="text" autoComplete='off' ref={pin3} onChange={(text) => {text ? pin4.current.focus() : pin2.current.focus(); handleChange(text);}} min={0} max={9} maxLength={1} onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9]/g,'')}} />
         <input type="text" autoComplete='off' ref={pin4} onChange={(text) => {text ? pin4.current.focus() : pin2.current.focus(); handleChange(text);}} min={0} max={9} maxLength={1} onInput={(e)=> {e.target.value = e.target.value.replace(/[^0-9]/g,'')}} />
        </div>

        <p className={css.resend}>Did'nt receive any code? <span onClick={()=> {resendCode();}}>Resend</span></p>
      </header>

      <button onClick={handleSubmit}>{isLoading ? <Loader width={25} color="#fff" /> : 'Continue'}</button>
    </div>
  )
}

export default VerifyOtp