import React, { useEffect, useRef, useState } from "react";
import css from "./RegisterDriver.module.scss";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import * as bs from "react-icons/bs";
import * as md from "react-icons/md";
import * as ai from "react-icons/ai";
import * as io from "react-icons/io5";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRegisterDriverMutation } from "../../services/api/userApi";
import { useNavigate } from "react-router-dom";
import { toastError } from "../Toast/Toast";
import Loader from "../Loader/Loader";

const RegisterDriver = () => {
  const [activeStep, setActiveStep] = useState(0);
  const cnicFrontRef = useRef();
  const cnicBackRef = useRef();
  const vehicleImg = useRef();
  const liscenseImg = useRef();
  const vehicleRegistrationImg = useRef();
  const [basicData, setBasicData] = useState({
    fatherName: "",
    birthDate: "",
    cnic: "",
    residentialAddress: "",
    cnicImgFront: "",
    cnicImgBack: "",
  });

  const [vehicleData, setVehicleData] = useState({
    vehicleType: "",
    vehicleBrand: "",
    vehicleNumber: "",
    vehicleImage: "",
    vehicleRegisterCertificate: "",
  });

  const [liscenseData, setLiscenseData] = useState({
    liscenseNumber: "",
    liscenseExpiryDate: "",
    liscenseImage: "",
  })

  const [registerDriver, result] = useRegisterDriverMutation();
  const {isLoading,isSuccess,isError,error} = result;
  const navigate = useNavigate();

  console.log('Error',error);
  console.log('Result',result);

  if(isSuccess){
    navigate('/home');
  }

  useEffect(()=>{
    if(isError){
      toastError(result?.error?.data?.message);
    }
  },[isError]);

  const basicDetailSchema = Yup.object({
    fatherName: Yup.string().required("Father Name is Required"),
    cnic: Yup.string().required("Cnic is Required"),
    birthDate: Yup.string().required("Please Select Birth Date"),
    residentialAddress: Yup.string().required("Address is Required"),
    cnicImgFront: Yup.mixed().nullable().required("Select Cnic Front Image"),
    cnicImgBack: Yup.mixed().nullable().required("Select Cnic Back Image"),
  });

  const vehicleDetailsSchema = Yup.object({
    vehicleType: Yup.string().required("Vehicle Type is Required"),
    vehicleBrand: Yup.string().required("Vehicle Brand is Required"),
    vehicleNumber: Yup.string().required("Vehicle Number is Required"),
    vehicleImage: Yup.mixed().nullable().required("Please Select Vehicle Image"),
    vehicleRegisterCertificate: Yup.mixed().nullable().required("Please Select Vehicle Register Certificate Image"),
  });

  const liscenseDetailSchema = Yup.object({
    liscenseNumber: Yup.string().required("Liscense is Required"),
    liscenseExpiryDate: Yup.string().required("Liscense Expiry Date is Required"),
    liscenseImage: Yup.mixed().nullable().required("Please Select Liscense Image")
  });

  const postDriverData = async()=>{
    let formData = new FormData();
    const userId = localStorage.getItem('userId');
    formData.append("userId", userId);
    formData.append("fatherName", basicData.fatherName);
    formData.append("birthDate", basicData.birthDate);
    formData.append("cnic", basicData.cnic);
    formData.append("residentialAddress", basicData.residentialAddress);
    formData.append("cnicfront", basicData.cnicImgFront);
    formData.append("cnicback", basicData.cnicImgBack);
    formData.append("vehicleType", vehicleData.vehicleType);
    formData.append("vehicleBrand", vehicleData.vehicleBrand);
    formData.append("vehicleNumber", vehicleData.vehicleNumber);
    formData.append("vehicles", vehicleData.vehicleImage);
    formData.append("vehicleCertificate", vehicleData.vehicleRegisterCertificate);
    formData.append("liscenseNumber", liscenseData.liscenseNumber);
    formData.append("liscenseExpiryDate", liscenseData.liscenseExpiryDate);
    formData.append("liscenseimage", liscenseData.liscenseImage);
    formData.append("totalReviewsGiven", 1);
    formData.append("totalRating", 5);

    await registerDriver(formData);
  }

  const handleNext1 = (newData) => {
    if (activeStep === 2) {
      setActiveStep(2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    // setData((prev) => ({ ...prev, ...newData}));
    setBasicData((prev) => ({ ...prev, ...newData}));
  };

  const handleNext2 = (newData) => {
    if (activeStep === 2) {
      setActiveStep(2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    // setData((prev) => ({ ...prev, ...newData}));
    setVehicleData((prev) => ({ ...prev, ...newData}));
  };

  const handleNext3 = (newData) => {
    if (activeStep === 2) {
      setActiveStep(2);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
    setLiscenseData((prev) => ({ ...prev, ...newData}));
    postDriverData();
  };

  const handleBack = (newData) => {
    if (activeStep === 0) {
      setActiveStep(0);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
    // setData((prev) => ({ ...prev, ...newData }));
  };

  const handleSubmit1 = (values) => {
    console.log(values);
    handleNext1(values)
  };

  const handleSubmit2 = (values) => {
    console.log(values);
    handleNext2(values)
  };

  const handleSubmit3 = (values) => {
    console.log(values);
    handleNext3(values)
  };

  return (
    <div className={css.wrapper}>
      <div className={css.shape1}></div>
      <div className={css.shape2}></div>
      <div className={css.shape3}></div>
      <div className={css.container}>
        <div className={css.topHeader}>
          <md.MdOutlineArrowBackIos onClick={handleBack} />
          <span onClick={handleBack}>Back</span>
        </div>
        <header>
          <h3>
            Set up your <p style={{ margin: "0", color: "#3784FB" }}>profile</p>{" "}
            <img
              src="https://img.icons8.com/color/48/null/hand-with-pen.png"
              alt="handwite"
            />
          </h3>
          <span>
            Create an account so you can manage your rides even faster
          </span>
        </header>

        <div className={css.stepperWrapper}>
          <Stepper activeStep={activeStep}>
            <Step>
              <StepLabel>
                Basic <span className={css.sec_text}>Details </span>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                Vehicle <span className={css.sec_text}>Details</span>
              </StepLabel>
            </Step>
            <Step>
              <StepLabel>
                Liscense <span className={css.sec_text}>Details </span>
              </StepLabel>
            </Step>
          </Stepper>
        </div>

        <div className={`${css.stepForm} border pt-2`}>
          <Formik initialValues={basicData} onSubmit={(values)=>handleSubmit1(values,false)} validationSchema={basicDetailSchema}>
            {(formik) => (
              <Form className="mt-4">
                {activeStep === 0 && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className={css.formGroup}>
                          <label>Father Name</label>
                          <Field
                            name="fatherName"
                            type="text"
                            placeholder="Enter Father Name"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="fatherName" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className={css.formGroup}>
                          <label>CNIC</label>
                          <Field
                            type="text"
                            name="cnic"
                            maxLength={13}
                            onInput={(e) => {
                              e.target.value = e.target.value.replace(
                                /[^0-9]/g,
                                ""
                              );
                            }}
                            placeholder="Enter Cnic"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="cnic" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className={css.formGroup}>
                          <label>Birth Date</label>
                          <Field
                            name="birthDate"
                            className="pr-5"
                            type="date"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="birthDate" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className={css.formGroup}>
                          <label>Address</label>
                          <Field
                            name="residentialAddress"
                            type="text"
                            placeholder="Residential Address"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="residentialAddress" />
                        </div>
                      </div>
                    </div>

                    <h4 className="h4">CNIC Proof</h4>
                    <div className={css.cnicRow}>
                      <div
                        className={`${css.cnicImg} shadow-sm border`}
                        onClick={() => cnicFrontRef.current.click()}
                      >
                        <bs.BsCamera />
                        <span>Front</span>
                        <input
                          ref={cnicFrontRef}
                          type="file"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "cnicImgFront",
                              e.target.files[0]
                            );
                          }}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                        <ErrorMessage component="span" className={css.errorMsg} name="cnicImgFront" />
                      </div>
                      <div
                        className={`${css.cnicImg} shadow-sm border`}
                        onClick={() => cnicBackRef.current.click()}
                      >
                        <bs.BsCamera />
                        <span>Back</span>
                        <input
                          ref={cnicBackRef}
                          type="file"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "cnicImgBack",
                              e.target.files[0]
                            );
                          }}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                        <ErrorMessage component="span" className={css.errorMsg} name="cnicImgBack" />
                      </div>
                    </div>

                    <div className={css.buttonWrap}>
                      <button
                        disabled={activeStep === 0 ? true : false}
                        onClick={handleBack}
                        type="button"
                        className={css.button}
                      >
                        Back
                      </button>
                      <button type="submit" className={css.button}>
                        Next
                      </button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>

          <Formik initialValues={vehicleData} onSubmit={(values)=>handleSubmit2(values,false)} validationSchema={vehicleDetailsSchema}>
            {(formik) => (
              <Form className="mt-4">
                {activeStep === 1 && (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <div className={css.formGroup}>
                          <label>Vehicle Type</label>
                          <Field name="vehicleType" component="select">
                            <option value="car">Car</option>
                            <option value="bike">Bike</option>
                          </Field>
                          <ErrorMessage component="span" className={css.errorMsg} name="vehicleType" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className={css.formGroup}>
                          <label>Brand</label>
                          <Field
                            type="text"
                            name="vehicleBrand"
                            placeholder="Enter Brand"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="vehicleBrand" />
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12">
                        <div className={css.formGroup}>
                          <label>Number</label>
                          <Field
                            type="text"
                            name="vehicleNumber"
                            placeholder="Vehicle Number"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="vehicleNumber" />
                        </div>
                      </div>
                    </div>

                    <h4 className="h4">Vehicle Images</h4>
                    <div className={css.cnicRow}>
                      <div
                        title="Select Vehicle Image"
                        style={{ height: "115px" }}
                        className={`${css.cnicImg} shadow-sm border`}
                        onClick={() => vehicleImg.current.click()}
                      >
                        <bs.BsCarFront />
                        <span>Vehicle</span>
                        <input
                          ref={vehicleImg}
                          type="file"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "vehicleImage",
                              e.target.files[0]
                            );
                          }}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      </div>
                      <ErrorMessage component="span" className={css.errorMsg} name="vehicleImage" />
                      
                      <div
                        title="Select Vehicle Registration Certificate Image"
                        style={{ height: "115px" }}
                        className={`${css.cnicImg} shadow-sm border`}
                        onClick={() => vehicleRegistrationImg.current.click()}
                      >
                        <io.IoNewspaperOutline />
                        <span>Certificate</span>
                        <input
                          ref={vehicleRegistrationImg}
                          type="file"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "vehicleRegisterCertificate",
                              e.target.files[0]
                            );
                          }}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      </div>
                      <ErrorMessage component="span" className={css.errorMsg} name="vehicleRegisterCertificate" />
                    </div>

                    <div className={css.buttonWrap}>
                      <button
                        disabled={activeStep === 0 ? true : false}
                        onClick={handleBack}
                        type="button"
                        className={css.button}
                      >
                        Back
                      </button>
                      <button type="submit" className={css.button}>
                        Next
                      </button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>

          <Formik initialValues={liscenseData} onSubmit={(values)=>handleSubmit3(values,true)} validationSchema={liscenseDetailSchema}>
            {(formik) => (
              <Form className="mt-4">
                {activeStep === 2 && (
                  <>
                    <div className="row">
                      <div className="col-md-12">
                        <div className={css.formGroup}>
                          <label>Number</label>
                          <Field
                            type="text"
                            name="liscenseNumber"
                            placeholder="Liscense Number"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="liscenseNumber" />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-12">
                        <div className={css.formGroup}>
                          <label>Expiry Date</label>
                          <Field
                            type="date"
                            name="liscenseExpiryDate"
                            placeholder="Expiry Date"
                          />
                          <ErrorMessage component="span" className={css.errorMsg} name="liscenseExpiryDate" />
                        </div>
                      </div>
                    </div>

                    <h4 className="h4">Liscense Proof</h4>
                    <div
                      className={css.cnicRow}
                      style={{ justifyContent: "flex-start" }}
                    >
                      <div
                        title="Select Liscense Certificate Image"
                        style={{ height: "115px", flex: "0.5" }}
                        className={`${css.cnicImg} shadow-sm border`}
                        onClick={() => liscenseImg.current.click()}
                      >
                        <io.IoNewspaperOutline />
                        <span>Certificate</span>
                        <input
                          ref={liscenseImg}
                          type="file"
                          onChange={(e) => {
                            formik.setFieldValue(
                              "liscenseImage",
                              e.target.files[0]
                            );
                          }}
                          style={{ display: "none" }}
                          accept="image/*"
                        />
                      </div>
                      <ErrorMessage component="span" className={css.errorMsg} name="liscenseImage" />
                    </div>

                    <div className={css.buttonWrap}>
                      <button
                        disabled={activeStep === 0 ? true : false}
                        onClick={handleBack}
                        type="button"
                        className={css.button}
                      >
                        Back
                      </button>
                      <button type="submit" className={css.button}>
                        {activeStep === 2 ? "Finish" : isLoading ? <Loader width={25} /> : "Next"}
                      </button>
                    </div>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RegisterDriver;
