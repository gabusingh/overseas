import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCourseByInstitute } from "../services/institute.service";
import CourseCard from "../components/CourseCard";
function InstituteDetails() {
  const params = useParams();
  const [instituteDetails, setInstituteDetails] = useState();
  const [courseList, setCourseList] = useState([]);
  const getCourseByInstituteFunc = async (instId) => {
    try {
      console.log(typeof instId);
      let response = await getCourseByInstitute({
        instId: instId,
      });
      if (response?.msg == "Courses retrieved successfully!") {
        setCourseList(response?.data);
        setInstituteDetails(response?.data[0]?.institute_details);
      }
    } catch (error) {
      console.log("Something went wrong");
    }
  };
  useEffect(() => {
    
    getCourseByInstituteFunc(params?.id);
  }, []);
  return (
    <div className="mt-md-5 pt-4 pt-xl-2 pt-md-0">
      <div className="mt-md-5 py-5 container ">
        <div className="row mb-0 mb-md-4 p-0">
          <div className="col-12 p-0">
            <div className=" m-3 ">
              <div className="row m-0 p-0 ">
                <div className="row col-md-8 col-12 m-0 p-0">
                  <div>
                    <div
                      style={{ background: "whitesmoke" }}
                      className="shadow rounded p-4 m-2 row"
                    >
                      <div className="col-md-4 col-12 ">
                        <img
                          src={
                            instituteDetails?.profileImage ==
                            "https://overseas.ai/placeholder/institute.jpg"
                              ? "/images/institute.png"
                              : instituteDetails?.profileImage
                          }
                          className="img-fluid"
                          alt=" Image"
                        />
                      </div>
                      <div className="col-md-8 col-12 mt-3 mt-md-0">
                        <h1 style={{ fontWeight: "500", fontSize:"30px" }}>
                          {instituteDetails?.instituteName}
                        </h1>
                        <p>
                          <span style={{ fontWeight: "500" }}>Since : </span>
                          {instituteDetails?.insSince}
                        </p>
                        <p>
                          <span style={{ fontWeight: "500" }}>
                            Register No :{" "}
                          </span>
                          {instituteDetails?.insRegNo}
                        </p>
                        <p>
                          <span style={{ fontWeight: "500" }}>
                            Affilated By :{" "}
                          </span>{" "}
                          {instituteDetails?.affilatedBy}
                        </p>
                        <p>
                          <span style={{ fontWeight: "500" }}>Email : </span>
                          {instituteDetails?.email}
                        </p>
                        <p>
                          <span style={{ fontWeight: "500" }}>Address : </span>
                          {instituteDetails?.insAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-2 d-md-block d-none">
                  <img className="img-fluid" src="/images/fullMobileNew.png" alt="Mobile Image"/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h2 className=" my-3 pt-md-5 ms-3 ms-0">
          <span className="shadow py-1 px-2 rounded">
            Course Provided By {instituteDetails?.instituteName}
          </span>
        </h2>
        <div className="row">
          {courseList?.map((v, i) => {
            return <CourseCard v={v} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default InstituteDetails;
