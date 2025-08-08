import React from "react";
import { useNavigate, useNavigation } from "react-router-dom";
import { applyJobApi } from "../services/job.service";
import { useGlobalState } from "../GlobalProvider";
import { ToastContainer, toast } from "react-toastify";
import {
  markCandidate,rejectUnmatchingCandidate
} from "../services/hra.service";
import "react-toastify/dist/ReactToastify.css";
function CandidateCard({ value, slider , jobId, showMarkBtn, jobPrimaryId, getRecommandedCandidate}) {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState();
  const handleMarkCandidate = async()=>{
    try {
      let response = await markCandidate(globalState?.user.access_token, jobPrimaryId , value?.personId);
      if(response?.data?.message=="Job matching candidate accepted successfully"){
        toast.success("Job matching candidate accepted successfully");
        getRecommandedCandidate(jobPrimaryId)
      }else{
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  }
  const handleNotIntrestedCandidate = async()=>{
    try {
      let response = await rejectUnmatchingCandidate(globalState?.user.access_token, jobPrimaryId , value?.personId);
      if(response?.data?.message=="Job unmatching candidate rejected successfully"){
        toast.success("Job unmatching candidate rejected successfully");
        getRecommandedCandidate(jobPrimaryId)
      }else{
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    }
  }
  return (
    <div className={(slider ? "col-lg-12" : "col-lg-6" ) + " col-12 p-0 p-md-2 "}>
      <div className="mx-2 my-2 card p-2 p-md-3 shadow">
        <div className="row">
          <div className="d-flex col-md-12 col-8 justify-content-between mb-md-2 my-auto">
            <div className="d-block d-md-flex justify-content-end w-100"></div>
          </div>
        </div>

        <div className="row d-flex justify-content-between align-items-center">
          <div className="col-lg-8 col-md-8 col-8">
            <h2 style={{ fontSize: "22px" }}>
              <i className="fa fa-user"></i> {value?.empName}
            </h2>
            <h6 className="mb-2 text-sm badge bg-light text-dark">
              <i className="fa fa-id-card"></i>
              <span className="ms-1">{value?.fid}</span>
            </h6>
            <p style={{ fontSize: "18px" }} className="my-1">
              Age : {value?.age}
            </p>
            <p style={{ fontSize: "18px" }} className="my-1">
              District : {value?.empDistrict}
            </p>
            <p style={{ fontSize: "18px" }} className="my-1">
              State : {value?.empState}
            </p>
            {value.videoUrl && (
              <a
                href={value.videoUrl}
                style={{ textDecoration: "none" }}
                target="blank"
                className="border textBlue rounded px-2"
              >
                <i className="fa fa-play"></i> Play
              </a>
            )}
          </div>
          <div className="  col-md-4 col-4">
            <img
              className="img-fluid rounded"
              src={value?.empPhoto}
              alt="Job Image"
            />
          </div>
        </div>
        
        <div className="d-flex justify-content-between align-items-center">
          {value?.appliedOn && <h6 className="mb-0 mt-4 ">
            Applied On :{" "}
            <span className=" badge bg-secondary">{value?.appliedOn}</span>
          </h6>}
          
          <h6
            className="mb-0 mt-4 "
            onClick={() =>
              navigate(
                `/job/job-country/job-department/${value?.JobPrimaryId}`
              )
            }
          >
            Job Id : <span className=" badge bg-primary">{ jobId ? jobId : value?.jobId}</span>
          </h6>
        </div>
        {showMarkBtn && <div className="d-flex mt-3">
          {value?.markedDetails?.status==1 ? <button className="btn btn-sm btn-success disabled me-2" >Marked</button>:<button className="btn btn-sm btn-outline-success me-2" onClick={()=>handleMarkCandidate()}>Mark</button>}
          {value?.markedDetails?.status!=1 && <button className="btn btn-sm btn-danger" onClick={()=>handleNotIntrestedCandidate()}>Not Intrested</button>}
        </div>}
        
      </div>
      <ToastContainer />
    </div>
  );
}

export default CandidateCard;
