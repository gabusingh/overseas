import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import SearchComponent from "./SearchComponent";
import Statics from "./Statics";
import CandidateNewsSlider from "./CandidateNewsSlider";
function HeroSection({ data }) {
  const container = useRef(null);
  const isInView = useInView(container);
  return (
    <div
      className="bg-light"
      ref={container}
      style={{
        background: "url(/images/homeBg.jpeg)",
        backgroundSize: "cover", // Maintain aspect ratio
        backgroundPosition: "center", // Ensure it's centered
        backgroundRepeat: "no-repeat",
      }}
    >
      <div style={{ background: "rgba(0, 0, 0, 0.6)" }}>
        <div className="px-lg-4 px-md-3 px-3 py-5 mt-5 ">
          <div className="pt-md-5 mt-md-5 ">
            <div className="mt-md-5 pt-5">
              <div className="col-md-8 col-lg-6 col-12">
                <motion.h1
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
                  transition={{
                    duration: 1,
                    delay: 0.25,
                  }}
                  className="heading  mb-5  pt-5  text-light  p-md-0"
                >
                  A Video Based{" "}
                  <span
                    className="text-light"
                    style={{ textShadow: "1px 1px 2px blue" }}
                  >
                    Job Portal
                  </span>{" "}
                  for Migrants Who Want to Make Career Abroad
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
                  transition={{
                    duration: 1,
                    delay: 0.5,
                  }}
                  className="   mb-5 "
                  style={{ color: "whitesmoke" , fontWeight:"500"}}
                >
                  
                    We connect employers and job-seekers across borders through
                    the power of Video. We go beyond traditional resumes and
                    cover letters and utilize authentic videos to establish the
                    credentials of the blue and grey-collar workers to
                    prospective employers.
                  
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
                  transition={{
                    duration: 1,
                    delay: 0.75,
                  }}
                  className="mt-5 pt-3"
                >
                  <SearchComponent data={data} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <CandidateNewsSlider />
      </div>
    </div>
  );
}

export default HeroSection;
