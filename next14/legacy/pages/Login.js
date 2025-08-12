import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import {
  loginUsingPassword,
  loginUsingOtp,
  verifyOtpForLogin,
} from "../services/user.service"; // Assuming sendOtp is defined in your service
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../GlobalProvider";
import { Helmet } from "react-helmet";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { globalState, setGlobalState } = useGlobalState();

  const formik = useFormik({
    initialValues: {
      mobile: "",
      password: "",
    },
    validationSchema: Yup.object({
      mobile: Yup.string()
        .required("Mobile number is a required field")
        .matches(/^\d{10}$/, "Mobile number must be 10 digits"),
      password:
        !isOtpLogin && Yup.string().required("Password is a required field"),
    }),
    onSubmit: async (values) => {
      try {
        if (isOtpLogin) {
          try {
            let response = await verifyOtpForLogin({
              empPhone: values.mobile,
              otp: otp,
            });
            if (response.data.access_token) {
              localStorage.setItem("loggedUser", JSON.stringify(response.data));
              toast.success("User Logged in successfully");
              setGlobalState({ ...globalState, user: response.data });
              setTimeout(() => {
                switch (response?.data?.user?.type) {
                  case "person":
                    navigate("/my-profile");
                    break;
                  case "company":
                    navigate("/hra-dashboard");
                    break;
                  default:
                    navigate("/");
                    break;
                }
              }, 1000);
            } else {
              toast.error(response?.data?.error);
            }
          } catch (error) {
            toast.error("Internal Server Error");
          }
        } else {
          let response = await loginUsingPassword({
            empPhone: values.mobile,
            password: values.password,
          });

          if (response.data.access_token) {
            localStorage.setItem("loggedUser", JSON.stringify(response.data));
            toast.success("User Logged in successfully");
            setGlobalState({ ...globalState, user: response.data });
            setTimeout(() => {
              switch (response?.data?.user?.type) {
                case "person":
                  navigate("/my-profile");
                  break;
                case "company":
                  navigate("/hra-dashboard");
                  break;
                default:
                  navigate("/");
                  break;
              }
            }, 1000);
          } else {
            toast.error("Invalid Credentials");
          }
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    },
  });

  const handleSendOtp = async () => {
    if (!formik.values.mobile || formik.errors.mobile) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      let response = await loginUsingOtp({ empPhone: formik.values.mobile });
      if (response?.data?.msg == "Otp Sent Succefully.") {
        setIsOtpSent(true);
        setIsOtpLogin(true);
        toast.success("OTP sent successfully");
      } else if (response?.data?.error == "Mobile number is not registered !") {
        toast.error("Mobile number is not registered !");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  };

  return (
    <><Helmet>
    <title>Overseas Jobs Log In: Access Global Opportunities</title>
    <meta name="description" content="Unlock your potential with overseas job listings. Log in to explore diverse career options." />
    <meta name="keywords" content="overseas jobs login" />
  </Helmet>
  <div
      className="vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: "url(/images/logoBg.jpg)",
        backgroundSize: "cover", // Maintain aspect ratio
        backgroundPosition: "center", // Ensure it's centered
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="shadow-lg bg-light  p-5 ">
        <div
          className="d-flex justify-content-end"
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            position: "relative",
            top: "-30px",
            left: "20px",
          }}
        >
          <i className="fa fa-close text-danger  bg-light border p-1 rounded"></i>
        </div>
        <div className="text-center">
          <img
            src="https://backend.overseas.ai/frontend/logo/logo_en.gif"
            alt="Logo"
          />
        </div>
        <h5 className="text-center mt-3 mb-4">Welcome Back</h5>
        <form onSubmit={formik.handleSubmit}>
          <div>
            <label>Phone</label>
            <div className="d-flex mb-3 mt-1">
              <select
                className="customSelect text-secondary form-control"
                aria-label="Default select example"
                style={{
                  width: "20%",
                  borderRight: "none",
                  borderTopRightRadius: "0px",
                  borderBottomRightRadius: "0px",
                }}
              >
                <option value="">+91</option>
              </select>
              <input
                className="form-control "
                name="mobile"
                placeholder="Type your phone number"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.mobile}
                style={{
                  width: "80%",
                  borderTopLeftRadius: "0px",
                  borderBottomLeftRadius: "0px",
                }}
              />
            </div>
            {formik.touched.mobile && formik.errors.mobile ? (
              <div
                className="text-danger"
                style={{
                  fontSize: "12px",
                  marginTop: "-15px",
                  marginBottom: "10px",
                }}
              >
                {formik.errors.mobile}
              </div>
            ) : null}
          </div>
          {isOtpLogin ? (
            <div>
              <label>OTP</label>
              <input
                className="form-control mb-3 mt-1"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <div className="d-flex justify-content-between align-items-center">
                <label>Password</label>
                <i
                  onClick={() => setShowPassword(!showPassword)}
                  className={showPassword ? "fa fa-eye-slash" : " fa fa-eye"}
                  style={{ position: "relative", top: "3px" }}
                ></i>
              </div>

              <input
                className="form-control mb-3 mt-1"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Type your password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />

              {formik.touched.password && formik.errors.password ? (
                <div
                  className="text-danger"
                  style={{
                    fontSize: "12px",
                    marginTop: "-15px",
                    marginBottom: "10px",
                  }}
                >
                  {formik.errors.password}
                </div>
              ) : null}
            </div>
          )}
          {!isOtpSent ? (
            <p
              className="mt-2 text-primary"
              style={{ cursor: "pointer" }}
              onClick={handleSendOtp}
            >
              <b><u>Login Via OTP Verification</u></b>
            </p>
          ) : null}
          {isOtpSent ? (
            <p
              className="mt-2 badge bg-success "
              style={{ cursor: "pointer" }}
              onClick={handleSendOtp}
            >
              <b>Resend OTP</b>
            </p>
          ) : null}
          <button type="submit" className="btn btn-primary w-100 mt-3">
            {isOtpLogin ? "Verify OTP" : "Login"}
          </button>

          <p
            className="mt-5 mb-0 text-center"
            style={{ fontSize: "14px", fontWeight: "400" }}
          >
            Don't have any account ? <br />{" "}
            <Link to="/candidate-register">Create New</Link>
          </p>
        </form>
      </div>
      <ToastContainer />
    </div>
  </>
    
  );
}

export default Login;
