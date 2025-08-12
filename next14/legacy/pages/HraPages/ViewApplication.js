import React, { useEffect, useState } from "react";
import { appliedCandidateList } from "../../services/hra.service";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import CandidateCard from "../../components/CandidateCard";
function ViewApplication() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const [loader, setLoader] = useState();
  const [applicationList, setApplicationList] = useState([]);
  const getJobsPostedByHra = async () => {
    setLoader(true);
    try {
      let response = await appliedCandidateList(globalState?.user.access_token, {});
      setApplicationList(response.data?.data);
      setLoader(false);
    } catch (error) {}
  };
  useEffect((v, i) => {
    getJobsPostedByHra();
  }, []);
  return (
    <div className="mt-5 pt-md-5">
      <div className="mt-5  container">
        <div className="d-flex my-5 pt-5" style={{ cursor: "pointer" }}>
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
              <span className="text-light">Applied Candidates</span>
            </div>
          </div>
        </div>
        {loader ? (
          <div className="vh-100 row col-12 justify-content-center align-items-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row m-0 p-0">
            <div className="row m-0 p-0">
              {applicationList?.map((v, i) => {
                return <CandidateCard value={v} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplication;
