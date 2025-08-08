import React from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { applyJobApi } from "../services/job.service";
import { useGlobalState } from "../GlobalProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function HraJobCard({ value, slider }) {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  return (
    <div className={(slider ? "col-lg-12" : "col-lg-6" ) + " col-12 p-0 p-md-2 "}>
      <div className="mx-2 my-3 card p-2 p-md-3 shadow">
        {value?.interviewPlaceNotification && <div style={{fontSize:"22px"}} className="d-flex justify-content-end"><i className="fa fa-bell-o text-danger"></i></div>}
        
        <h2 style={{fontSize:"22px"}}>{value?.jobTitle} </h2>
        <div className="row">
          <div className="d-flex col-md-12 col-8 justify-content-between mb-md-2 my-auto">
            <div className="d-block d-md-flex justify-content-between w-100">
            {value?.givenCurrencyValue ? (
                <p className="mb-0 text-sm">
                  {value?.jobWages} {value?.jobWagesCurrencyType} ={" "}
                  {Math.round(value?.jobWages * value?.givenCurrencyValue)} INR
                </p>
              ) : (
                <p className="mb-0 text-sm">
                  {value?.jobWages} {value?.jobWagesCurrencyType}
                </p>
              )}
              <p className="mb-0 text-sm">
                <small class=" text-success">
                  Job Posted On : {value?.created_at}
                </small>
              </p>
            </div>
          </div>
          <div className="d-md-none d-block  col-4">
            <img
              className="img-fluid rounded"
              src={value?.jobPhoto}
              alt="Job Image"
            />
          </div>
        </div>

        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-lg-8 col-md-8 col-9">
            <div className="d-flex align-items-center mb-2">
              <img
                className="flagIcon"
                src={
                  "https://backend.overseas.ai/storage/uploads/countryFlag/" +
                  value?.jobLocationCountry?.countryFlag
                }
                alt="Flag Image"
              />
              <p className="mb-0 ms-2">{value?.jobLocationCountry?.name}</p>
            </div>
            <p className="my-1">Department : {value?.occupation}</p>
            <p className="my-1">Age Limit : {value?.jobAgeLimit}</p>
            <p className="my-1">Passport Type : {value?.passportType}</p>
            <p className="my-1">Experience Type : {value?.jobExpTypeReq}</p>
          </div>
          <div className="d-md-block d-none  col-md-4">
            <img
              className="img-fluid rounded"
              src={value?.jobPhoto}
              alt="Job Image"
              // src="https://overseasdata.s3.ap-south-1.amazonaws.com/JobData/3/JOB030538.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240508%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240508T122934Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=2c3b3cf4f0c4b096dc4a451a7e23d8b82929f50b99d67792465dcc8dc51ce572"
            />
          </div>
        </div>
        {value?.totalAppliedCandidates >0 ?<p><a href="#">{value?.totalAppliedCandidates} Candidates Applied in this Job</a></p>: <p>{value?.totalAppliedCandidates} Candidates Applied in this Job</p>}
        <p className="text-danger">Job Deadline - {value?.jobDeadline}</p>
        <div className="d-flex justify-content-between align-items-center">
          <div>
          <button className="btn btn-primary bgBlue m-1 btn-sm" onClick={()=>navigate(`/edit-jobs/${value.id}`)}>
            Update
          </button>
          <button className="btn btn-primary bgBlue m-1 btn-sm ms-2">
            Applied Candidates
          </button>
          <button className="btn btn-primary bgBlue m-1 btn-sm ms-2" onClick={()=>navigate("/recommanded-candidates/"+value?.id)}>
            Get Recommendations
          </button>
          </div>
          <p className="mb-0 mt-4 text-primary" style={{ cursor: "pointer" }} onClick={() =>
        navigate(
          `/job/${value?.jobLocationCountry?.name
            ?.trim()
            .replace(/\s+/g, "-")
            .replace(/\//g, "-")}/${value?.jobTitle
            ?.trim()
            .replace(/\s+/g, "-")
            .replace(/\//g, "-")}/${value?.id}`
        )
      }>
            Read Details
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default HraJobCard;
