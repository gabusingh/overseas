import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getJobByHra, getHraDetails } from "../services/hra.service";
import JobCard from "../components/JobCard";
function CampanyDetails() {
  const [hraJobList, setHraJobList] = useState([]);
  const getJobByHraFunc = async (id) => {
    try {
      let response = await getJobByHra({
        access_token:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5IiwianRpIjoiYjYwZTQ5YTIxYTgzNjU4MzRjNTg2MWM0N2Q3OTEwNmU0MWQ1NzA2MTUyZmIzMDljOTk2N2EyZGNmZjczMWY1MjQwYzYwNmYwMjlmYzQ1NDIiLCJpYXQiOjE3MjA4NTQ1ODkuMzE0MDI2LCJuYmYiOjE3MjA4NTQ1ODkuMzE0MDI3LCJleHAiOjE3NTIzOTA1ODkuMzEyMzUxLCJzdWIiOiIxMzU4MSIsInNjb3BlcyI6WyJwZXJzb24iXX0.PnvQH7CbQyYYFeyyoWbN7h4HKVc5YLhQL0k0Q62DZHftub4tRPHvr2Rn0G2Ek5KwJJUKgq8pFvzaGEtejJ3gY24hPdx5no1bx3NpDVZFXDMFnMNLtRWEjksgT4nZTVsWEc2qKqdL58SEpw92h1aufQ49XoCUaQH9cQGTOrBsUTRK6QAvH2Mcj-7EFCngMCeAegW5Mk-m63w6AF77xZgU4ED2Oi12fJntLJyz47_7gIbPZ-M9qZca2yD_wmKSoyRyk8mtuCAfrLmEoLCc7ib6uquhbD5dSAoVBSxKUgkn21aalqVPFBMPpNoQvaHdgFKZ3vAIxniGkoKajWISZfBzYy1oPANI7T6zgW96sL9Ibry13aXR3l76Nds2b99jQtc1W5WHgLLsDchf8xUmT5tFlw9WQyEJmeXmPIld7C_6sSNGrGinhQOLpa5UWeyCOWKpQiauElLW8BBrYmTo26485LOUlDGswM94T9ERfQrh2Cky5GKtyxuKN_8bt6EnUwNyNjHxSQD2K2JnLFQjtNR4O36np3f_yMbWW3ECedkXVQmGkav4UopavdBZmGs4H3joOiP5oMaWNNvUq1RXRKfaFCqiUFH_2doLBDMZOy07mV2_SK3TfDF3kETAWP5ZgkmQ949ZeLj8Byu62L9--EodCeqsYhezMlLN7c6Fy8E1qWg",
        cmpID: id,
      });
      if (response?.status == 200) {
        setHraJobList(response?.data?.jobs);
      } else {
        console.warn("something went wrong");
      }
    } catch (error) {
      console.warn("something went wrong");
    }
  };
  const [hraDetails, setHraDetails] = useState();
  const getHraDetailsFunc = async (id) => {
    try {
      let response = await getHraDetails(id);
      console.log(response.data.company);
      setHraDetails(response.data.company);
    } catch (error) {}
  };
  const params = useParams();
  useEffect(() => {
    getJobByHraFunc(params?.id);
    getHraDetailsFunc(params?.id);
  }, []);
  const renderStars = (numRatings) => {
    const stars = [];
    for (let i = 0; i < numRatings; i++) {
      stars.push(<i className="fa fa-star text-warning me-1"></i>);
    }
    return stars;
  };
  return (
    <div className="mt-md-5 pt-4 pt-xl-2 pt-md-0">
      <div className="mt-md-5 py-5 container ">
        <div className="row mb-4">
          <div className="col-12 p-0">
            <div className=" m-3 " >
             <div className="row">
             <div className="row col-8 " >
                <div style={{background:"whitesmoke"}} className="shadow rounded p-4 m-2 row">
                <div className="col-md-3 col-12 " >
                  <img
                    src={hraDetails?.cmpLogoS3}
                    className="img-fluid "
                    alt="Company Image"
                  />
                </div>
                <div className="col-md-9 col-12 my-md-auto ">
                  <h2>{hraDetails?.cmpName}</h2>
                  <p className="mb-0">Since {hraDetails?.cmpWorkingFrom}</p>
                  <div>{renderStars(hraDetails?.cmpRating)}</div>
                </div>
                <div className="col-12">
                  <p className="">{hraDetails?.cmpDescription}</p>
                  <div className="d-flex ">
                    <button
                      className="btn btn-primary w-100 bgBlue"
                      style={{
                        borderRadius: "25px",

                        outline: "none",
                        border: "none",
                        padding: "10px",
                      }}
                    >
                      Follow
                    </button>
                  </div>
                </div>
                </div>
              </div>
              <div className="col-4">
                
                  <img className="img-fluid" src="https://www.hirect.in/_nuxt/img/chat-directly-new.6e008a5.png" alt=" Image"/>
                
              </div>
             </div>
            </div>
          </div>
        </div>
       <h4 className=" my-3 pt-5"><span className="shadow py-1 px-2 rounded">Job Posted By {hraDetails?.cmpName}</span></h4>
        <div className="row">
          {hraJobList?.map((v, i) => {

            return <div className="col-md-6 col-12"><JobCard value={v} /></div>;
          })}
        </div>
      </div>
    </div>
  );
}

export default CampanyDetails;
