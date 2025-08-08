import React, { useEffect, useState } from "react";
import {  getListOfAppliedCourse } from "../services/institute.service";
import CourseCard from "../components/CourseCard";
import { useGlobalState } from "../GlobalProvider";
import AppliedCourseCard from "../components/AppliedCourseCard";
function CourseApplied() {
  const { globalState, setGlobalState } = useGlobalState();
  const [courseList, setCourseList] = useState([]);
  const getAppliedCourseListFunc = async () => {
    try {
      let response = await getListOfAppliedCourse(globalState?.user?.access_token);
      console.log(response);
      setCourseList(response?.applied_courses);
    } catch (error) { }
  };
  useEffect(() => {
    getAppliedCourseListFunc();
  }, []);
  return (
    <div className="  mt-5 pt-5">
      <div className="mt-5 pt-md-5 container">
        
        <h5
          className="text-center my-md-5  pb-3 textBlue"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: "600" }}
        >
         APPLIED COURSES 
        </h5>
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
              <div className="col-md-6 col-12"><AppliedCourseCard v={v} /></div>
              
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CourseApplied;
