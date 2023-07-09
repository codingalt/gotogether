import React, { useEffect, useState } from "react";
import css from "./Signup.module.scss";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import mobileOtp from '../../images/mobile1.png'
import { useGetOtpMutation } from "../../services/api/userApi";
import { useNavigate } from "react-router-dom";
import {useDispatch } from 'react-redux'
import { setPhoneNumber } from "../../services/redux/userSlice";
import Loader from "../Loader/Loader";
import { toastError, toastSuccess } from "../Toast/Toast";

const Signup = () => {
    const dispatch = useDispatch();
    const [phone,setPhone] = useState('');
    const navigate = useNavigate();
    const [getOtp,result] = useGetOtpMutation();
    const {isLoading,isSuccess,isError} = result;

    const handleSubmit = async()=>{
      if(phone === ""){
        toastError('Please enter your phone number');
        return;
      }else{
        dispatch(setPhoneNumber(`+${phone}`));
        await getOtp(`+${phone}`);
      }
    }

    if(isError){
      toastError('Something went wrong');
    }

    if(isSuccess){
      toastSuccess('OTP Sent Successfully');
      navigate('/verify');
    }


   
  return (
    <div className={css.wrapper}>
      <header>
        <div className={css.circle}>
          <img src={mobileOtp} alt="" />
        </div>
        <h3>Registration</h3>
        <p>
          Enter your phone number to verify your account
        </p>

        <div className={css.mobileNumber}>
          <PhoneInput
            country={"pk"}
            inputClass= 'mobileInput'
            containerClass={'inputContainer'}
            value={phone}
            onChange={(phone) => setPhone(phone)}
          />
        </div>
      </header>

      <button disabled={isLoading} onClick={handleSubmit}>{isLoading ? <Loader width={25} color="#fff" /> : 'SEND OTP'}</button>
    </div>
  );
};

export default Signup;
