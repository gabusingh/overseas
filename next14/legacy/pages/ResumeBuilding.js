import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { Helmet } from "react-helmet";
import {
  getResumeOtp,
  verifyOtpForResumeUser,
  updateResumeApi,
  updateResumeExperience,
  updateResumeLicence,
  updatePassport,
} from "../services/resume.service";
const languageOption = [
  { label: "Bengali", value: "Bengali" },
  { label: "Assamese", value: "Assamese" },
  { label: "Hindi", value: "Hindi" },
  { label: "Marathi", value: "Marathi" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Oriya", value: "Oriya" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Urdu", value: "Urdu" },
  { label: "Arabic", value: "Arabic" },
  { label: "English", value: "English" },
  { label: "Japanese", value: "Japanese" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
];
const highestEducationArr = [
  {
    label: "Primary Education (below class 8)",
    value: "Primary Education (below class 8)",
  },
  {
    label: "Middle education (class 8 and above but below class 10)",
    value: "Middle education (class 8 and above but below class 10)",
  },
  { label: "Secondary Education", value: "Secondary Education" },
  { label: "Higher Secondary Education", value: "Higher Secondary Education" },
  { label: "Graduate", value: "Graduate" },
  { label: "Post Graduate", value: "Post Graduate" },
];
const vocationalEduArr = [
  { label: "ITI", value: "ITI" },
  { label: "Polytechnic", value: "Polytechnic" },
  { label: "Graduate in Engineering", value: "Graduate in Engineering" },
  {
    label: "Any other Vocational Training (one year or above)",
    value: "Any other Vocational Training (one year or above)",
  },
  {
    label: "Any other Vocational Training (less than one year)",
    value: "Any other Vocational Training (less than one year)",
  },
  { label: "Not applicable", value: "Not applicable" },
];
function ResumeBuilding() {
  const navigate = useNavigate();
  const downloadPDF = () => {
    const input = document.getElementById("resume-content");
    html2canvas(input, { useCORS: true }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");
    });
  };
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const img = new Image();
    img.src = "/images/templetBackground.jpeg";
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, []);

  const [showPersonalDetails, setShowPersonalDetails] = useState(false);
  const [showWorkDetails, setShowWorkDetails] = useState(false);
  const [showEducationDetails, setShowEducationDetails] = useState(false);
  const [showAddressDetails, setShowAddressDetails] = useState(false);
  const [showMoreOption, setShowMoreOption] = useState(false);
  const [showLicencePop, setShowLicencePop] = useState(false);
  const [showVerificationPop, setShowVerificationPop] = useState(
    sessionStorage.getItem("resumeUser") ? false : true
  );

  // user details
  const [loginForm, setLoginForm] = useState({
    name: "",
    contact: "",
    otp: "",
  });
  const [userDetails, setUserDetails] = useState(
    JSON.parse(sessionStorage.getItem("resumeUser"))
  );
  const [passportDetails, setPassportDetails] = useState(
    sessionStorage.getItem("resumePassport") && JSON.parse(sessionStorage.getItem("resumePassport"))[0]
  );
  const [experienceArr, setExperienceArr] = useState(
     JSON.parse(sessionStorage.getItem("resumeExperience"))
  );
  const [licenceArr, setLicenceArr] = useState(
    JSON.parse(sessionStorage.getItem("resumeLicence"))
  );
  // const [passportDetails, setPassportDetails] = useState({
  //   passportNo: "",
  //   passportCategory: "",
  //   issueDate: "",
  //   expiryDate: "",
  //   image: "",
  // });
  const [showOtpInp, setShowOtpInp] = useState(false);
  const getOptFunc = async () => {
    try {
      let response = await getResumeOtp(loginForm);
      console.log(response);
      if (response.data.msg == "Otp Sent Successfully.") {
        setShowOtpInp(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const verifyOptFunc = async () => {
    try {
      let response = await verifyOtpForResumeUser(loginForm);
      console.log(response);
      if (response.data.user) {
        sessionStorage.setItem(
          "resumeUser",
          JSON.stringify(response?.data?.user)
        );
        sessionStorage.setItem(
          "resumeExperience",
          JSON.stringify(response?.data?.experiences)
        );
        sessionStorage.setItem(
          "resumePassport",
          JSON.stringify(response?.data?.passports)
        );
        sessionStorage.setItem(
          "resumeLicence",
          JSON.stringify(response?.data?.licences)
        );
        setShowVerificationPop(false);
        setUserDetails(response?.data?.user);
        setPassportDetails(response?.data?.passports);
        setExperienceArr(response?.data?.experiences)
        setLicenceArr(response?.data?.licences);
        setTimeout(()=>{
          window.location.reload()
        },500)
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [languageKnown, setLanguageKnow] = useState([]);

  // update resume
  const updateResume = async () => {
    try {
      const formData = new FormData();
      // formData.append("photo", userDetails.photo);
      formData.append("profileTitle", userDetails.profileTitle);
      formData.append("dob", userDetails.dob);
      formData.append("gender", userDetails.gender);
      formData.append("maritalStatus", userDetails.maritalStatus);
      formData.append("languageKnown", JSON.stringify(languageKnown));
      formData.append("highEdu", userDetails.highEdu);
      formData.append("highEduYear", userDetails.highEduYear);
      formData.append("techEdu", userDetails.techEdu);
      formData.append("techEduYear", userDetails.techEduTear);
      formData.append("state", userDetails.state);
      formData.append("district", userDetails.district);
      formData.append("village", userDetails.village);
      formData.append("panchayat", userDetails.panchayat);
      if(userDetails.email){
        formData.append("email", userDetails.email);
      }
      formData.append("ps", userDetails.ps);
      formData.append("id", userDetails.id);
      let response = await updateResumeApi(formData);
      if (response?.message == "Data updated successfully") {
        setUserDetails(response?.user);
        setShowPersonalDetails(false);
        setShowAddressDetails(false);
        sessionStorage.setItem("resumeUser", JSON.stringify(response?.user));
        sessionStorage.setItem(
          "resumeExperience",
          JSON.stringify(response?.experiences)
        );
        sessionStorage.setItem(
          "resumePassport",
          JSON.stringify(response?.passports)
        );
        sessionStorage.setItem(
          "resumeLicence",
          JSON.stringify(response?.licences)
        );
      }
    } catch (error) {}
  };

  const [experienceDetails, setExperienceDetails] = useState({
    userId: "",
    organisationName: "",
    designation: "",
    jobType: "",
    type: "",
    country: "",
    state: "",
    joiningDate: "",
    leavingDate: "",
    isWorking: "",
    image: "",
  });
  const [licenceDetails, setLicenceDetails] = useState({
    licenceName: "",
    licenceImage: "",
  });
  const addResumeExperience = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userDetails.id);
      formData.append("organisationName", experienceDetails.organisationName);
      formData.append("designation", experienceDetails.designation);
      formData.append("jobType", experienceDetails.jobType);
      formData.append("type", experienceDetails.type);
      formData.append("country", experienceDetails.country);
      formData.append("state", experienceDetails.state);
      formData.append("joiningDate", experienceDetails.joiningDate);
      formData.append("leavingDate", experienceDetails.leavingDate);
      formData.append("isWorking", experienceDetails.isWorking ? 1 : 0);
      formData.append("image", experienceDetails.image);

      let response = await updateResumeExperience(formData);
      console.log(response);
    } catch (error) {}
  };
  const addResumeLicence = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userDetails.id);
      formData.append("licenceName", licenceDetails.licenceName);
      formData.append("licenceImage", licenceDetails.licenceImage);

      let response = await updateResumeLicence(formData);
      console.log(response);
    } catch (error) {}
  };
  const [showPassportDetails, setShowPassportDetails] = useState(false);

  const handleUpdatePassport = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", userDetails.id);
      formData.append("passportNo", passportDetails.passportNo);
      formData.append("passportCategory", passportDetails.passportCategory);
      formData.append("issueDate", passportDetails.issueDate);
      formData.append("expiryDate", passportDetails.expiryDate);
      formData.append("image", passportDetails.image);
      let response = await updatePassport(formData);
      if (response.message == "Data updated successfully") {
        setShowPassportDetails(false);
      }
    } catch (error) {}
  };
  return (
    <><Helmet>
    <title>Overseas Jobs Resume: Building for Your Dream Career</title>
    <meta
      name="description"
      content="Transform your resume for overseas job applications . Increase your visibility to employers and take the next step in your global career."
    />
    <meta name="keywords" content="resume format for overseas job" />
  </Helmet>
  <div className="">
      <div className="mt-5 pt-5">
        <div className="container mt-5 pt-5">
          <div className="row">
            <div className="col-lg-3 row">
              <div className="col-12">
                <div
                  className="shadow-sm mb-3 rounded border"
                  onClick={() => {
                    setShowPersonalDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="p-4 mb-0">
                    <i className="fa fa-user me-1"></i> Personal Details
                  </h5>
                </div>
                <div
                  className="shadow-sm mb-3 rounded border"
                  onClick={() => {
                    setShowWorkDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="p-4 mb-0">
                    <i className="fa fa-suitcase me-1"></i> Work Experience
                  </h5>
                </div>
                <div
                  className="shadow-sm mb-3 rounded border"
                  onClick={() => {
                    setShowEducationDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="p-4 mb-0">
                    <i className="fa fa-graduation-cap me-1"></i> Education
                  </h5>
                </div>
                <div
                  className="shadow-sm mb-3 rounded border"
                  onClick={() => {
                    setShowAddressDetails(true);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <h5 className="p-4 mb-0">
                    <i className="fa fa-address-card me-1"></i> Address
                  </h5>
                </div>
                <div
                  className="shadow-sm mb-3 rounded border"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowMoreOption(!showMoreOption)}
                >
                  <h5 className="p-4 mb-0">
                    <i className="fa fa-file me-1"></i> Add More Section
                    <i
                      className={
                        (!showMoreOption
                          ? " fa-caret-down"
                          : " fa fa-caret-up") + " fa  ms-3"
                      }
                    ></i>
                  </h5>
                  {showMoreOption && (
                    <div className="ms-5 ">
                      <h5
                        className="text-secondary  mb-3"
                        onClick={() => setShowPassportDetails(true)}
                      >
                        Passport
                      </h5>
                      <h5
                        className="text-secondary mb-3"
                        onClick={() => setShowLicencePop(true)}
                      >
                        License
                      </h5>
                      <h5 className="text-secondary mb-3">Award</h5>
                      <h5 className="text-secondary mb-3">Hobby</h5>
                    </div>
                  )}
                </div>
                <div className="mb-3 mt-3">
                  <button className="btn btn-primary" onClick={downloadPDF}>
                    Download as PDF
                  </button>
                </div>
              </div>
            </div>
            <div
              className="col-lg-9 rounded border mb-5"
              id="resume-content"
              style={{
                backgroundImage: "url(/images/templetBackground.jpeg)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                height: imageDimensions?.height,
              }}
            >
              <div className="px-2 py-5">
                {/* heading start */}
                <div className="d-flex justify-content-between ">
                  <div className="d-flex align-items-center">
                    <div>
                      <img
                        style={{
                          height: "150px",
                          width: "150px",
                          borderRadius: "50%",
                        }}
                        className="border shadow-lg"
                        src={userDetails?.photo}
                        alt="Profile Image"
                      />
                    </div>
                    <div className="ms-3">
                      <h2 className="mb-0">{userDetails?.name}</h2>
                      <h5>{userDetails?.profileTitle}</h5>
                    </div>
                  </div>
                  {/* <div className="">
                    <img
                      src="/images/appQR.png"
                      style={{ height: "150px", width: "150px" }}
                    />
                  </div> */}
                </div>
                {/* heading end */}

                {/* body start */}
                <div className="row">
                  <div className="col-6">
                    <div className=" mt-5">
                      {/* address start */}
                      <div className="d-flex align-items-center">
                        <div
                          style={{ height: "20px", width: "4px" }}
                          className="bgBlue"
                        ></div>
                        <div>
                          <h4 className="mb-0 ms-1 textBlue">
                            Address & Contact Details
                          </h4>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="mb-1">
                          Village - {userDetails?.village}
                        </h5>
                        <h5 className="mb-1">P.S - {userDetails?.ps}</h5>
                        <h5 className="mb-1">Dist - {userDetails?.district}</h5>
                        <h5 className="mb-1">State - {userDetails?.state}</h5>
                        <h5 className="mb-1">
                          Phone Number : +91 {userDetails?.contact}
                        </h5>
                        <h5 className="mb-1">Email : {userDetails?.email}</h5>
                      </div>

                      {/* address end */}
                    </div>
                    <div className=" mt-5">
                      {/* address start */}
                      <div className="d-flex align-items-center">
                        <div
                          style={{ height: "20px", width: "4px" }}
                          className="bgBlue"
                        ></div>
                        <div>
                          <h4 className="mb-0 ms-1 textBlue">Personal Info</h4>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="mb-1">Dob : {userDetails?.dob}</h5>
                        <h5 className="mb-1">Gender : {userDetails?.gender}</h5>
                        <h5 className="mb-1">
                          Language Known :{" "}
                          {userDetails && userDetails?.languageKnown  &&
                            JSON.parse(userDetails?.languageKnown).map(
                              (v, i) => {
                                return v + "  ";
                              }
                            )}
                        </h5>
                        <h5 className="mb-1">
                          Marital Status : {userDetails?.maritalStatus}
                        </h5>
                      </div>

                      {/* address end */}
                    </div>
                    <div className=" mt-5">
                      {/* address start */}
                      <div className="d-flex align-items-center">
                        <div
                          style={{ height: "20px", width: "4px" }}
                          className="bgBlue"
                        ></div>
                        <div>
                          <h4 className="mb-0 ms-1 textBlue">
                            Educational Info
                          </h4>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="mb-2">
                        {userDetails?.highEdu && "✔"}  {userDetails?.highEdu} <br />{" "}
                          <span style={{ fontSize: "14px" }}>
                            {userDetails?.highEduYear}
                          </span>
                        </h5>
                        <h5 className="mb-1">
                        {userDetails?.techEdu && "✔"}  {userDetails?.techEdu} <br />{" "}
                          <span style={{ fontSize: "14px" }}>
                            {userDetails?.techEduYear}
                          </span>
                        </h5>
                      </div>

                      {/* address end */}
                    </div>
                    <div className=" mt-5">
                      {/* address start */}
                      <div className="d-flex align-items-center">
                        <div
                          style={{ height: "20px", width: "4px" }}
                          className="bgBlue"
                        ></div>
                        <div>
                          <h4 className="mb-0 ms-1 textBlue">
                            Passport Details
                          </h4>
                        </div>
                      </div>
                      <div className="mt-3">
                        <h5 className="mb-1">
                          Passport Number : {passportDetails?.passportNo}
                        </h5>
                        <h5 className="mb-1">
                          Passport Category : {passportDetails?.passportCategory}
                        </h5>
                        <h5 className="mb-1">
                          Passport Issue Date : {passportDetails?.issueDate}
                        </h5>
                        <h5 className="mb-1">
                          Passport Exp Date : {passportDetails?.expiryDate}
                        </h5>
                      </div>

                      {/* address end */}
                    </div>
                  </div>
                  <div className="col-6">
                    <div className=" mt-5">
                      {/* address start */}
                      <div className="d-flex align-items-center">
                        <div
                          style={{ height: "20px", width: "4px" }}
                          className="bgBlue"
                        ></div>
                        <div>
                          <h4 className="mb-0 ms-1 textBlue">Work Experince</h4>
                        </div>
                      </div>
                      {experienceArr?.map((v, i) => {
                        return (
                          <div className="mt-3">
                            <h5 className="mb-1">
                              <b>{v?.organisationName}</b>
                            </h5>
                            <h5 className="mb-1">
                            {v?.joiningDate} - {v?.isWorking ? "Present": v?.leavingDate} ( {v?.duration} )
                            </h5>
                            <h5 className="mb-1">
                              {v?.designation}
                            </h5>
                            <h5 className="mb-1">{v?.country} {v?.state}</h5>
                          </div>
                        );
                      })}

                      {/* address end */}
                    </div>
                    {/* {licenceArr?.map((v, i)=>{
                      return(
                        <div className=" mt-5">
                      
                        <div className="d-flex align-items-center">
                          <div
                            style={{ height: "20px", width: "4px" }}
                            className="bgBlue"
                          ></div>
                          <div>
                            <h5 className="mb-0 ms-1 textBlue">
                              {v?.licenceName}
                            </h5>
                          </div>
                        </div>
                        <div>
                          
                        </div>
                        <div className="mt-3">
                          <h5 className="mb-1">
                            <b>Licence Number - OvXXXXXX</b>
                          </h5>
                          <h5 className="mb-1">2024-04-09 - 2024-04-27</h5>
                          <h5 className="mb-1">State - Bihar (BR)</h5>
                        </div>
  
                        
                      </div>
                      )
                    })} */}
                   
                  </div>
                </div>
                {/* body end */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPersonalDetails && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title">Personal Details</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowPersonalDetails(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-3">
                      <label>Profile Pic</label>
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            photo: e.target.files[0],
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Full Name</label>
                      <input
                        className="form-control"
                        value={userDetails?.name}
                        readOnly
                        style={{ background: "whitesmoke" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Preffered Job Title</label>
                      <input
                        className="form-control"
                        value={userDetails?.profileTitle}
                        placeholder="e.g Driver/Operator/Electrician..."
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            profileTitle: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Date Of Birth</label>
                      <input
                        className="form-control"
                        type="date"
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            dob: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Gender</label>
                      <select
                        class="customSelect text-secondary form-control   "
                        aria-label="Default select example"
                        // style={{ borderRadius: "35px", padding: "12px" }}
                        onChange={(e) => {
                          setUserDetails({
                            ...userDetails,
                            gender: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label>Marital Status</label>
                      <select
                        class="customSelect text-secondary form-control   "
                        aria-label="Default select example"
                        onChange={(e) => {
                          setUserDetails({
                            ...userDetails,
                            maritalStatus: e.target.value,
                          });
                        }}
                      >
                        <option value="">Select</option>
                        <option value="Married">Married</option>
                        <option value="Unmarried">Unmarried</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label>Language Known</label>
                      <Select
                        isMulti={true}
                        options={languageOption}
                        onChange={(e) =>
                          e.map((v, i) => {
                            return setLanguageKnow([...languageKnown, v.value]);
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-primary  w-100"
                      onClick={() => updateResume()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showPersonalDetails && (
            <div className="modal-backdrop fade show"></div>
          )}
        </>
      )}
      {showWorkDetails && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title">Work Details</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowWorkDetails(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-3">
                      <label>Organisation Name</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            organisationName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Job Department</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            designation: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Experience Type</label>
                      <select
                        class="customSelect text-secondary form-control   "
                        aria-label="Default select example"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            type: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="Domestic">Domestic</option>
                        <option value="International">International</option>
                      </select>
                    </div>
                    {experienceDetails?.type == "International" && (
                      <div className="mb-3">
                        <label>Country</label>
                        <input
                          className="form-control"
                          onChange={(e) =>
                            setExperienceDetails({
                              ...experienceDetails,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}
                    {experienceDetails?.type == "Domestic" && (
                      <div className="mb-3">
                        <label>State</label>
                        <input
                          className="form-control"
                          onChange={(e) =>
                            setExperienceDetails({
                              ...experienceDetails,
                              state: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div className="mb-3">
                      <label>Joining Date</label>
                      <input
                        className="form-control"
                        type="date"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            joiningDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3 d-flex align-items-center">
                      <input
                        type="checkbox"
                        className="me-2"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            isWorking: e.target.checked,
                          })
                        }
                      />
                      <label>Are you still working</label>
                    </div>
                    <div className="mb-3">
                      <label>Ending Date</label>
                      <input
                        className="form-control"
                        type="date"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            leavingDate: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Upload Certificate</label>
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) =>
                          setExperienceDetails({
                            ...experienceDetails,
                            image: e.target.files[0],
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={() => addResumeExperience()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showWorkDetails && <div className="modal-backdrop fade show"></div>}
        </>
      )}
      {showEducationDetails && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title">Education Details</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowEducationDetails(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-4">
                      <label>Highest Education</label>
                      <select
                        class="customSelect text-secondary form-control   "
                        aria-label="Default select example"
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            highEdu: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        {highestEducationArr?.map((v, i) => {
                          return <option value={v?.value}>{v?.label}</option>;
                        })}
                      </select>
                      <label className="mt-2">Passing year</label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            highEduYear: e.target.value,
                          })
                        }
                        type="date"
                        className="form-control"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Technical Education</label>
                      <select
                        class="customSelect text-secondary form-control   "
                        aria-label="Default select example"
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            techEdu: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        {vocationalEduArr?.map((v, i) => {
                          return <option value={v?.value}>{v?.label}</option>;
                        })}
                      </select>
                      <label className="mt-2">Passing year</label>
                      <input
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            techEduTear: e.target.value,
                          })
                        }
                        type="date"
                        className="form-control"
                      />
                    </div>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={updateResume}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showEducationDetails && (
            <div className="modal-backdrop fade show"></div>
          )}
        </>
      )}
      {showLicencePop && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title">License Details</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowLicencePop(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-4">
                      <label>License Name</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setLicenceDetails({
                            ...licenceDetails,
                            licenceName: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>License Photo</label>
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) =>
                          setLicenceDetails({
                            ...licenceDetails,
                            licenceImage: e.target.files[0],
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={addResumeLicence}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showLicencePop && <div className="modal-backdrop fade show"></div>}
        </>
      )}
      {showAddressDetails && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title">Address & Contact Details</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowAddressDetails(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-3">
                      <label>Phone No.</label>
                      <input
                        className="form-control"
                        value={userDetails?.contact}
                        readOnly
                        style={{ background: "whitesmoke" }}
                      />
                    </div>
                    <div className="mb-3">
                      <label>Email</label>
                      <input
                        className="form-control"
                        value={userDetails?.email}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>State</label>
                      <input
                        className="form-control"
                        value={userDetails?.state}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            state: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>District</label>
                      <input
                        className="form-control"
                        value={userDetails?.district}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            district: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Police Station</label>
                      <input
                        className="form-control"
                        value={userDetails?.ps}
                        onChange={(e) =>
                          setUserDetails({ ...userDetails, ps: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Village</label>
                      <input
                        className="form-control"
                        value={userDetails?.village}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            village: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Panchayat</label>
                      <input
                        className="form-control"
                        value={userDetails?.panchayat}
                        onChange={(e) =>
                          setUserDetails({
                            ...userDetails,
                            panchayat: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={updateResume}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showAddressDetails && (
            <div className="modal-backdrop fade show"></div>
          )}
        </>
      )}
      {showPassportDetails && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title">Passport Details</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowPassportDetails(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-3">
                      <label>Passport Number</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setPassportDetails({
                            ...passportDetails,
                            passportNo: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Passport Category</label>
                      <select
                        class="customSelect text-secondary form-control   "
                        aria-label="Default select example"
                        onChange={(e) =>
                          setPassportDetails({
                            ...passportDetails,
                            passportCategory: e.target.value,
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="ECR">ECR</option>
                        <option value="ECNR">ECNR</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label>Issue Date</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setPassportDetails({
                            ...passportDetails,
                            issueDate: e.target.value,
                          })
                        }
                        type="date"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Expiry Date</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setPassportDetails({
                            ...passportDetails,
                            expiryDate: e.target.value,
                          })
                        }
                        type="date"
                      />
                    </div>
                    <div className="mb-3">
                      <label>Upload Image</label>
                      <input
                        className="form-control"
                        type="file"
                        onChange={(e) =>
                          setPassportDetails({
                            ...passportDetails,
                            image: e.target.files[0],
                          })
                        }
                      />
                    </div>

                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={handleUpdatePassport}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showPassportDetails && (
            <div className="modal-backdrop fade show"></div>
          )}
        </>
      )}
      {showVerificationPop && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between ">
                  <h5 className="modal-title d-flex w-100 align-items-center justify-content-between">
                    {" "}
                    <span>Verify your mobile number </span>
                    <i
                      className="fa fa-close"
                      onClick={() => navigate("/")}
                    ></i>
                  </h5>
                </div>
                <div className="modal-body">
                  <div className="m-2 mt-0">
                    <div className="mb-3">
                      <label>Full Name</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setLoginForm({ ...loginForm, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label>Phone No.</label>
                      <input
                        className="form-control"
                        onChange={(e) =>
                          setLoginForm({
                            ...loginForm,
                            contact: e.target.value,
                          })
                        }
                      />
                    </div>
                    {showOtpInp && (
                      <div className="mb-3">
                        <label>Enter Otp</label>
                        <input
                          className="form-control"
                          onChange={(e) =>
                            setLoginForm({ ...loginForm, otp: e.target.value })
                          }
                        />
                      </div>
                    )}
                    {showOtpInp ? (
                      <button
                        className="btn btn-success mt-3 w-100"
                        onClick={verifyOptFunc}
                      >
                        Verify
                      </button>
                    ) : (
                      <button
                        className="btn btn-primary mt-3 w-100"
                        onClick={getOptFunc}
                      >
                        Send Otp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {showVerificationPop && (
            <div className="modal-backdrop fade show"></div>
          )}
        </>
      )}
    </div>
  </>
    
  );
}

export default ResumeBuilding;
