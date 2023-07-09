import React, { useEffect, useState } from "react";
import css from "./UserInfo.module.scss";
import avatar from "../../images/avatar.png";
import male from "../../images/male.png";
import female from "../../images/female.png";
import * as ai from "react-icons/ai";
import { useRef } from "react";
import {ErrorMessage, useFormik } from "formik";
import * as Yup from 'yup';
import { useRegisterUserMutation } from "../../services/api/userApi";
import { toastError, toastSuccess } from "../Toast/Toast";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

const UserInfo = () => {
  const [gender, setGender] = useState("male");
  const [image, setImage] = useState(null);
  const imageRef = useRef();
  const [registerUser, result] = useRegisterUserMutation();
  const {isLoading,isSuccess,isError} = result;
  const navigate = useNavigate();

  const userSchema = Yup.object({
    name: Yup.string().required('Name is Required'),
    email: Yup.string().email('Invalid email address').required('Email is Required'),
    city: Yup.string().required('City is Required'),
    gender: Yup.string().required('Please Select gender'),
    profileImg: Yup.mixed().nullable().required('Please Select Profile Image'),
    isDriver: Yup.boolean().required('Specify Account Type')
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      city: "",
      gender: gender,
      profileImg: "",
      isDriver: false,
    },
    validationSchema: userSchema,
    onSubmit: (values) => {
      let formData = new FormData();
      const userId = localStorage.getItem('userId');
      formData.append("profileImg", values.profileImg);
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("city", values.city);
      formData.append("gender", values.gender);
      formData.append("isDriver", values.isDriver);
      formData.append("userId", userId);
      registerUser(formData)
      
    },
  });

  if(isSuccess){
    if(formik.values.isDriver === 'true'){
      navigate('/driverinfo')
    }else{
      navigate('/home')
    }
  }

  const openImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      let img = e.target.files[0];
      setImage({
        image: URL.createObjectURL(img),
      });
    }
  };

  useEffect(()=>{
    if(isError){
      toastError(result.error.data.message);
    }
  },[isError]);

  return (
    <div className={css.wrapper}>
      <div className={css.shape1}></div>
      <div className={css.shape2}></div>
      <div className={css.shape3}></div>
      <header>
        <h3>Hello,</h3>
        <h4>Welcome Back</h4>
        <span>Signup and find best the ride for you</span>
      </header>
      <form onSubmit={formik.handleSubmit}>
        <div className={css.userProfile}>
          <div className={css.profile} onClick={() => imageRef.current.click()}>
            <input
              ref={imageRef}
              type="file"
              onChange={(e) => {
                formik.setFieldValue("profileImg",e.target.files[0]);
                openImage(e);
              }}
              style={{ display: "none" }}
              accept='image/*'
            />
            <img src={image ? image.image : avatar} alt="" />
          </div>
          <div className={css.icon}>
            {/* <bs.TbPencil /> */}
            <ai.AiOutlineCamera />
          </div>
          
        </div>
        {formik.touched.profileImg && formik.errors.profileImg ? (
            <div className={`${css.inputError} text-center mb-2`}>{formik.errors.profileImg}</div>
          ) : null}
        <div className={css.formGroup}>
          <label htmlFor='name'>Name</label>
          <input
            onChange={formik.handleChange}
            name="name"
            value={formik.values.name}
            type="text"
            className={formik.touched.email && formik.errors.email}
            placeholder="Enter your Name"
            autoComplete="off"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className={css.inputError}>{formik.errors.name}</div>
          ) : null}
        </div>
        <div className={css.formGroup}>
          <label htmlFor='email'>E-Mail</label>
          <input
            onChange={formik.handleChange}
            name="email"
            value={formik.values.email}
            type="email"
            placeholder="Enter Email address"
            autoComplete="off"
          />
           {formik.touched.email && formik.errors.email ? (
            <div className={css.inputError}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div className={css.formGroup}>
          <label htmlFor='city'>City</label>
          <input
            onChange={formik.handleChange}
            name="city"
            value={formik.values.city}
            type="text"
            placeholder="Enter your City"
            autoComplete="off"
          />
           {formik.touched.city && formik.errors.city ? (
            <div className={css.inputError}>{formik.errors.city}</div>
          ) : null}
        </div>

        <div className={css.selectGender}>
          <div
            className={css.box}
            style={gender === "male" ? { border: `2px solid #1563d9` } : {}}
            onClick={() => {
              setGender("male");
              formik.values.gender = "male";
            }}
          >
            <div className={css.img}>
              <img src={male} alt="" />
            </div>
            <span style={gender === "male" ? { color: "#1563d9" } : {}}>
              Male
            </span>
          </div>
          <div
            className={css.box}
            style={gender === "female" ? { border: `2px solid #1563d9` } : {}}
            onClick={() => {
              setGender("female");
              formik.values.gender = "female";
            }}
          >
            <div className={css.img}>
              <img src={female} alt="" />
            </div>
            <span style={gender === "female" ? { color: "#1563d9" } : {}}>
              Female
            </span>
          </div>
        </div>

        {/* <div className={css.terms}>
                <p>By Signing up you are agreeing to our <span>Terms & conditions</span> and <span>Privacy Policy</span></p>
            </div> */}
        <div className={css.formGroup}>
          <label htmlFor='isDriver' style={{ color: "#1563d9", fontWeight: "500" }}>
            Select Account Type
          </label>
          {formik.touched.isDriver && formik.errors.isDriver ? (
            <div className={css.inputError}>{formik.errors.isDriver}</div>
          ) : null}
          <div className={css.radioWrap}>
         
            <div className={css.radio}>
              <input
                onChange={formik.handleChange}
                type="radio"
                name="isDriver"
                value={true}
                required
              />
              <span>Driver</span>
            </div>
            <div className={css.radio}>
              <input
                onChange={formik.handleChange}
                type="radio"
                name="isDriver"
                value={false}
                required
              />
              <span>Passenger</span>
            </div>
          </div>
        </div>

        <button disabled={isLoading} type="submit" className={css.button}>{isLoading ? <Loader width={25} color="#fff" /> : 'Continue'}</button>
      </form>
    </div>
  );
};

export default UserInfo;
