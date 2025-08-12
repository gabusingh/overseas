import React, { useEffect, useState } from "react";
import { getUserDetails } from "../services/user.service";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../GlobalProvider";
import CourseCard from "../components/CourseCard";
import AppliedCourseCard from "../components/AppliedCourseCard";
import Slider from "react-slick";
import AppliedJobCard from "../components/AppliedJobCard";
import AppliedTestCard from "../components/AppliedTestCard";
import JobCard from "../components/JobCard";
function MyProfile() {
  const navigate = useNavigate();
  const { globalState, setGlobalState } = useGlobalState();
  const logoutFunc = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const [navItems, setNavItems] = useState([
    {
      name: "Courses Applied",
      icon: "fa fa-graduation-cap",
      path: "/applied-courses",
    },
    {
      name: "Job Applied",
      icon: "fa fa-graduation-cap",
      path: "/applied-jobs",
    },
    {
      name: "My Documents",
      icon: "fa fa-file",
      path: "/my-documents",
    },
    {
      name: "Saved Jobs",
      icon: "fa fa-save",
      path: "/saved-jobs",
    },
    {
      name: "Notifications",
      icon: "fa fa-bell",
      path: "/notifications",
    },
    {
      name: "Experience",
      icon: "fa fa-briefcase",
      path: "/candidate-experiences",
    },
    {
      name: "Need Help",
      icon: "fa fa-question-circle",
      path: "/contact-us",
    },
  ]);
  const [userData, setUserData] = useState();
  const getUserDetailsFunc = async () => {
    try {
      let response = await getUserDetails(globalState?.user?.access_token);
      setUserData(response?.data);
    } catch (error) {}
  };
  useEffect(() => {
    getUserDetailsFunc();
  }, []);
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1300, // screen width up to 1024px (tablet)
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 900, // screen width up to 1024px (tablet)
        settings: {
          slidesToShow: 3,
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
  const renderStart = (star) => {
    if (star >= 80) {
      return (
        <h5 className="mb-0">
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
        </h5>
      );
    }
    if (star > 60 && star<80) {
      return (
        <h5 className="mb-0">
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          
        </h5>
      );
    }
    if (star > 40 && star<60) {
      return (
        <h5 className="mb-0">
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
   
          
        </h5>
      );
    }
    if (star > 20 && star<40) {
      return (
        <h5 className="mb-0">
          <i className="fa fa-star text-warning me-1"></i>
          <i className="fa fa-star text-warning me-1"></i>
         
          
        </h5>
      );
    }
    if (star > 0 && star<20) {
      return (
        <h5 className="mb-0">
          <i className="fa fa-star text-warning me-1"></i>
         
          
        </h5>
      );
    }
  };
  return (
    <div className="container mt-5 pt-5">
      <div className="mt-md-5 py-5 mb-5">
        <div className="row">
          <div className="col-md-4 col-12">
            <div className="p-3  shadow-sm border rounded">
              <div className="d-flex my-3 align-items-center">
                <div>
                  <img
                    src={globalState?.user?.empData?.empPhoto}
                    style={{
                      height: "110px",
                      width: "110px",
                      borderRadius: "50%",
                    }}
                    alt="Profile Image"
                  />
                  <p className="text-center textBlue" style={{cursor:"pointer"}} onClick={()=>alert("Work in progress")}>
                    <u>Edit</u>
                  </p>
                </div>

                <div className="ms-3">
                  <h4 className="mb-1">
                    {globalState?.user?.empData?.empName}
                  </h4>
                  {renderStart(parseInt(
                      globalState?.user?.empData?.profileStrength
                    ))}
                  <p className="mb-0">
                    {globalState?.user?.empData?.empOccupationModel?.occupation}
                  </p>
                  <p>
                    <i className="fa fa-phone"></i>{" "}
                    {globalState?.user?.empData?.empWhatsapp}
                  </p>
                </div>
              </div>
              <div className="border" style={{ marginTop: "-10px" }}>
                <div
                  style={{
                    width: parseInt(
                      globalState?.user?.empData?.profileStrength
                    )+"%",
                    height: "7px",
                    background: "green",
                  }}
                ></div>
              </div>
              <span>Profile Strength : <i>{globalState?.user?.empData?.profileStrength}%</i></span>

              <div className="mt-3 mb-5 ms-2">
                {navItems?.map((v, i) => {
                  return (
                    <div
                      className="p-3"
                      style={{
                        borderBottom: "1px solid gray",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(v?.path)}
                    >
                      <i className={"me-2 " + v?.icon}></i>
                      <span>{v?.name}</span>
                    </div>
                  );
                })}

                <div
                  className="p-3"
                  style={{
                    borderBottom: "1px solid gray",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                  onClick={() => logoutFunc()}
                >
                  <i className="fa fa-sign-out me-2"></i>
                  <span>Log Out</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-8  d-none d-md-block custom-myProfile-scrollbar">
            <div className="ms-2  p-2 ">
              {userData?.applied_jobs.length!=0 && <>
                <h4 className="text-center py-1 bgBlue text-light">
                Applied Jobs
              </h4>
              <div className="row">
                <Slider {...settings}>
                  {userData?.applied_jobs?.map((v, i) => {
                    return (
                      <div className="">
                        <AppliedJobCard value={v} />
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="d-flex justify-content-end mt-2 mb-5 me-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/applied-jobs")}
                >
                  View All
                </button>
              </div></>}
              {userData?.applied_courses.length!=0 && <><h4 className="text-center py-1 bg-warning text-dark">
                Applied Courses
              </h4>
              <div className="row">
                <Slider {...settings}>
                  {userData?.applied_courses?.map((v, i) => {
                    return (
                      <div className="">
                        <AppliedCourseCard v={v} />
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="d-flex justify-content-end mt-2 mb-5 me-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/applied-courses")}
                >
                  View All
                </button>
              </div></>}
              {userData?.applied_trade_tests.length!=0 && <><h4 className="text-center py-1 bg-info text-light">
                Applied Tests
              </h4>
              <div className="row">
                <Slider {...settings}>
                  {userData?.applied_trade_tests?.map((v, i) => {
                    return (
                      <div className="">
                        <AppliedTestCard v={v} />
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="d-flex justify-content-end mt-2 mb-5 me-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/applied-courses")}
                >
                  View All
                </button>
              </div></>}
              {userData?.favourite_jobs.length!=0 && <>
                <h4 className="text-center py-1 bg-primary text-light">
                Favourite Jobs
              </h4>
              <div className="row">
                <Slider {...settings}>
                  {userData?.favourite_jobs?.map((v, i) => {
                    return (
                      <div className="">
                        <JobCard value={v} />
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="d-flex justify-content-end mt-2 mb-5 me-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/applied-courses")}
                >
                  View All
                </button>
              </div></>}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
