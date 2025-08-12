import React, { useState, useEffect } from "react";
import {
  getCountryCode,
  getSkillsByOccuId,
  getState,
  getDistrict,
  getPs,
  getOccupations,
  getPanchayat,
  getVillage,
  getCountries,
} from "../../services/info.service";
import Select from "react-select";
import { createBulkHiringRequest, getCompanyHrList } from "../../services/hra.service";
import { useGlobalState } from "../../GlobalProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { hraPostedJobs } from "../../services/hra.service";
import moment from 'moment';
// Define form fields and their properties

const BulkHire = () => {
  const navigate = useNavigate()
  const { globalState, setGlobalState } = useGlobalState();
  const [loader, setLoader]=useState()
  const [jobList, setJobList]=useState([]);
  const getJobsPostedByHra = async () => {
    const today = moment();
    setLoader(true)
    try {
      let response = await hraPostedJobs(globalState?.user.access_token, {});
      let jobs = response.data?.data.jobs.filter((v)=>{
          return moment(v.jobDeadline).isAfter(today);
      }).map((item) => ({
        label: item.jobTitle,
        value: item.id,
      }));
      setJobList(jobs)
      setLoader(false)
    } catch (error) {}
  };
  useEffect((v, i)=>{
    getJobsPostedByHra()
  },[])

  const [formData, setFormData] = useState({
    jobId: "",
    interviewer: "",
    totalVacancy: "",
    hiringDeadline: "",
    interviewQuestion: "",
  });

 

  const handleOnChange = (e) => {
    const { name, value, type, files } = e.target;
    // Handle file input separately
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files[0] || null,
      }));
    } else if (type === "select-one") {
      // Handle select input
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      // Handle other input types (text, number, etc.)
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
    }));
  }
};

  const [errors, setErrors] = useState({});
  const formValidation = () => {
    const errors = {};

    // Validate required fields
    if (!formData.jobId) errors.jobId = "Job title is required";
    if (!formData.interviewer)
      errors.interviewer =
        "Interviewer is required field";
    if (!formData.totalVacancy)
      errors.totalVacancy = "Total vacancy is required field";
    if (!formData.hiringDeadline)
      errors.hiringDeadline = "Hiring deadline is required field";
    if (!formData.hiringDeadline || moment(formData.hiringDeadline).isBefore(moment().add(14, 'days'))) {
      errors.hiringDeadline = "Hiring deadline must be at least 15 days later";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0 ? true : errors;
  };

  const handleSubmit = async () => {
    const validationErrors = formValidation();
    if (validationErrors === true) {
      const createFormData = new FormData();
      // Append form data to FormData object
      createFormData.append("jobId", formData.jobId);
      createFormData.append("interviewer", formData.interviewer);
      createFormData.append("totalVacancy", formData.totalVacancy);
      createFormData.append("hiringDeadline", formData.hiringDeadline);
      // Append job interviewQuestion if it's selected
      if (formData.interviewQuestion && formData.interviewer=='overseas') {
        createFormData.append("interviewQuestion", formData.interviewQuestion);
      }
      try {
        let response = await createBulkHiringRequest(
          globalState?.user?.access_token,
          createFormData
        );
        if(response.data.message=="Bulk Hiring Request Created"){
          toast.success("Bulk Hiring Request Created");
          setFormData({
            jobId: "",
            interviewer:'',
            totalVacancy:'',
            hiringDeadline:'',
            interviewQuestion:''
          })
          setTimeout(()=>{
            navigate("/hra-dashboard")
          },1500)
        }else{
          toast.error("Internal Server Error");
        }
      } catch (error) {
        toast.error("Internal Server Error");
      }
    } else {
      toast.error("Form Validation Failed");
      console.log("Validation errors:", validationErrors);
    }
  };
  const formFields = [
    { name: "jobId", label: "Please select a job", type: "select", options: [{ label: "Select Department", value: "" }, ...jobList] },
    { name: "interviewer", label: "Interviwer", type: "select", options: [{ label: "Select ", value: "" },{ label: "By your client", value: "client" },{ label: "By overseas.ai team", value: "overseas" } ] },
    { name: "hiringDeadline", label: "Hiring Deadline (Minimum 15 days later) *", type: "date" },
    { name: "totalVacancy", label: "Numbber of Vacancy *", type: "number" }, 
    ...(formData.interviewer === "overseas"
      ? [
          {
            name: "interviewQuestion",
            label: "Upload Interview questions *",
            type: "file",
          },
        ]
      : []),
  ];
  
  
  return (
    <div className="container mt-5">
      <div className="mt-md-5 py-md-5 mb-5">
      <div className="d-flex my-5 pt-md-5" style={{ cursor: "pointer" }}>
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
            navigate("/hra-dashboard");
          }}
        >
          <i className="fa textBlue fa fa-suitcase me-2"></i>
          <span className="textBlue">Dashboard</span>
        </div>
        <div className="p-2 bgBlue px-md-4 px-3 borderRadiusLeft20">
          <i className="fa fa-suitcase text-light me-2"></i>
          <span className="text-light">Request Bulk Hiring</span>
        </div>
      </div>
    </div>
        <div className="row">
          {formFields.map((field) => (
            <div className="col-6  " key={field.name}>
              <div className="shadow-sm my-3 border rounded p-2 pb-4">
                <label className="mb-1 ms-1" style={{ fontWeight: "500" }}>
                  {field.label}
                </label>
                {field.type == "select" ? (
                  <select
                    className="form-control"
                    name={field.name}
                    value={formData.name}
                    onChange={handleOnChange}
                  >
                    {field?.options?.map((v) => {
                      return <option value={v?.value}>{v.label}</option>;
                    })}
                  </select>
                ) : field.type === "file" ? (
                  <input
                    type="file"
                    name={field.name}
                    className="form-control"
                    accept=".pdf" 
                    onChange={handleOnChange}
                  />
                )  : (
                  <input
                    type={field.type}
                    name={field.name}
                    className="form-control"
                    value={
                      field.type !== "number" ? formData[field.name] : undefined
                    }
                    onChange={handleOnChange}
                  />
                )}
                {errors[field.name] && (
                  <div className="text-danger mt-1">{errors[field.name]}</div>
                )}
              </div>
            </div>
          ))}
          <div className="col-12">
            <button
              className="btn btn-primary mt-5 w-100"
              onClick={handleSubmit}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BulkHire;
