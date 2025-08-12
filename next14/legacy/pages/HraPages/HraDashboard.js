import React, {useEffect, useState} from "react";
import { useGlobalState } from "../../GlobalProvider";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import CandidateCard from "../../components/CandidateCard";
import HraJobCard from "../../components/HraJobCard";
import {getHraDashboardData} from "../../services/hra.service"
function HraDashboard() {
    const navigate = useNavigate()
  const { globalState, setGlobalState } = useGlobalState();
  const[hraData, setHraData]=useState()
  const statice = [
    {
      name: "Posted Jobs",
      count: hraData?.totalPostedJobs,
      icon: "fa fa-suitcase me-2",
    },
    {
      name: "Job Application",
      count: hraData?.totalAppliedCandidates,
      icon: "fa fa-list me-2",
    },
    

    {
      name: "Bulk Hiring Request",
      count: hraData?.totalPostedBulkHiring,
      icon: "fa fa-user me-2",
    },
  ];
  const renderStart = (star) => {
    // Create an array with the length equal to the star number
    const starArray = Array.from({ length: star }, (_, i) => i);
  
    return (
      <h5 className="mb-0">
        {starArray.map((_, i) => (
          <i key={i} className="fa fa-star text-warning me-1"></i>
        ))}
      </h5>
    );
  };
  const logoutFunc = () => {
    localStorage.removeItem("loggedUser");
    navigate("/");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const [navItems, setNavItems] = useState([
    {
      name: "Create Job",
      icon: "fa fa-suitcase",
      path: "/create-jobs",
    },
    {
      name: "Bulk Hire",
      icon: "fa fa-users",
      path: "/create-bulk-hire",
    },
    {
      name: "View Jobs",
      icon: "fa fa-briefcase",
      path: "/hra-jobs",
    },
    {
      name: "View Application",
      icon: "fa fa-list",
      path: "/view-candidate-aplication-list",
    },
    {
      name: "Recommended Candidate",
      icon: "fa fa-user",
      path: "/recommanded-candidates",
    },
    {
      name: "Notification",
      icon: "fa fa-bell",
      path: "/hra-notifications",
    },
    {
      name: "Need Help",
      icon: "fa fa-question-circle",
      path: "/contact-us",
    },
  ]);
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
  const handleHraDashboardData = async()=>{
    try {
      let response = await getHraDashboardData(globalState.user.access_token);
      setHraData(response.data.data)
    } catch (error) {
      
    }
  }
  useEffect(()=>{
    handleHraDashboardData()
  },[])
  return (
    <div className="container mt-5 pt-5">
      <div className="mt-md-5 py-md-5 mb-5">
        <div className="row">
          <div className="col-md-4 col-12">
            <div className="p-3  shadow-sm border rounded">
              <div className="d-flex my-3 align-items-center">
                <div>
                  <img
                    src={globalState?.user?.cmpData?.cmpLogoS3}
                    style={{
                      height: "110px",
                      width: "110px",
                      borderRadius: "50%",
                    }}
                    alt="Profile Image"
                  />
                  <p
                    className="text-center textBlue"
                    style={{ cursor: "pointer" }}
                    onClick={() => alert("Work in progress")}
                  >
                    <u>Edit</u>
                  </p>
                </div>

                <div className="ms-3">
                  <h4 className="mb-1">
                    {globalState?.user?.cmpData?.cmpName}
                  </h4>
                  {renderStart(parseInt(globalState?.user?.cmpData?.cmpRating))}
                  
                  <p>
                    <i className="fa fa-phone"></i>{" "}
                    {globalState?.user?.cmpData?.cmpPhone}
                  </p>
                </div>
              </div>
              {/* <div className="border" style={{ marginTop: "-10px" }}>
                <div
                  style={{
                    width: parseInt(
                      globalState?.user?.empData?.profileStrength
                    ),
                    height: "7px",
                    background: "green",
                  }}
                ></div>
              </div>
              <span>Profile Strength</span> */}

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
          <div className=" col-8 row d-none d-md-flex custom-myProfile-scrollbar">
            {statice?.map((v, i) => {
              return (
                <div className="col-lg-4">
                  <div className="shadow-sm p-4 ">
                    <h5 className="text-secondary">{v?.name}</h5>
                    <div className="d-flex">
                      <h2 className="text-secondary">
                        <i className={v?.icon}></i>
                      </h2>
                      <h2 className="text-secondary">{v?.count}</h2>
                    </div>
                  </div>
                </div>
              );
            })}
            <div className="ms-2  p-2 ">
              {hraData?.latestPostedJobs.length>0 && <>
                <h4 className="text-center py-1 bgBlue text-light">
                Posted Jobs
              </h4>
              <div className="row">
                <Slider {...settings}>
                  {hraData?.latestPostedJobs.map((v, i) => {
                    return (
                      <div className="">
                        <HraJobCard value={v} slider={true}/>
                      </div>
                    );
                  })}
                </Slider>
              </div>
              <div className="d-flex justify-content-end mt-2 mb-5 me-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/hra-jobs")}
                >
                  View All
                </button>
              </div></>}
              
              
            </div>
             <div className="ms-2  p-2 ">
              {hraData?.latestAppliedCandidates.length>0 && <>
                <h4 className="text-center py-1 bgBlue text-light">
                Job Application
              </h4>
              <div className="row">
                <Slider {...settings}>
                  {hraData?.latestAppliedCandidates.map((v, i) => {
                    return (
                        <CandidateCard value={v} slider={true}/>
                    );
                  })}
                </Slider>
              </div>
              <div className="d-flex justify-content-end mt-2 mb-5 me-4">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate("/view-candidate-aplication-list")}
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

export default HraDashboard;
