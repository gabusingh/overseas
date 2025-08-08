import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getCourseById, getCourseByInstitute, applyCourse } from "../services/institute.service";
import AppPromationSection from "../components/AppPromationSection";
import { useGlobalState } from "../GlobalProvider";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function CourseDetails() {
  const params = useParams();
  const [courseDetails, setCourseDetails] = useState("");
  const getCourseDetails = async () => {
    try {
      let response = await getCourseById(params?.id);
      setCourseDetails(response?.data?.data);
      getCourseByInsListFunc(response?.data?.data?.institute_details?.institute_id)
    } catch (error) {}
  };
  const [courseList, setCourseList] = useState([]);
  const getCourseByInsListFunc = async (id) => {
    try {
      let response = await getCourseByInstitute({instId:id});
      setCourseList(response.data);
    } catch (error) {}
  };
  useEffect(() => {
    getCourseDetails();
    
  }, []);
  const navigate = useNavigate();
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024, // screen width up to 1024px (tablet)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600, // screen width up to 600px (mobile)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const { globalState, setGlobalState } = useGlobalState();

  const handleCourseApply = async () => {
    if (globalState.user) {
      try {
        let response = await applyCourse({
          id: courseDetails?.id,
          access_token: globalState?.user?.access_token,
        });
        console.log(response);
        if (response?.message == "Application submitted successfully!") {
          toast.success("Application submitted successfully!");
        } else {
          toast.success(response?.message);
        }
      } catch (error) {}
    } else {
      toast.warning("Please login to apply for the course");
    }
  };
  return (
    <>
      <div className="mt-5 pt-5">
        <div className="container mt-5 py-md-5">
          <div className="row mt-md-5 pt-md-2">
            <div className="col-md-6 col-12 my-auto">
              <h1 className="mb-3 ">{courseDetails?.course_name}</h1>
              <div className="ms-2">
                <h4 style={{ fontWeight: "400" }} className="mb-2">
                 <span style={{fontWeight:'500'}}>Institute : </span> {courseDetails?.institute_details?.instituteName}
                </h4>
                <h4 style={{ fontWeight: "400" }} className="mb-2">
                <span style={{fontWeight:'500'}}>Address : </span> {courseDetails?.institute_details?.insAddress}
                </h4>
                <h4 style={{ fontWeight: "400" }} className="mb-2">
                <span style={{fontWeight:'500'}}>Fee : </span> {courseDetails?.course_fee}/-
                </h4>
                <h4 style={{ fontWeight: "400" }} className="mb-2">
                <span style={{fontWeight:'500'}}>Eligibility : </span> {courseDetails?.eligibility}
                </h4>
                <h4 style={{ fontWeight: "400" }} className="mb-2">
                <span style={{fontWeight:'500'}}>Apply Before : </span> {courseDetails?.submission_date}
                </h4>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <img className="img-fluid mt-3 mt-md-0" src={courseDetails?.course_image} alt="course Image"/>
            </div>
          </div>
          <div className="row mt-5 mb-4">
            <div className="col-md-6 col-lg-3 col-12 mb-2">
              <div className="border p-2 text-center rounded">
                Duration : {courseDetails?.course_duration}
              </div>
            </div>
            <div className="col-md-6 col-lg-3 col-12 mb-2">
              <div className="border text-center p-2 rounded">
                Exam Mode : {courseDetails?.assessment_type}
              </div>
            </div>
            <div className="col-md-6 col-lg-3 col-12 mb-2">
              <div className="border text-center p-2 rounded">
                Course type : {courseDetails?.course_type}
              </div>
            </div>
            <div className="col-md-6 col-lg-3 col-12 mb-2">
              <div className="border text-center p-2 rounded">
                Total seat : {courseDetails?.total_seats}
              </div>{" "}
            </div>
          </div>
          {courseDetails?.appliedStatus ? (
            <button
              className="btn w-100 btn-sm btn-warning"
            >
              Applied
            </button>
          ) : (
            <button
              className="btn bgBlue btn-primary w-100"
              
              onClick={() => handleCourseApply()}
            >
              Apply
            </button>
          )}
          {/* <button className="btn bgBlue btn-primary w-100" >Apply</button> */}
        </div>
      </div>
      <div className="">
        <h2 className=" text-center mb-5 mt-5 textBlue">
          <b>Courses offered by {courseDetails?.institute_details?.instituteName}</b>
        </h2>
        <div className="my-5 py-4">
          <Slider {...settings}>
            {courseList?.map((v, i) => {
              return (
                <div className="">
                  <div className="mx-2 d-flex justify-content-center">
                    <img
                      src={v?.course_image}
                      className=" "
                      style={{
                        height: "200px",
                        width: "200px",
                        borderRadius: "50%",
                      }}
                      alt="course Image"
                    />
                  </div>
                  <p className="text-center my-3">
                    <b>{v?.course_name}</b>
                  </p>
                </div>
              );
            })}
          </Slider>
        </div>
        <div className="d-flex justify-content-center ">
          <button
            className="btn btn-outline-primary "
            style={{ width: "200px" }}
            onClick={() => navigate("/skill-training-institute")}
          >
            View All
          </button>
        </div>
      </div>
      <AppPromationSection />
      <ToastContainer/>
    </>
  );
}

export default CourseDetails;