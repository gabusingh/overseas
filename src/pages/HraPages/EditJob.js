import React, { useState, useEffect } from "react";
import {
  getSkillsByOccuId,
  getOccupations,
  getCountries,
} from "../../services/info.service";
import Select from "react-select";
import { createJobByHr, getCompanyHrList,editJobByHr } from "../../services/hra.service";
import { getJobById } from "../../services/job.service";
import { useGlobalState } from "../../GlobalProvider";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
// Define form fields and their properties

const EditJob = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [prevJobWages, setPrevJobWages]=useState()
  const [skillList, setSkillList] = useState([]);
  const { globalState, setGlobalState } = useGlobalState();
  const getSkillList = async (id) => {
    try {
      let response = await getSkillsByOccuId(id);
      console.warn(response);
      let skills = response?.skills?.map((item) => ({
        label: item.skill,
        value: item.id,
      }));
      setSkillList(skills);
    } catch (error) {}
  };
  const [countryList, setCountryList] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const getListOfCountry = async () => {
    try {
      let response = await getCountries();
      let country = response.countries.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      let currency = response.countries.map((item) => ({
        label: item.currencyName,
        value: item.currencyName,
      }));
      setCountryList(country);
      setCurrencyList(currency);
    } catch (error) {}
  };
  const [occupations, setOccupations] = useState([]);
  const getOccupationList = async () => {
    try {
      let response = await getOccupations();
      let occupations = response?.occupation?.map((item) => ({
        label: item.occupation,
        value: item.id,
      }));
      setOccupations(occupations);
    } catch (error) {}
  };
  const [hrList, setHrList] = useState([]);
  const handleGetHrList = async () => {
    try {
      let response = await getCompanyHrList(globalState.user.access_token);
      let hr = response?.data?.data?.map((item) => ({
        label: item.hrName,
        value: item.hrName,
        hrContact: item?.hrContact,
        hrEmail: item?.hrEmail,
      }));
      setHrList(hr);
    } catch (error) {}
  };
  const [formData, setFormData] = useState({
    jobTitle: "",
    jobOccupation: "",
    jobSkill: [],
    cmpNameACT: "",
    jobLocationCountry: "",
    jobDeadline: "",
    jobVacancyNo: "",
    jobWages: "",
    jobMode: "",
    jobInterviewPlace: "",
    jobInterviewDate: "",
    jobWagesCurrencyType: "",
    salary_negotiable: "",
    passport_type: "",
    service_charge: "",
    contract_period: "",
    expCerificateReq: "",
    DLReq: "",
    jobWorkVideoReq: "",
    jobExpReq: "",
    jobExpTypeReq: "",
    jobExpDuration: "",
    jobWorkingDay: "",
    jobWorkingHour: "",
    jobOvertime: "",
    jobFood: "",
    jobAccommodation: "",
    jobMedicalFacility: "",
    jobTransportation: "",
    jobAgeLimit: "",
    jobDescription: "",
    jobPhoto: null,
    companyJobID: "",
    languageRequired: [],
    jobArea: "",
  });
  const getSkillInText = (skill)=>{
    let string =""
    for(let i=0; i<skill.length; i++){
      string = string+skill[i].skill + " "
    }
    return(string)
  }
  
  const handleSetFormData = async (id) => {
    try {
      let response = await getJobById(id);
      const jobDetails = response?.data?.jobs
      setPrevJobWages(jobDetails?.jobWages)
      setFormData({
        jobTitle: jobDetails.jobTitle,
        jobOccupation: jobDetails.jobOccupation,
        jobSkill: getSkillInText(jobDetails?.skills),
        cmpNameACT: jobDetails.cmpName,
        jobLocationCountry: jobDetails?.jobLocationCountry?.name,
        jobDeadline: jobDetails?.jobDeadline,
        jobVacancyNo:jobDetails?.jobVacancyNo,
        jobWages: jobDetails?.jobWages,
        jobMode: jobDetails?.jobMode,
        jobInterviewPlace: jobDetails?.jobInterviewPlace,
        jobInterviewDate: jobDetails?.jobInterviewDate,
        jobWagesCurrencyType: jobDetails?.jobWagesCurrencyType,
        salary_negotiable: jobDetails?.salary_negotiable,
        passport_type: jobDetails?.passport_type,
        service_charge: jobDetails?.service_charge,
        contract_period: jobDetails?.contract_period,
        expCerificateReq: jobDetails?.expCerificateReq,
        DLReq: jobDetails?.DLReq,
        jobWorkVideoReq: jobDetails?.jobWorkVideoReq,
        jobExpReq: jobDetails?.jobExpReq,
        jobExpTypeReq: jobDetails?.jobExpTypeReq,
        jobExpDuration: jobDetails?.jobExpDuration,
        jobWorkingDay: jobDetails?.jobWorkingDay,
        jobWorkingHour: jobDetails?.jobWorkingHour,
        jobOvertime: jobDetails?.jobOvertime,
        jobFood: jobDetails?.jobFood,
        jobAccommodation: jobDetails?.jobAccommodation,
        jobMedicalFacility: jobDetails?.jobMedicalFacility,
        jobTransportation: jobDetails?.jobTransportation,
        jobAgeLimit: jobDetails?.jobAgeLimit,
        jobDescription: jobDetails?.jobDescription,
        jobPhoto: null,
        companyJobID: jobDetails?.companyJobID,
        jobArea: jobDetails?.jobArea,
        languageRequired:jobDetails?.languageRequired
      });
    } catch (error) {}
  };
  useEffect(() => {
    getOccupationList();
    getListOfCountry();
    handleGetHrList();

    handleSetFormData(params.id);
  }, []);

  useEffect(() => {
    getSkillList(formData?.jobOccupation);
  }, [formData?.jobOccupation]);

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
    // condition to call setHr
    if (name == "hrName") {
      setHrDetails(value);
    }
  };

  const [errors, setErrors] = useState({});
  const formValidation = () => {
    const errors = {};

    // Validate required fields
    if (!formData.jobTitle.trim()) errors.jobTitle = "Job Title is required";
    if (!formData.jobOccupation)
      errors.jobOccupation =
        "Job Occupation is required and must be an integer";
    if (formData.jobSkill.length == 0)
      errors.jobSkill = "Job Skill is required";
    if (
      !formData.jobLocationCountry.trim() ||
      formData.jobLocationCountry.length > 100
    )
      errors.jobLocationCountry =
        "Job Location Country is required and must be less than 100 characters";
    if (!formData.jobDeadline.trim() || formData.jobDeadline.length > 100)
      errors.jobDeadline =
        "Job Deadline is required and must be less than 100 characters";
    if (!formData.jobVacancyNo.trim() || formData.jobVacancyNo.length > 100)
      errors.jobVacancyNo =
        "Job Vacancy Number is required and must be less than 100 characters";
    if (
      !formData.jobWagesCurrencyType.trim() ||
      formData.jobWagesCurrencyType.length > 100
    )
      errors.jobWagesCurrencyType =
        "Wages Currency Type is required and must be less than 100 characters";
    if (
      !formData.salary_negotiable.trim() ||
      formData.salary_negotiable.length > 100
    )
      errors.salary_negotiable =
        "Salary Negotiable Status is required and must be less than 100 characters";
    if (!formData.passport_type.trim() || formData.passport_type.length > 100)
      errors.passport_type =
        "Passport Type is required and must be less than 100 characters";
    if (
      !formData.contract_period.trim() ||
      formData.contract_period.length > 100
    )
      errors.contract_period =
        "Contract Period is required and must be less than 100 characters";
    if (!formData.jobExpReq.trim() || formData.jobExpReq.length > 100)
      errors.jobExpReq =
        "Job Experience Required is required and must be less than 100 characters";
    if (!formData.jobWorkingDay.trim() || formData.jobWorkingDay.length > 100)
      errors.jobWorkingDay =
        "Job Working Day is required and must be less than 100 characters";
    if (!formData.jobWorkingHour.trim() || formData.jobWorkingHour.length > 100)
      errors.jobWorkingHour =
        "Job Working Hour is required and must be less than 100 characters";
    if (!formData.jobOvertime.trim() || formData.jobOvertime.length > 100)
      errors.jobOvertime =
        "Job Overtime is required and must be less than 100 characters";
    if (!formData.jobFood.trim() || formData.jobFood.length > 100)
      errors.jobFood =
        "Food Provision is required and must be less than 100 characters";
    if (
      !formData.jobAccommodation.trim() ||
      formData.jobAccommodation.length > 100
    )
      errors.jobAccommodation =
        "Accommodation is required and must be less than 100 characters";
    if (
      !formData.jobMedicalFacility.trim() ||
      formData.jobMedicalFacility.length > 100
    )
      errors.jobMedicalFacility =
        "Medical Facility is required and must be less than 100 characters";
    if (
      !formData.jobTransportation.trim() ||
      formData.jobTransportation.length > 100
    )
      errors.jobTransportation =
        "Transportation is required and must be less than 100 characters";
    if (!formData.jobAgeLimit.trim() || formData.jobAgeLimit.length > 100)
      errors.jobAgeLimit =
        "Age Limit is required and must be less than 100 characters";
    if (formData.jobDescription && formData.jobDescription.length > 500)
      errors.jobDescription =
        "Job Description must be less than 500 characters";
    if (
      formData.jobPhoto &&
      !["image/jpeg", "image/png"].includes(formData.jobPhoto.type)
    )
      errors.jobPhoto = "Job Photo must be a jpg or png image";
    if (formData.jobPhoto && formData.jobPhoto.size > 2048 * 1024)
      errors.jobPhoto = "Job Photo must be less than 2MB";
    

    // Additional nullable fields
    if (formData.cmpNameACT && formData.cmpNameACT.length > 100)
      errors.cmpNameACT = "Company Name must be less than 100 characters";
    if (formData.service_charge && formData.service_charge.length > 100)
      errors.service_charge = "Service Charge must be less than 100 characters";
    if (formData.expCerificateReq && formData.expCerificateReq.length > 100)
      errors.expCerificateReq =
        "Experience Certificate Required must be less than 100 characters";
    if (formData.DLReq && formData.DLReq.length > 100)
      errors.DLReq =
        "Driver's License Required must be less than 100 characters";
    if (
      formData.jobFullProfileCVReq &&
      formData.jobFullProfileCVReq.length > 100
    )
      errors.jobFullProfileCVReq =
        "Full Profile CV Required must be less than 100 characters";
    if (formData.jobWorkVideoReq && formData.jobWorkVideoReq.length > 100)
      errors.jobWorkVideoReq =
        "Work Video Required must be less than 100 characters";
    if (formData.jobExpTypeReq && formData.jobExpTypeReq.length > 100)
      errors.jobExpTypeReq =
        "Job Experience Type must be less than 100 characters";
    if (formData.jobExpDuration && formData.jobExpDuration.length > 100)
      errors.jobExpDuration =
        "Job Experience Duration must be less than 100 characters";
    if (formData.hrName && formData.hrName.length > 100)
      errors.hrName = "HR Name must be less than 100 characters";
    if (formData.hrEmail && !/^\S+@\S+\.\S+$/.test(formData.hrEmail))
      errors.hrEmail = "HR Email must be a valid email address";
    if (formData.hrNumber && formData.hrNumber.length > 100)
      errors.hrNumber = "HR Number must be less than 100 characters";
    if (formData.companyJobID && formData.companyJobID.length > 100)
      errors.companyJobID = "Company Job ID must be less than 100 characters";
    if (formData.jobArea && formData.jobArea.length > 100)
      errors.jobArea = "Job Area must be less than 100 characters";
    if (!(formData.jobAgeLimit >= 18 && formData.jobAgeLimit < 61)) {
      errors.jobAgeLimit = "Age must be between 18 to 60 years.";
    }
    if (formData.jobInterviewPlace && formData.jobInterviewPlace.length > 50) {
      errors.jobInterviewPlace = "Place name must be less than 50 char ";
    }
    if(formData?.jobWages<prevJobWages){
      errors.jobWages = "You can not decrese the salary ";
    }
    setErrors(errors);
    return Object.keys(errors).length === 0 ? true : errors;
  };

  const handleSubmit = async () => {
    const validationErrors = formValidation();
    if (validationErrors === true) {
      const createFormData = new FormData();
      // Append form data to FormData object
      createFormData.append("jobTitle", formData.jobTitle);
      createFormData.append("cmpNameACT", formData.cmpNameACT);
      createFormData.append("jobDeadline", formData.jobDeadline);
      createFormData.append("jobVacancyNo", formData.jobVacancyNo);
      createFormData.append("jobWages", formData.jobWages);
      createFormData.append("jobMode", formData.jobMode);
      createFormData.append("jobInterviewPlace", formData.jobInterviewPlace);
      createFormData.append("jobInterviewDate", formData.jobInterviewDate);
      createFormData.append("languageRequired", formData.languageRequired);
      createFormData.append(
        "jobWagesCurrencyType",
        formData.jobWagesCurrencyType
      );
      createFormData.append("salary_negotiable", formData.salary_negotiable);
      createFormData.append("passport_type", formData.passport_type);
      createFormData.append("service_charge", formData.service_charge);
      createFormData.append("contract_period", formData.contract_period);
      createFormData.append("expCerificateReq", formData.expCerificateReq);
      createFormData.append("DLReq", formData.DLReq);
      createFormData.append("jobWorkVideoReq", formData.jobWorkVideoReq);
      createFormData.append("jobExpReq", formData.jobExpReq);
      createFormData.append("jobExpTypeReq", formData.jobExpTypeReq);
      createFormData.append("jobExpDuration", formData.jobExpDuration);
      createFormData.append("jobWorkingDay", formData.jobWorkingDay);
      createFormData.append("jobWorkingHour", formData.jobWorkingHour);
      createFormData.append("jobOvertime", formData.jobOvertime);
      createFormData.append("jobFood", formData.jobFood);
      createFormData.append("jobAccommodation", formData.jobAccommodation);
      createFormData.append("jobMedicalFacility", formData.jobMedicalFacility);
      createFormData.append("jobTransportation", formData.jobTransportation);
      createFormData.append("jobAgeLimit", formData.jobAgeLimit);
      createFormData.append("jobDescription", formData.jobDescription);

      // Append job photo if it's selected
      if (formData.jobPhoto) {
        createFormData.append("jobPhoto", formData.jobPhoto);
      }

      
      createFormData.append("companyJobID", formData.companyJobID);

      
      createFormData.append("jobArea", formData.jobArea);
      try {
        let response = await editJobByHr(
          
          globalState?.user?.access_token,
          createFormData,
          params.id
        );
        if (response.data.message == "Job updated successfully") {
          toast.success("Job updated successfully");
          setFormData({
            jobTitle: "",
            jobOccupation: "",
            jobSkill: [],
            cmpNameACT: "",
            jobLocationCountry: "",
            jobDeadline: "",
            jobVacancyNo: "",
            jobWages: "",
            jobMode: "",
            jobInterviewPlace: "",
            jobInterviewDate: "",
            jobWagesCurrencyType: "",
            salary_negotiable: "",
            passport_type: "",
            service_charge: "",
            contract_period: "",
            expCerificateReq: "",
            DLReq: "",
            jobWorkVideoReq: "",
            jobExpReq: "",
            jobExpTypeReq: "",
            jobExpDuration: "",
            jobWorkingDay: "",
            jobWorkingHour: "",
            jobOvertime: "",
            jobFood: "",
            jobAccommodation: "",
            jobMedicalFacility: "",
            jobTransportation: "",
            jobAgeLimit: "",
            jobDescription: "",
            jobPhoto: null,
            hrName: "",
            hrEmail: "",
            hrNumber: "",
            companyJobID: "",
            languageRequired: [],
            jobArea: "",
          });
          setTimeout(() => {
            navigate("/hra-jobs");
          }, 1500);
        } else {
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
    { name: "jobTitle", label: "Job Title", type: "text", readOnly:true },
    {
      name: "jobOccupation",
      label: "Job Department",
      type: "text",
      readOnly:true
    },
    {
      name: "jobSkill",
      label: "Job Skill (Multiple)",
      type: "text",
      readOnly:true
    },
    { name: "cmpNameACT", label: "Actual Hiring Company", type: "text",readOnly:true },
    {
      name: "jobMode",
      label: "Interview Mode",
      type: "select",
      options: [
        { label: "Select Mode", value: "" },
        { label: "CV Selection", value: "CV Selection" },
        { label: "Client Interview", value: "Offline" },
        { label: "Online Interview", value: "Online" },
      ],
    },
    { name: "jobInterviewDate", label: "Interview Date", type: "date" },
    { name: "jobInterviewPlace", label: "Interview Place", type: "text" },
    {
      name: "jobLocationCountry",
      label: "Job Location Country",
      type: "text",
      readOnly:true
      
    },
    { name: "jobArea", label: "Job Location City", type: "text", readOnly:true},
    { name: "jobDeadline", label: "Job Deadline", type: "date" },
    { name: "jobVacancyNo", label: "Number Of Vacancy", type: "number" },
    { name: "jobWages", label: "Wages per month", type: "number" },
    {
      name: "jobWagesCurrencyType",
      label: "Wages Currency Type",
      type: "select",
      options: [{ label: "Select Country", value: "" }, ...currencyList],
    },
    {
      name: "salary_negotiable",
      label: "Salary Negotiable",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes ", value: "Yes" },
        { label: "No ", value: "No" },
      ],
    },
    {
      name: "passport_type",
      label: "Passport Type",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "ECR ", value: "ECR" },
        { label: "ECNR ", value: "ECNR" },
        { label: "ECR/ECNR", value: "ECR/ECNR" },
      ],
    },
    {
      name: "service_charge",
      label: "Service Charge (in INR)",
      type: "text",
    },
    {
      name: "contract_period",
      label: "Contract Period (in months)",
      type: "number",
      readOnly:true
    },
    {
      name: "expCerificateReq",
      label: "Experience Certificate Required",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes ", value: "Yes" },
        { label: "No ", value: "No" },
      ],
    },
    {
      name: "jobWorkVideoReq",
      label: "Work Video Required",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes ", value: "Yes" },
        { label: "No ", value: "No" },
      ],
    },
    {
      name: "jobExpReq",
      label: "Job Experience Required",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes ", value: "Yes" },
        { label: "No ", value: "No" },
      ],
    },
    {
      name: "jobExpTypeReq",
      label: "Experience Required within India/International",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Within India", value: "national" },
        { label: "International", value: "international" },
        { label: "India/International", value: "Any" },
      ],
    },
    {
      name: "jobExpDuration",
      label: "Year of Experience required",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "1 year of Experience", value: "1" },
        { label: "2 year of Experience", value: "2" },
        { label: "3 year of Experience", value: "3" },
        { label: "4 year of Experience", value: "4" },
        { label: "5 year of Experience", value: "5" },
        { label: "6 year of Experience", value: "6" },
        { label: "7 year of Experience", value: "7" },
        { label: "8 year of Experience", value: "8" },
        { label: "9 year of Experience", value: "9" },
        { label: "10 year of Experience", value: "10" },
      ],
    },
    {
      name: "DLReq",
      label: "Driving License Required",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Indian", value: "Indian" },
        { label: "International", value: "International" },
        {
          label: "Both Indian and International",
          value: "Both Indian and International",
        },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobWorkingDay",
      label: "Job Working Day Per Month",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "20", value: "20" },
        { label: "21", value: "21" },
        { label: "22", value: "22" },
        { label: "23", value: "23" },
        { label: "24", value: "24" },
        { label: "25", value: "25" },
        { label: "26", value: "26" },
        { label: "27", value: "27" },
        { label: "28", value: "28" },
        { label: "29", value: "29" },
        { label: "30", value: "30" },
      ],
    },
    { name: "jobWorkingHour", label: "Job Working Hour", type: "text" },

    {
      name: "jobOvertime",
      label: "Job Overtime",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Fixed OT", value: "Yes" },
        {
          label: "As Per Company Requirement",
          value: "As Per Company Requirement",
        },
        { label: "No OT", value: "No" },
      ],
    },
    {
      name: "jobFood",
      label: "Food",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Free Food", value: "Yes" },
        { label: "Food Allownce", value: "Food Allownce" },
        { label: "No Food", value: "No" },
      ],
    },
    {
      name: "jobAccommodation",
      label: "Accommodation",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobMedicalFacility",
      label: "Medical Facility",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobTransportation",
      label: "Free Work Transportation",
      type: "select",
      options: [
        { label: "Select ", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    { name: "jobAgeLimit", label: "Age Limit", type: "number" },
    
    { name: "companyJobID", label: "Company Job ID", type: "text" },
    
    { name: "jobDescription", label: "Job Description", type: "textarea" },
    { name: "jobPhoto", label: "Job Photo", type: "file" },
  ];
  const setHrDetails = (name) => {
    const hrDetails = hrList?.filter((v, i) => {
      return v.value == name;
    });
    if (hrDetails.length > 0) {
      setFormData({
        ...formData,
        hrEmail: hrDetails[0].hrEmail,
        hrNumber: hrDetails[0]?.hrContact,
      });
    } else {
      setFormData({
        ...formData,
        hrEmail: "",
        hrNumber: "",
      });
    }
  };

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
              <span className="text-light">Edit Job</span>
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
                      return <option value={v?.value} selected={formData[field.name]== v?.value}>{v.label}</option>;
                    })}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    className="form-control"
                    value={formData[field.name]}
                    onChange={handleOnChange}
                  />
                ) : field.type === "file" ? (
                  <input
                    type="file"
                    name={field.name}
                    className="form-control"
                    onChange={handleOnChange}
                  />
                ) : field.type === "multiple" ? (
                  <Select
                    isMulti={true}
                    options={field.options}
                    onChange={(e) => {
                      // Map the selected options to extract their values
                      const selectedValues = e.map((v) => v.value);
                      // Set the formData correctly by updating the field name's value
                      setFormData({
                        ...formData, // Spread the existing formData
                        [field.name]: selectedValues, // Update the specific field with the selected values
                      });
                    }}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    className="form-control"
                    value={
                      field.type !== "number" ?  formData[field.name] : formData[field.name]
                    }
                    style={{background:field.readOnly ?  "whitesmoke" : "white"}}
                    readOnly={field.readOnly}
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
              Update
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditJob;
