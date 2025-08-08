import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Slider from "react-slick";
function RegionList() {
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
  };
  const container = useRef(null);
  const isInView = useInView(container);
  return (
    <div className="bg-light" style={{ background: "#fff" }} ref={container}>
      <div className="container">
        <div className="row mt-5 py-5">
          <div className="col-4 my-auto">
            <motion.h1
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
              }}
              className=" traingPartnerHeading text-center   mb-5 mt-5"
              
            >
              {/* Direct <span className="textBlue">Hiring</span> App for Founders, Team Leaders and Hiring Managers */}
              " Meet Our Training Partners... "
            </motion.h1>
          </div>
          {[1, 2, 3, 4, 5].map((v, i) => {
            return (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
                transition={{
                  duration: 1,
                  delay: i * 0.2,
                }}
                className="col-4 m-0 p-0"
              >
                <div className="mx-4 my-4">
                  <div className="shadow rounded p-3 text-center" style={{background:"white"}}>
                    <img
                      src="https://overseasdata.s3.ap-south-1.amazonaws.com/InstituteData/profileImage/TI13556/profileImage.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240704%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240704T055853Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=f6483f4015b4b4f949b63819e69d5b1b96c2b5ea42f4a31f18798a140833e4ae"
                      className="img-fluid "
                      style={{ maxHeight: "200px" }}
                    />
                    <p className="textBlue mt-2 mb-0 text-center">
                      <b>Netaji Private Limited</b>
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          
            <div className="d-flex justify-content-center mt-3">
            <button className="btn btn-primary"style={{ width: "200px" }}>View All</button>
            </div>
        
        </div>
      </div>
    </div>
  );
}

export default RegionList;
