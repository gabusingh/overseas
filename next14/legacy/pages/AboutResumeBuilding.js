import React from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
function AboutResumeBuilding() {
    const navigate = useNavigate()
  return (
    <>
    <Helmet>
    <title>Overseas Jobs Resume: Building for Your Dream Career</title>
    <meta
      name="description"
      content="Transform your resume for overseas job applications . Increase your visibility to employers and take the next step in your global career."
    />
    <meta name="keywords" content="resume format for overseas job" />
  </Helmet>
  <div className="mt-5 py-5">
      <div className="mt-5 py-5 container">
        <div className="row mx-3 mb-5 my-3">
          <div className="col-md-6 col-12 my-auto order-md-1 order-2">
            <div className="py-5">
              <h2 className="textBlue">RESUME BUILDER</h2>
              <h1 className="heading ">Get your customised resume builder</h1>
              <p>With Overseas resume builder</p>
              <button className="btn btn-primary" onClick={()=>navigate("/resume-building")}>Create Now</button>
            </div>
          </div>
          <div className="col-md-6 col-12 my-auto order-md-1  d-flex justify-content-center">
            <img
              className="img-fluid"
              src="https://cdn-icons-png.flaticon.com/256/14477/14477419.png"
              style={{ height: "350px" }}
              alt="Image"
            />
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
}

export default AboutResumeBuilding;
