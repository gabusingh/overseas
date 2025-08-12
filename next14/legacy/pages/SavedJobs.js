import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import { savedJobList } from "../services/job.service";
import SearchComponent from "../components/SearchComponent";
import { useParams } from "react-router-dom";
import AppliedJobCard from "../components/AppliedJobCard";
import { useGlobalState } from "../GlobalProvider";
function SavedJobs() {
  const params = useParams();
  const { globalState, setGlobalState } = useGlobalState();
  const [jobArr, setJobArr] = useState([]);
  
  const [showLoader, setShowLoader] = useState(false);
 
  
  const getSavedJob = async () => {
    
    setShowLoader(true);
    try {
      let response = await savedJobList(globalState?.user?.access_token);
      setJobArr(response?.data?.jobs);
      
      
      setShowLoader(false);
    } catch (error) {}
  };
  const [pageNo, setPageNo] = useState(1);
  useEffect(() => {
    getSavedJob();
  }, []);
  
  

  return (
    <div className="container mt-5 pt-5">
      <div className="mt-5 pt-5 mx-0">
        <div className="row">
          {showLoader ? (
            <div className="vh-100 row col-6 justify-content-center align-items-center">
              <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row ">
              <h5
          className="text-center my-md-5  pb-3 textBlue"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
        >
         SAVED JOBS 
        </h5>
              {jobArr?.map((v, i) => {
                return (
                  <div className="col-md-6 col-12">
                    <JobCard value={v} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        
      </div>
    </div>
  );
}

export default SavedJobs;
