import React, { useEffect, useState } from "react";
import { getCourseList } from "../services/institute.service";
import CourseCard from "../components/CourseCard";
import { useGlobalState } from "../GlobalProvider";
import { Helmet } from "react-helmet";
function TrainingInstitute() {
  const { globalState, setGlobalState } = useGlobalState();
  const [courseList, setCourseList] = useState([]);
  const getCourseListFunc = async () => {
    try {
      let response = await getCourseList(globalState?.user?.access_token);
      console.log(response.data);
      setCourseList(response.data);
    } catch (error) { }
  };
  useEffect(() => {
    getCourseListFunc();
  }, []);
  return (
    <><Helmet>
    <title>Skill Training Institute: Elevate Your Career Today</title>
    <meta
      name="description"
      content="Join Skill Training Institute to gain practical skills and knowledge to help you succeed in your career."
    />
    <meta name="keywords" content="skill training institute" />
  </Helmet>
  <div className="  mt-5 pt-5">
      <div className="mt-5 pt-md-5 container">
        <div className="row mx-3 mb-5 mt-3">
          <div className="col-md-6 col-12 my-auto order-md-1 order-2">
            <div className="py-5">
              <h5 className="textBlue">UPGRADE YOUR SKILL</h5>
              <h1 className="heading ">Get Certified to get your dream job.</h1>
              <p>More than 500 cources | 100 institutes</p>
            </div>
          </div>
          <div className="col-md-6 col-12 my-auto order-md-1  d-flex justify-content-center">
            <img
              className="img-fluid"
              src="/images/institute.png"
              style={{ height: "350px" }}
              alt="Profile Image"
            />
          </div>
        </div>
        <h2
          className="text-center my-md-5 pt-md-5 pb-3 textBlue"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
        >
          COURSES WE OFFER
        </h2>
        <div className="row mb-3">
          <div className="col-6">
            <input className="form-control" placeholder="Search" />
          </div>
          <div className="col-3">
            <select className="form-control">
              <option>Select Course Type</option>
              <option>Online</option>
              <option>Offline</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div className="col-3">
            <select className="form-control">
              <option>Exam Mode</option>
              <option>Writen</option>
              <option>Viva</option>
              <option>Both</option>
            </select>
          </div>
        </div>

        <div className="row">
          {courseList?.length == 0 && (
            <div className="my-5 d-flex align-items-center justify-content-center">
              <div class="spinner-border" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          )}
          {courseList?.map((v, i) => {
            return (
              <CourseCard v={v} getCourseListFunc={getCourseListFunc}/>
            );
          })}
        </div>
      </div>
    </div>
  </>
    
  );
}

export default TrainingInstitute;
