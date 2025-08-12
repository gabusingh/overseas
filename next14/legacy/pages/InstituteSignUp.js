
import React from "react";
import Statics from "../components/Statics";
import SelectUserType from "../components/SelectUserType";

function InstituteSignUp() {
  return (
    <div
      className=""
      style={{
        background:
          "url(https://www.bacancytechnology.com/main/img/job-recruitment-portal-development/banner.jpg?v-1)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="mt-5 pt-md-5 pt-2 container selectRegisterForm">
        <div className="row mt-5 py-5 justify-content-center">
          <SelectUserType/>
          <div className="col-md-6 col-12 my-auto order-md-1 ">
            <div className="shadow-lg rounded bg-light p-md-4 p-3 m-md-3 m-0">
              <h3 className="mb-4">
                <i className="fa fa-user me-2"></i>Employer Register
              </h3>
              <label>Full Name</label>
              <input className="form-control" />
              <br />
              <label>Phone Number</label>
              <div className="d-flex">
                <input className="form-control" style={{ width: "17%" }} />
                <input className="form-control" style={{ width: "83%" }} />
              </div>
              <br />
              <label>Full Name</label>
              <input className="form-control" />
              <br />
              <label>Full Name</label>
              <input className="form-control" />
              <br />
              <button className="btn btn-success w-100">Sign Up</button>
            </div>
          </div>
        </div>
        <div className="pb-5">
        <Statics/>
        </div>
      </div>
    </div>
  );
}

export default InstituteSignUp;
