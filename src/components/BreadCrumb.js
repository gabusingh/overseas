import React from "react";
import { useNavigate } from "react-router-dom";
function BreadCrumb() {
  const navigate = useNavigate();
  return (
    <div className="d-flex mt-5 pt-md-5" style={{ cursor: "pointer" }}>
      <div className="d-flex align-items-center justify-content-start  borderBlue">
        <div
          className="p-2 px-md-4 px-3"
          onClick={() => {
            navigate("/");
          }}
        >
          <i className="fa textBlue fa-home"></i>
        </div>

        <div
          className="p-2 px-md-4 px-3 borderLeft"
          onClick={() => {
            navigate("/jobs");
          }}
        >
          <i className="fa textBlue fa fa-suitcase me-2"></i>
          <span className="textBlue">ALL JOBS</span>
        </div>
        <div className="p-2 bgBlue px-md-4 px-3 borderRadiusLeft20">
          <i className="fa fa-suitcase text-light me-2"></i>
          <span className="text-light">JOB DETAILS</span>
        </div>
      </div>
    </div>
  );
}

export default BreadCrumb;
