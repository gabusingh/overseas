import React, { useState } from "react";
import OtpInput from "react-otp-input";
import { verifyOtpForSignUp, signUp } from "../services/user.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

function OtpVerification() {
  const [otp, setOtp] = useState("");
  
  const navigate = useNavigate()
  const handleChange = async (otp) => {
    setOtp(otp);
    if (otp.length == 6) {
      try {
        let tempUser = JSON.parse(localStorage.getItem("tempUser"));
        let response = await verifyOtpForSignUp({
          ...tempUser,
          otp,
          regProtocol: "Web",
        });
        if (response.data.access_token) {
          toast.success("Otp Verified Successfully");
          localStorage.setItem("semiUser", JSON.stringify(response.data));
          localStorage.removeItem("tempUser");
          
          setTimeout(()=>{
              navigate("/candidate-register-step2")
          }, 1500)
        } else {
          toast.error("Wrong OTP");
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    }
  };
  const resendOtp = async ()=>{
    try {
        let tempUser = JSON.parse(localStorage.getItem("tempUser"));
        const response = await signUp(tempUser);
        if (response.data.msg == "Otp Sent Successfully.") {
          toast.success("Otp Sent Successfully.")
          
        } else {
          toast.warning("User already registered.");
        }
      } catch (error) {
        toast.error("Internal server error");
      }
  }
  return (
    <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background:
          "url(https://www.bacancytechnology.com/main/img/job-recruitment-portal-development/banner.jpg?v-1)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="shadow-lg bg-light  rounded p-5 ">
        <h5 className="mb-3 text-center">Enter OTP</h5>
        <p className="mt-3 text-secondary text-center">
          OTP has been sent to your phone number
        </p>
        <div className=" d-flex justify-content-center">
          <OtpInput
            value={otp}
            onChange={handleChange}
            numInputs={6}
            renderSeparator={<span className="mx-1"></span>}
            renderInput={(props) => (
              <input
                {...props}
                style={{ height: "40px", width: "40px" }}
                className=" text-dark form-control text-center  shadow-sm"
              />
            )}
          />
        </div>
        <p
          className="mt-4 mb-0 text-center"
          style={{ fontSize: "14px", fontWeight: "400" }}
        >
          Don't get OTP ?{" "}
          <a style={{cursor:"pointer"}} onClick={()=>resendOtp()} className="ms-2">
            Resend OTP
          </a>
        </p>
      </div>
      <ToastContainer />
    </div>
  );
}

export default OtpVerification;
