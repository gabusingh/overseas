import React, { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Slider from "react-slick";
import { getHomeData } from "../services/info.service";
function SuccessfulPlacedCandidateList({ title, backgroundColor, rounded }) {
  const [candidateData, setCandidateData]=useState([])
  const getCandidateListFunc = async () => {
    try {
      let response = await getHomeData();
      console.log(response);
      setCandidateData(response);
    } catch (error) {}
  };
  useEffect(() => {
    getCandidateListFunc();
  }, []);
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
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
  const container = useRef(null);
  const isInView = useInView(container);
  return (
    <div
      className="shadow-lg "
      style={{ background: backgroundColor }}
      ref={container}
    >
      <div className="row m-0 " style={{ overflow: "hidden" }}>
        <div
          className="col-lg-6 col-xl-4 col-md-12 col-sm-12 m-0 py-5 order-2"
          style={{ background: "#17487F" }}
        >
          <div className="py-md-5 my-4">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
              }}
              className=" text-center mb-5 mt-lg-5 px-md-5 mx-5"
              style={{ fontFamily: "sans", color: "white" }}
            >
              {/* Direct <span className="textBlue">Hiring</span> App for Founders, Team Leaders and Hiring Managers */}
              <b>Join the community of 5k satisfied job seekers...</b>
            </motion.h1>
            <motion.div className="d-flex justify-content-center">
              <motion.p
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
                transition={{
                  duration: 1,
                }}
                className="text-light me-3"
              >
                Play Store Ratings
              </motion.p>
              <motion.h5>
                {[1, 2, 3, 4, 5].map((v, i) => {
                  return (
                    <motion.i
                      initial={{ opacity: 0, y: 100 }}
                      animate={{
                        opacity: isInView ? 1 : 0,
                        y: isInView ? 0 : 100,
                      }}
                      transition={{
                        duration: 0.5 * i + 1,
                      }}
                      className={
                        "fa fa-star mx-1 " +
                        (i != 4 ? " text-warning" : " text-light")
                      }
                    ></motion.i>
                  );
                })}
              </motion.h5>
            </motion.div>
          </div>
        </div>
        <div className="col-md-12 col-xl-8 col-lg-6 p-3 p-md-0 col-sm-12 m-0 my-auto order-1">
          <Slider {...settings}>
            {candidateData?.afterDepartureVideos?.map((v, i) => {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    y: isInView ? 0 : 100,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  className=""
                >
                  <div className="mx-2 d-flex justify-content-center">
                    <img
                      src={v?.thumbAfterDepartureVideos}
                      className=" shadow"
                      style={{
                        height: "250px",
                        width: "300px",
                      }}
                      alt="Profile Image"
                    />
                  </div>
                  <p className="text-center my-2">
                    <b>{v?.empName}</b>
                  </p>
                </motion.div>
              );
            })}
            {candidateData?.beforeDepartureVideo?.map((v, i) => {
              return (
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{
                    opacity: isInView ? 1 : 0,
                    y: isInView ? 0 : 100,
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                  }}
                  className=""
                >
                  <div className="mx-2 d-flex justify-content-center">
                    <img
                      src={v?.thumbBeforeDepartureVideo
                      }
                      className=" "
                      style={{
                        height: "250px",
                        width: "300px",
                      }}
                      alt="Profile Image"
                    />
                  </div>
                  <p className="text-center my-2">
                    <b>Hasan Abdul</b>
                  </p>
                </motion.div>
              );
            })}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default SuccessfulPlacedCandidateList;
