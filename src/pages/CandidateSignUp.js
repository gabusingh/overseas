import React, { useState, useEffect } from "react";
import Statics from "../components/Statics";
import { getCountryCode } from "../services/info.service";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signUp } from "../services/user.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";
function CandidateSignUp() {
  const [countryCodeArr, setCountryCodeArr] = useState([]);
  const [showEmail, setShowEmail] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const getListOfCountryCode = async () => {
      try {
        let response = await getCountryCode();
        setCountryCodeArr(response?.data?.countryCodes);
      } catch (error) {
        console.log(error);
      }
    };
    getListOfCountryCode();
  }, []);

  const validationSchema = Yup.object({
    empName: Yup.string().required("Full Name is required"),
    empPhone: Yup.string().required("Phone Number is required"),
    empEmail: Yup.string(),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValues = {
    empName: "",
    empPhone: "",
    countryCode: "+91",
    empEmail: "",
    password: "",
    confirmPassword: "",
  };
  const onSubmit = async (values) => {
    if (values.countryCode !== "+91" && !values.empEmail) {
      toast.error("Email is required when your country code is not +91");
    } else {
      try {
        const response = await signUp(values);
        console.log(response);
        if (response.data.msg == "Otp Sent Successfully.") {
          toast.success("Otp Sent Successfully.");
          localStorage.setItem("tempUser", JSON.stringify(values));
          setTimeout(() => {
            navigate("/otp-verification");
          }, 1500);
        } else {
          toast.warning("User already registered.");
        }
      } catch (error) {
        toast.error("Internal server error");
      }
    }
  };
  const handleChange = (event, setFieldValue) => {
    const selectedValue = event.target.value;
    setFieldValue("countryCode", selectedValue);
    setShowEmail(selectedValue !== "+91");
  };
  return (
    <div
      style={{
        background:
          "url(https://www.bacancytechnology.com/main/img/job-recruitment-portal-development/banner.jpg?v-1)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mt-md-5 pt-md-5"></div>
      <div className="mt-5 pt-md-5 pt-2 container selectRegisterForm">
        <div className="row mt-5 py-5 justify-content-center">
          <div className="col-6 my-auto text-center d-none d-md-block">
            <img
              src="https://cdn-icons-png.flaticon.com/256/8662/8662443.png"
              className="img-fluid "
              style={{ height: "300px" }}
              alt="Image"
            />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ setFieldValue }) => (
              <div className="col-md-6 col-12 my-auto order-md-1">
                <Form>
                  <div className="shadow-lg rounded bg-light p-md-4 p-3 m-md-3 m-0">
                    <h3 className="mb-4">
                      <i className="fa fa-user me-2"></i>Candidate Register
                    </h3>
                    <label>Full Name</label>
                    <Field name="empName" className="form-control" />
                    <ErrorMessage
                      name="empName"
                      component="div"
                      className="text-danger"
                    />
                    <br />

                    <label>Phone Number</label>
                    <div className="d-flex">
                      <Field
                        as="select"
                        name="countryCode"
                        className="form-control"
                        style={{ width: "17%" }}
                        onChange={(e) => {
                          handleChange(e, setFieldValue);
                        }}
                      >
                        <option value="+91">+91 India</option>
                        {countryCodeArr.map((v, i) => (
                          <option
                            key={i}
                            value={`+${v.countryCode}`}
                          >{`+${v.countryCode} ${v.name}`}</option>
                        ))}
                      </Field>
                      <Field
                        name="empPhone"
                        className="form-control"
                        style={{ width: "83%" }}
                      />
                    </div>
                    <ErrorMessage
                      name="empPhone"
                      component="div"
                      className="text-danger"
                    />
                    <br />
                    {showEmail && (
                      <>
                        <label>Email</label>
                        <Field name="empEmail" className="form-control" />
                        <ErrorMessage
                          name="empEmail"
                          component="div"
                          className="text-danger"
                        />
                        <br />
                      </>
                    )}
                    <label>Password</label>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                    <br />
                    <label>Confirm Password</label>
                    <Field
                      name="confirmPassword"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-danger"
                    />
                    <br />
                    <button type="submit" className="btn btn-success w-100">
                      Sign Up
                    </button>
                    <p
                      className="mt-4 mb-0 text-center"
                      style={{ fontSize: "14px", fontWeight: "400" }}
                    >
                      Already have an account ? <Link to="/login">Login</Link>
                    </p>
                  </div>
                </Form>
              </div>
            )}
          </Formik>
        </div>
        <div className="py-5 d-none d-md-block mt-5">
          <Statics />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default CandidateSignUp;
