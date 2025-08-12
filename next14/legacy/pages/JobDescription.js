import React, { useState, useEffect } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { getJobById , applyJobApi} from "../services/job.service";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../GlobalProvider";
function JobDiscription() {
  const { globalState, setGlobalState } = useGlobalState();
  const params = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const getDetails = async (id) => {
    try {
      let response = await getJobById(id);
      setJobDetails(response?.data?.jobs);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getDetails(params?.id);
  }, [params?.id]);
  const handleApplyJob = async(event)=>{
    event.stopPropagation(); 
    if(!globalState?.user){
      toast.warning("Please login to apply");
      return
      }
    let payload = {
      id: jobDetails?.id,
      'apply-job': '',
    };
    try {
      let response = await applyJobApi(payload, globalState?.user?.access_token )
      if(response?.data?.msg=="Job Applied Successfully"){
        toast.success(response?.data?.msg)
      }else{
        toast.error(response?.data?.error)
      }
    } catch (error) {
      toast.error("Internal Server Error")
    }
  }
  return (
    <div className="pt-5">
      <div className="row p-0 m-0 w-100 justify-content-center d-flex">
        <div className="col-md-8 my-5 ">
          <BreadCrumb />
          <div className=" p-3 mx-0 mt-5   border shadow-lg rounded">
            <h1 className="textBlue text-center fontSans">
              {jobDetails?.jobTitle}
            </h1>
            <p className="my-3 text-center fontSans">
              Job Id : {jobDetails?.jobID}
            </p>
            <p className="my-3 text-center fontSans">
              {jobDetails?.jobDescription}
            </p>
            <div className="d-flex justify-content-center my-2 imgContainer">
              <img src={`https://admin.overseas.ai/storage/uploads/countryFlag/${jobDetails?.jobLocationCountry?.countryFlag}`} alt="Country Flag"/>
              <img src="https://admin.overseas.ai/newfrontend/image/job-card/accommodation.png" alt="Accommodation Image"/>
              <img src="https://admin.overseas.ai/newfrontend/image/job-card/health.png" alt="Health Image"/>
              <img src="https://admin.overseas.ai/newfrontend/image/job-card/transportation.png" alt="Transportation Image"/>
            </div>
          </div>
          <div className="my-3">
            <button className="btn btn-primary w-100 bgBlue"style={{borderRadius:"25px", outline:"none", border:"none"}} onClick={handleApplyJob}>Apply Now</button>
          </div>
          <div className="p-md-3 p-2 mx-0 mt-5 row  border shadow-lg rounded ">
            <div className="col-md-6 col-12">
              <div className="d-md-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Job Posted By</b>
                  </p>
                </div>
                <p className="mb-0 mt-2 mt-md-0">{jobDetails?.cmpName}</p>
              </div>
            </div>
            <div className="col-md-6 col-12 ">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Number of vacancy</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobVacancyNo}</p>
              </div>
            </div>
            <div className="col-md-6 col-12  ">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Age Limit</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobAgeLimit} years</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-02 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Passport Type</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.passport_type} years</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Contract Period</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.contract_period} months</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded  m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Experience Required</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobExpDuration} years</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded  m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Experience Type</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobExpTypeReq}</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Interview Mode</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobMode}</p>
              </div>
            </div>
            <div className="col-md-6 col-12 ">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Working Days</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobWorkingDay}</p>
              </div>
            </div>
            <div className="col-md-6 col-12 ">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Working Hours</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobWorkingHour}</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Overtime</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.jobOvertime}</p>
              </div>
            </div>
            <div className="col-md-6 col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Salary Negotiable</b>
                  </p>
                </div>
                <p className="mb-0">{jobDetails?.salary_negotiable}</p>
              </div>
            </div>
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center py-3 px-4 rounded m-md-2 my-2 my-md-2 borderLeft2 lightBlueBg">
                <div className="d-flex align-items-center  ">
                  <h5 className="mb-0 gola">
                    <i class="fa fa-home"></i>
                  </h5>
                  <p className="mb-0 ms-2">
                    <b>Required Documents</b>
                  </p>
                </div>
                {jobDetails?.required_documents?.map((v, i) => {
                  return <p className="mb-0">{v}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer/>
    </div>
  );
}

export default JobDiscription;
