import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGlobalState } from "../GlobalProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { applyCourse } from "../services/institute.service";
function TradeTestCard({ v , getTestTradeListFunc}) {
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

            getTestTradeListFunc()
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
    <div className="col-12 col-md-6">
      <div className="shadow mx-3 my-4 p-4 rounded">
        <div className="d-flex  justify-content-start mb-3">
          <span className="bg-success badge">
            Total Seats: {v?.total_seats}
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
              alt="Test Image"
            />
          </div>
          <div className="col-12 col-md-8">
            <p className="mb-0">
              <span>Test Name : </span> {v?.course_name}
            </p>
            <p className="mb-0">
              <span>Duration : </span> {v?.course_duration}
            </p>
            <p className="mb-0">
              <span>Fee : </span> {v?.course_fee}
            </p>
            <p className="mb-0">
              <span>Videography Facility : </span> {v?.videographyAvlQ}
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-3">
          <Link to={"/test-details/" + v?.id}>Read More</Link>
          {v?.appliedStatus ? (
            <button
              className="btn btn-sm btn-warning"
              style={{ width: "30%" }}
            >
              Applied
            </button>
          ) : (
            <button
              className="btn btn-sm btn-outline-primary"
              style={{ width: "30%" }}
              onClick={() => handleCourseApply()}
            >
              Apply
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default TradeTestCard;
