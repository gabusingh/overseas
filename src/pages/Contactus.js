import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {submitContactQuery} from "../services/user.service"
import { ToastContainer, toast } from "react-toastify";
function Contactus() {
  const navigate = useNavigate();

  // Define the validation schema using Yup
  const validationSchema = Yup.object({
    full_name: Yup.string().required("Name is required"),
    contact_number: Yup.string()
      .matches(/^[0-9]{10}$/, "Must be a 10-digit phone number")
      .required("Phone number is required"),
    subject: Yup.string().required("Subject is required"),
    concern: Yup.string().required("Message is required"),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      full_name: "",
      contact_number: "",
      subject: "",
      concern: "",
    },
    validationSchema: validationSchema,
    onSubmit: async(values, { resetForm }) => {
      try {
        let response = await submitContactQuery(values);
        if(response.data.msg=="Query submitted successfully"){
          toast.success(response.data.msg);
          resetForm(); // Clear the form
        }else{
          toast.success("Something went wrong");
        }
      } catch (error) {
        toast.success("Internal Server Error");
      }
    },
  });

  return (
    <div className="container contactUsHeight mt-md-5 d-flex align-items-center">
      <div className="row mx-0  mt-5 pt-3 pt-md-5">
        <div className="col-md-6 col-12 order-lg-2 order-1">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230.2354758400895!2d88.40076123612282!3d22.587793268138633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0276754e7c9489%3A0x66ada39be5c2da58!2sCA-191%2C%20CA%20Block%2C%20Sector%201%2C%20Bidhannagar%2C%20Kolkata%2C%20West%20Bengal%20700136!5e0!3m2!1sen!2sin!4v1667212481498!5m2!1sen!2sin"
            width="100%"
            height={"100%"}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
        <div className="col-md-6 col-12 order-lg-1 order-2">
          <div>
            <h4 className="text-center textBlue mt-lg-5 mt-4 mt-md-0">
              Contact Us
            </h4>
            <form onSubmit={formik.handleSubmit}>
              <div className="row mt-3 me-md-2 me-0">
                <div className="col-md-6 p-0 pe-1 me-0 col-12">
                  <input
                    className={`form-control py-2 mx-2 my-2 width95 ${
                      formik.touched.full_name && formik.errors.full_name
                        ? "is-invalid"
                        : ""
                    }`}
                    name="full_name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Name*"
                    style={{ borderRadius: "0px" }}
                  />
                  {formik.touched.full_name && formik.errors.full_name ? (
                    <div className="invalid-feedback">
                      {formik.errors.full_name}
                    </div>
                  ) : null}
                </div>
                <div className="col-md-6 p-0 ps-1 m-0  col-12">
                  <input
                    className={`form-control p-2 mx-2 my-2 width95 ${
                      formik.touched.contact_number &&
                      formik.errors.contact_number
                        ? "is-invalid"
                        : ""
                    }`}
                    name="contact_number"
                    type="text"
                    value={formik.values.contact_number}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Phone No.*"
                    style={{ borderRadius: "0px" }}
                  />
                  {formik.touched.contact_number &&
                  formik.errors.contact_number ? (
                    <div className="invalid-feedback">
                      {formik.errors.contact_number}
                    </div>
                  ) : null}
                </div>
                <div className="p-0 m-0 col-12">
                  <input
                    className={`form-control py-2 mx-2 my-2 width95 ${
                      formik.touched.subject && formik.errors.subject
                        ? "is-invalid"
                        : ""
                    }`}
                    name="subject"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Subject*"
                    style={{ borderRadius: "0px" }}
                  />
                  {formik.touched.subject && formik.errors.subject ? (
                    <div className="invalid-feedback">
                      {formik.errors.subject}
                    </div>
                  ) : null}
                </div>
                <div className="p-0 m-0 col-12">
                  <textarea
                    className={`form-control py-2 mx-2 my-2 width95 ${
                      formik.touched.concern && formik.errors.concern
                        ? "is-invalid"
                        : ""
                    }`}
                    name="concern"
                    value={formik.values.concern}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows={5}
                    placeholder="Message*"
                    style={{ borderRadius: "0px" }}
                  />
                  {formik.touched.concern && formik.errors.concern ? (
                    <div className="invalid-feedback">
                      {formik.errors.concern}
                    </div>
                  ) : null}
                </div>
                <div className="col-12 m-0 d-flex justify-content-center justify-content-lg-end p-0">
                  <button
                    className="btn shadow mt-lg-3 mt-2 mb-md-5 mb-2 me-lg-2 w-100 mx-2 btn-primary bgBlue"
                    style={{
                      borderRadius: "25px",
                      outline: "none",
                      border: "none",
                    }}
                    type="submit"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="col-12 row p-0 ms-1 ms-md-0 order-3 mt-md-5 mt-0">
          <div className="col-md-6 col-lg-3 col-12">
            <div className="bg-light my-3 px-4 py-2 rounded shadow border">
              <h2 className="textBlue">
                <i className="fa fa-map-marker"></i>
              </h2>
              <h5 className="fontMono">
                <b>Address</b>
              </h5>
              <p>
                <i className="fa fa-address-card me-2"></i> CA 191, CA Block,
                Sector 1, Saltlake, Kolkata,
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 col-12">
            <div className="bg-light my-3 px-4 py-2 rounded shadow border">
              <h2 className="textBlue">
                <i className="fa fa-phone"></i>
              </h2>
              <h5 className="fontMono">
                <b>Call Us</b>
              </h5>
              <p>
                <a
                  className="text-dark text-decoration-none"
                  href="tel:1800 890 4788"
                >
                  <i className="fa fa-phone me-2"></i> 1800 890 4788
                </a>
                <br />
                <a
                  className="text-dark text-decoration-none"
                  href="https://wa.me/9907591478"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa me-2 fa-whatsapp"></i>+91 9907591478
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 col-12">
            <div
              className="bg-light px-4 my-3 rounded shadow border"
              style={{ padding: "11px" }}
            >
              <h2 className="textBlue">
                <i className="fa fa-envelope"></i>
              </h2>
              <h5 className="fontMono">
                <b>Email Us</b>
              </h5>
              <p style={{ fontSize: "14px" }}>
                <a
                  className="text-dark text-decoration-none"
                  href="mailto:contact@overseas.ai"
                >
                  <i className="fa fa-envelope me-2"></i>contact@overseas.ai
                </a>
              </p>
            </div>
          </div>
          <div className="col-md-6 col-lg-3 col-12">
            <div className="bg-light px-4 my-3 rounded shadow border">
              <h2 className="textBlue">
                <i className="fa fa-globe"></i>
              </h2>
              <h5 className="fontMono">
                <b>Website</b>
              </h5>
              <p>
                <a
                  className="text-dark text-decoration-none"
                  href="https://overseas.ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fa fa-globe me-2"></i>www.overseas.ai
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Contactus;
