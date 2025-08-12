import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
function AppPromationSection() {
  const container = useRef(null);
  const isInView = useInView(container);

  return (
    <div className="container pb-3 pb-md-5" ref={container}>
      <div className="row py-5 ">
        <div className="col-md-7 col-12 order-lg-1 order-2 my-auto">
          <div className="text-md-start text-center">
          <motion.h3
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={{
              duration: 1,
            }}
            className="heading mt-4 mt-md-0"
          >
            Get the <span className="textBlue">Overseas Jobs</span> App
          </motion.h3>
          <motion.div className="d-flex justify-content-center justify-content-md-start  mt-3">
            <motion.div
              className=""
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
                delay: 0.25,
              }}
            >
              <p className="mb-0 text-center">
                4.7 <i className="fa fa-star text-warning"></i>
              </p>
              <p className="text-secondary font10">612 Reviews</p>
            </motion.div>
            <motion.div
              className="mx-5"
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
                delay: 0.5,
              }}
            >
              <p className="mb-0 text-center">10k+</p>
              <p className="text-secondary font10">Downloads</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
              transition={{
                duration: 1,
                delay: 0.75,
              }}
            >
              <p className="mb-0 text-center">612+</p>
              <p className="text-secondary font10">Rated for 612+</p>
            </motion.div>
          </motion.div>
          <motion.button
            className="downloadButton mt-5"
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={{
              duration: 1,
              delay: 0.5,
            }}
          >
            <a
              className="text-light text-decoration-none"
              href="https://play.google.com/store/apps/details?id=ai.overseas"
              target="blank"
            >
              Download App
            </a>
          </motion.button>
          </div>
        </div>
        <div className="col-md-5 col-12 order-lg-2 order-1 justify-content-end d-flex">
          <motion.img
            initial={{ scale: 0, y: 100 }}
            animate={{ scale: isInView ? 1 : 0, y: isInView ? 0 : 100 }}
            transition={{
              duration: 1,
            }}
            className="img-fluid"
            src="/images/tiltedApp.png"
            alt="Mobile Image"
          />
        </div>
      </div>
    </div>
  );
}

export default AppPromationSection;
