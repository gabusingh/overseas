import React, { useEffect, useState } from "react";
import {
  candidateByJobRecommanded,
  hraPostedJobs,
} from "../../services/hra.service";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate, useParams } from "react-router-dom";
import CandidateCard from "../../components/CandidateCard";
import { color } from "framer-motion";

function RecommandedCandidates() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const params = useParams();
  const [loader, setLoader] = useState();
  const [applicationList, setApplicationList] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(
    params?.id ? params?.id : ""
  );
  const [jobDetails, setJobDetails] = useState();
  const getRecommandedCandidate = async (id) => {
    setLoader(true);
    try {
      let response = await candidateByJobRecommanded(
        globalState?.user.access_token,
        id
      );
      setApplicationList(response.data);
      setJobDetails(response?.data?.jobdata);
      setLoader(false);
    } catch (error) {}
  };
  useEffect(
    (v, i) => {
      getRecommandedCandidate(selectedJobId);
    },
    [selectedJobId]
  );

  const [jobList, setJobList] = useState([]);
  const getJobsPostedByHra = async () => {
    setLoader(true);
    try {
      let response = await hraPostedJobs(globalState?.user.access_token, {});
      setJobList(response.data?.data.jobs);
      setLoader(false);
    } catch (error) {}
  };
  useEffect((v, i) => {
    getJobsPostedByHra();
  }, []);
  return (
    <div className="mt-5 pt-md-5">
      <div className="mt-5  container">
        <div
          className="d-flex justify-content-between my-5 pt-5 align-items-center"
          style={{ cursor: "pointer" }}
        >
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
              <span className="text-light">Recommended Candidates</span>
            </div>
          </div>
          <div className="d-flex ">
            <select
              className="form-control w-100"
              onChange={(e) => setSelectedJobId(e.target.value)}
            >
              <option value="">Select Job </option>
              {jobList?.map((v, i) => {
                return <option value={v?.id}>{v?.jobTitle}</option>;
              })}
            </select>
          </div>
        </div>
        {selectedJobId ? (
          <div className=" p-3 mx-0 my-5   border shadow-lg rounded">
            <h1 className="textBlue text-center fontSans">
              {jobDetails?.jobTitle}
            </h1>
            <p className="my-3 text-center fontSans">
              Job Id : {jobDetails?.jobID}
            </p>
            <p className="my-3 text-center fontSans">
              {jobDetails?.jobDescription}
            </p>
            <div className="d-flex justify-content-center my-2 imgContainer">
              <img
                src={`https://admin.overseas.ai/storage/uploads/countryFlag/${jobDetails?.jobLocationCountry?.countryFlag}`}
                alt="Country Flag"
              />
              <img
                src="https://admin.overseas.ai/newfrontend/image/job-card/accommodation.png"
                alt="Accommodation Image"
              />
              <img
                src="https://admin.overseas.ai/newfrontend/image/job-card/health.png"
                alt="Health Image"
              />
              <img
                src="https://admin.overseas.ai/newfrontend/image/job-card/transportation.png"
                alt="Transportation Image"
              />
            </div>
          </div>
        ) : (
          <div className="vh50 d-flex align-items-center justify-content-center">
            <div>
              <h2 className="text-secondary border bg-light shadow p-4 rounded">
                Please select a job to get recommanded candidates
              </h2>
            </div>
          </div>
        )}

        {loader ? (
          <div className="vh-100 row col-12 justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div>
            {applicationList?.bestMatch?.data?.length > 0 && (
              <div>
                <h3
                  style={{ background: "#72BF78" }}
                  className="p-2 rounded border shadow-sm"
                >
                  Best Matching
                </h3>
                <div className="row m-0 p-0">
                  <div className="row m-0 p-0">
                    {applicationList?.bestMatch?.data?.map((v, i) => {
                      return (
                        <CandidateCard value={v} jobId={jobDetails?.jobID} showMarkBtn={true} jobPrimaryId={selectedJobId} getRecommandedCandidate={getRecommandedCandidate}/>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {applicationList?.goodMatch?.data?.length > 0 && (
              <div>
                <h3
                  style={{ background: "#A0D683" }}
                  className="p-2 rounded border shadow-sm"
                >
                  Good Matching
                </h3>
                <div className="row m-0 p-0">
                  <div className="row m-0 p-0">
                    {applicationList?.goodMatch?.data?.map((v, i) => {
                      return (
                        <CandidateCard value={v} jobId={jobDetails?.jobID} showMarkBtn={true} jobPrimaryId={selectedJobId} getRecommandedCandidate={getRecommandedCandidate}/>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            {applicationList?.partialMatch?.data?.length > 0 && (
              <div>
                <h3
                  style={{ background: "#D3EE98" }}
                  className="p-2 rounded border shadow-sm"
                >
                  Partial Matching
                </h3>
                <div className="row m-0 p-0">
                  <div className="row m-0 p-0">
                    {applicationList?.partialMatch?.data?.map((v, i) => {
                      return (
                        <CandidateCard value={v} jobId={jobDetails?.jobID} showMarkBtn={true} jobPrimaryId={selectedJobId} getRecommandedCandidate={getRecommandedCandidate}/>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecommandedCandidates;
