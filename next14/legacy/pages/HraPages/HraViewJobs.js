import React, { useEffect, useState } from "react";
import BreadCrumb from "../../components/BreadCrumb";
import { hraPostedJobs } from "../../services/hra.service";
import { useGlobalState } from "../../GlobalProvider";
import JobCard from "../../components/JobCard";
import HraJobCard from "../../components/HraJobCard";
import { useNavigate } from "react-router-dom";
function HraViewJobs() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate()
  const [loader, setLoader]=useState()
  const [jobList, setJobList]=useState([]);
  const getJobsPostedByHra = async () => {
    setLoader(true)
    try {
      let response = await hraPostedJobs(globalState?.user.access_token, {});
      setJobList(response.data?.data.jobs)
      setLoader(false)
    } catch (error) {}
  };
  useEffect((v, i)=>{
    getJobsPostedByHra()
  },[])
  return (
    <div className="mt-5 pt-md-5">
      <div className="mt-5  container">
      <div className="d-flex mt-5 pt-md-5" style={{ cursor: "pointer" }}>
      <div className="d-flex align-items-center justify-content-start  borderBlue">
        <div
          className="p-2 px-md-4 px-3"
          onClick={() => {
            navigate("/");
          }}
        >
          <i className="fa textBlue fa-home"></i>
        </div>

        <div
          className="p-2 px-md-4 px-3 borderLeft"
          onClick={() => {
            navigate("/hra-dashboard");
          }}
        >
          <i className="fa textBlue fa fa-suitcase me-2"></i>
          <span className="textBlue">Dashboard</span>
        </div>
        <div className="p-2 bgBlue px-md-4 px-3 borderRadiusLeft20">
          <i className="fa fa-suitcase text-light me-2"></i>
          <span className="text-light">My Posted Jobs</span>
        </div>
      </div>
    </div>
    {loader ? <div className="vh-100 row col-12 justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div> : <div className="row">
            <div className="row">
            {jobList?.map((v, i)=>{
                return(
                    <HraJobCard value={v}/>
                )
            })}
            </div>
        </div>}
        
      </div>
    </div>
  );
}

export default HraViewJobs;
