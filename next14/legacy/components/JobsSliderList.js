import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
function JobsSliderList({
  title,
  titleH4,
  backgroundColor,
  rounded,
  data,
  institute,
}) {
  const navigate = useNavigate();
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    cssEase: "linear",
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
  const container = useRef(null);
  const isInView = useInView(container);
  const navigatePage = (value) => {
    console.log(value);
    if (institute) {
      navigate(`/institute-details/${value?.value}`);
    } else {
      const formatUrl = (name) => {
        return name.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with hyphens
      };

      navigate(`/jobs/${formatUrl(value.label)}-all-jobs`);
    }
  };
  return (
    <div
      className="customSliderHeight d-flex justify-content-center align-items-center"
      style={{ background: backgroundColor }}
      ref={container}
    >
      <div className="container">
        <div className="">
          {titleH4 ? (
            <motion.h4
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
              }}
              className=" text-center mb-5 mt-5 textBlue"
              style={{fontSize:"35px"}}
            >
              {/* Direct <span className="textBlue">Hiring</span> App for Founders, Team Leaders and Hiring Managers */}
              <b>{title}</b>
            </motion.h4>
          ) : (
            <motion.h2
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
              }}
              className=" text-center mb-5 mt-5 textBlue"
              
            >
              {/* Direct <span className="textBlue">Hiring</span> App for Founders, Team Leaders and Hiring Managers */}
              <b>{title}</b>
            </motion.h2>
          )}

          <div className="my-5 py-4">
            <Slider {...settings}>
              {data?.
              map((v, i) => {
                return (
                  <motion.div
                    onClick={() => navigatePage(v)}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{
                      opacity: isInView ? 1 : 0,
                      y: isInView ? 0 : 100,
                    }}
                    transition={{
                      duration: 1,
                      delay: i * 0.08,
                    }}
                    className=""
                  >
                    <div className="mx-2 d-flex justify-content-center">
                      <img
                        src={v?.img}
                        className=" "
                        style={{
                          height: "230px",
                          width: "230px",
                          borderRadius: rounded ? "50%" : "0px",
                        }}
                        alt="Image"
                      />
                    </div>
                    <p className="text-center my-3">
                      <b>{v?.label}</b>
                    </p>
                  </motion.div>
                );
              })}
            </Slider>
          </div>
          <div className="d-flex justify-content-center ">
            <button
              className="btn btn-outline-primary "
              style={{ width: "200px" }}
              onClick={() =>
                navigate(institute ? "/training-institutes" : "/jobs")
              }
            >
              View All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobsSliderList;
