import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { motion, useInView } from "framer-motion";
import { getHraList } from "../services/hra.service";
import { useNavigate } from "react-router-dom";
function JobOpeningInTopCompany() {
  const navigate = useNavigate();
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
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

  const container = useRef(null);
  const isInView = useInView(container);
  const [companyList, setCompanyList] = useState([]);
  const getHraListFunc = async () => {
    try {
      let response = await getHraList();
      console.log(response?.data?.cmpData);
      setCompanyList(response?.data?.cmpData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getHraListFunc();
  }, []);
  return (
    <div
      style={{ background: "#F4F2F6" }}
      className="customSliderHeight d-flex justify-content-center align-items-center"
      ref={container}
    >
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
          transition={{ duration: 1 }}
          className="text-center textBlue mb-5 mt-5"
          style={{fontWeight:"500"}}
        >
         Job Openings in Top companies
        </motion.h2>

        <div className="w-100">
          <Slider {...settings}>
            {companyList.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
                transition={{ duration: 1, delay: i * 0.02 }}
              >
                <div className="bg-light px-4 my-3 mx-3 py-5 border shadow rounded">
                  <div className="col-5">
                    <img
                      src={
                        v?.cmpLogoS3 === "placeholder/logo.png"
                          ? "https://overseasdata.s3.ap-south-1.amazonaws.com/Company/6/logo.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240924%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240924T105807Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=eb24a3ad133c29d1ea4d7099087432434fa62611d25dba8ac36c3542cbee65b6"
                          : v?.cmpLogoS3
                      }
                      alt="Company Logo"
                     className="img-fluid"
                    />
                  </div>
                  <h5 className="mt-4" style={{ height: "40px" }}>
                    {v?.cmpName}
                  </h5>
                  {/* <p className="mb-5">
                    {v?.cmpDescription?.substring(0, 100)}
                    {v?.cmpDescription?.length>100 && "..."}
                  </p> */}
                  <button
                    className="btn btn-outline-primary mt-4"
                    onClick={() => navigate("/recruiting-companies")}
                  >
                    View More
                  </button>
                </div>
              </motion.div>
            ))}
          </Slider>
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-primary"
            style={{ width: "200px" }}
            onClick={() => navigate("/recruiting-companies")}
          >
            View All
          </button>
        </div>
      </div>
    </div>
  );
}

export default JobOpeningInTopCompany;
