import React from "react";
import { useGlobalState } from "../GlobalProvider";
import { applyCourse } from "../services/institute.service";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
function AppliedCourseCard({ v , getCourseListFunc}) {
  const { globalState, setGlobalState } = useGlobalState();

  const handleCourseApply = async () => {
    if (globalState.user) {
      try {
        let response = await applyCourse({
          id: v?.id,
          access_token: globalState?.user?.access_token,
        });
        console.log(response);
        if (response?.message == "Application submitted successfully!") {
          toast.success("Application submitted successfully!");
          setTimeout(()=>{

            getCourseListFunc()
          }, 5000)
          
        } else {
          toast.success(response?.message);
        }
      } catch (error) {}
    } else {
      toast.warning("Please login to apply for the course");
    }
  };
  return (
    <div className="">
      <div className="shadow mx-3 my-4 p-4 rounded">
        <div className="d-flex justify-content-start mb-3">
          <span className="bg-success badge">
            Applied Before: {v?.submission_date}
          </span>
        </div>
        <div className="row align-items-center">
          <div className="col-12 col-md-4 ">
            <img
              src={
                v?.course_image == "https://overseas.ai/placeholder/course.jpg"
                  ? "/images/institute.png"
                  : v?.course_image
              }
              className="img-fluid"
              alt="Course Image"
            />
          </div>
          <div className="col-12 col-md-8">
            <p className="mb-0">
              <span>Course Name : </span> {v?.course_name?.substring(0, 10)}
            </p>
            <p className="mb-0">
              <span>Duration : </span> {v?.course_duration}
            </p>
            <p className="mb-0">
              <span>Exam Mode : </span> {v?.assessment_type}
            </p>
            <p className="mb-0">
              <span>Course Type : </span> {v?.course_type}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <Link to={"/course-details/" + v?.id}>Read More</Link>
          
            <button
              className="btn btn-sm btn-warning"
              style={{ width: "30%" }}
            >
              Applied
            </button>
        
            
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AppliedCourseCard;
