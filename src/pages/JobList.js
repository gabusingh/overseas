import React, { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import {
  getJobList,
  getThisWeekJob,
  getJobListForSearch,
} from "../services/job.service";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import JobFilter from "../components/JobFilter";
import { Helmet } from "react-helmet";
function JobList() {
  const params = useParams();
  const [jobArr, setJobArr] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLoader, setShowLoader] = useState(false);

  const [payload, setPayload] = useState({
    jobLocationCountry: [],
    jobOccupation: [],
    passportType: "",
    languageRequired: [],
    contractPeriod: "",
    jobExpTypeReq: "",
    sortBy: "",
  });
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [showFilter, setShowFilter] = useState(window.innerWidth > 700);

  const getJob = async () => {
    setShowLoader(true);
    try {
      const formData = new FormData();
      for (const key in payload) {
        if (Array.isArray(payload[key]) && payload[key].length > 0) {
          formData.append(key, JSON.stringify(payload[key]));
        } else if (payload[key] !== "") {
          formData.append(key, payload[key]);
        }
      }
      formData.append("pageNo", pageNo);
      let response = await getJobList(formData);
      setJobArr(response?.jobs);
      pageNumber(response?.totalJobs);
      setShowLoader(false);
    } catch (error) {
      console.error("Error fetching job list:", error);
      setShowLoader(false);
    }
  };
  const [metaData, setMetaData] = useState({
    heading: "All Jobs",
    title: "All Jobs: Discover Opportunities with Overseas jobs",
    keyword: "All jobs",
    discription:
      "Explore all jobs available with the Overseas.ai app. Find your dream job abroad and build your career",
  });
  const capitaliseFirstLetterOfString = (string) => {
    let newString = "";
    let arr = string.split(" ");

    // Capitalize the first letter of each word
    arr = arr.map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(); // Capitalize the first letter and keep the rest lowercase
    });

    // Join the array back into a single string
    newString = arr.join(" ");

    return newString;
  };
  const getJobKey = async () => {
    setShowLoader(true);
    try {
      let response = await getJobListForSearch({
        searchKey: params.filter.replace(/-/g, " "),
      });
      setJobArr(response?.jobs);
      pageNumber(response?.totalJobs);
      setShowLoader(false);
      setMetaData({
        heading: capitaliseFirstLetterOfString(
          params.filter.replace(/-/g, " ")
        ),
        title:
          capitaliseFirstLetterOfString(params.filter.replace(/-/g, " ")) +
          " : Discover Opportunities with Overseas jobs",
        keyword: params.filter.replace(/-/g, " "),
        discription:
          "Explore all jobs available with the Overseas.ai app. Find your dream job abroad and build your career",
      });
    } catch (error) {
      console.error("Error fetching job list:", error);
      setShowLoader(false);
    }
  };
  const getJobsOfTheWeek = async () => {
    setShowLoader(true);
    try {
      const formData = new FormData();

      formData.append("pageNo", pageNo);
      let response = await getThisWeekJob(formData);
      setJobArr(response?.jobs);
      pageNumber(response?.totalJobs);
      setShowLoader(false);
    } catch (error) {
      console.error("Error fetching job list:", error);
      setShowLoader(false);
    }
  };

  useEffect(() => {
    if (location.pathname == "/jobs/last-week") {
      getJobsOfTheWeek();
      setMetaData({
        heading: "Jobs of the week",
        title: "Jobs of the week: Discover the Top Jobs of the Week",
        keyword: "Jobs of the week",
        discription:
          "Explore the best job opportunities of the week at overseas jobs leading employment agency.Don't miss out on your dream job.",
      });
      return;
    }
    if (location.pathname === "/jobs") {
      getJob();
    } else {
      if (
        (payload.jobLocationCountry && payload.jobLocationCountry.length > 0) ||
        (payload.jobOccupation && payload.jobOccupation.length > 0) ||
        (payload.passportType && payload.passportType.trim() !== "") ||
        (payload.languageRequired && payload.languageRequired.length > 0) ||
        (payload.contractPeriod && payload.contractPeriod.trim() !== "") ||
        (payload.jobExpTypeReq && payload.jobExpTypeReq.trim() !== "") ||
        (payload.sortBy && payload.sortBy.trim() !== "")
      ) {
        if (params.filter) {
          navigate("/jobs", { replace: true });
        }
        getJob();
      } else {
        getJobKey();
      }
    }
  }, [pageNo, payload, params.filter]);

  const pageNumber = (totalJobs) => {
    const totalPages = Math.ceil(totalJobs / 10);
    setTotalPage(Array.from({ length: totalPages }, (_, i) => i + 1));
  };

  const handlePageChange = (newPageNo) => {
    if (newPageNo >= 1 && newPageNo <= totalPage.length) {
      setPageNo(newPageNo);
    }
  };

  const getPageRange = () => {
    const rangeSize = 5; // Number of pages to show around the current page
    const lastPage = totalPage.length;

    let start = Math.max(1, pageNo - Math.floor(rangeSize / 2));
    let end = start + rangeSize - 1;

    if (end > lastPage) {
      end = lastPage;
      start = Math.max(1, end - rangeSize + 1);
    }

    return { start, end };
  };

  const { start, end } = getPageRange();
  const [searchJobsArr, setSearchJobsArr] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const handleSearch = (key) => {
    const filteredArr = jobArr?.filter((v) => {
      return v?.jobTitle?.toLowerCase().includes(key.toLowerCase());
    });
    console.log(filteredArr);
    setSearchJobsArr(filteredArr);
    setSearchKey(key);
  };
  return (
    <>
      <Helmet>
        <title>{metaData?.title}</title>
        <meta name="description" content={metaData?.discription} />
        <meta name="keywords" content={metaData?.keyword} />
      </Helmet>
      <div className="container mt-md-5 pt-5">
        <div className="mt-5 pt-5 mx-0">
          
          <h1 className="textBlue  fontSans mb-3 mb-md-5"><i className="fa fa-suitcase"></i> <u>{metaData?.heading}</u></h1>
          <div className="row justify-content-center ">
            <div
              className="col-lg-5 col-md-6 col-11 mb-2 d-flex align-items-center justify-content-between  border p-2 rounded"
              style={{ height: "46.5px" }}
            >
              <input
                style={{
                  border: "none",
                  width: "80%",
                  paddingLeft: "10px",
                  outline: "none",
                }}
                placeholder="Search By Job Title"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <h4 className="mb-0 text-secondary">
                <i
                  className={"fa " + (!showFilter ? "fa-filter" : "fa-search")}
                  onClick={() => setShowFilter(true)}
                ></i>
              </h4>
            </div>
          </div>
          <div className="row m-0 p-0">
            {showFilter && (
              <JobFilter
                setShowFilter={setShowFilter}
                setPayload={setPayload}
                payload={payload}
                showFilter={showFilter}
              />
            )}

            {showLoader ? (
              <div className="vh-100 row col-md-8 col-lg-6 col-12 justify-content-center align-items-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row col-md-8 col-lg-6 col-12 m-0 p-0">
                {searchKey.length > 0 ? (
                  searchJobsArr?.map((v, i) => <JobCard key={i} value={v} />)
                ) : jobArr.length > 0 ? (
                  jobArr?.map((v, i) => <JobCard key={i} value={v} />)
                ) : (
                  <div className="text-center mt-5">
                    <img
                      style={{ height: "280px", width: "280px", opacity: 0.8 }}
                      src="https://cdn-icons-png.flaticon.com/256/6840/6840178.png"
                      className="img-fluid"
                      alt="No Job Found"
                    />
                    <h5 className="text-secondary">
                      <b>No Job Found</b>
                    </h5>
                  </div>
                )}
              </div>
            )}

            <div className="col-lg-3 d-none d-md-none d-lg-block">
              <img className="img-fluid" src="/images/fullMobileNew.png" />
              <div className="row mx-2">
                <div className="col-4">
                  <img
                    className="img-fluid"
                    src="/images/appQR.png"
                    alt="App Qr"
                  />
                </div>
                <div className="col-8 my-auto border rounded">
                  <img
                    className="img-fluid"
                    src="https://admin.overseas.ai/newfrontend/image/google-play.png"
                    alt="Play Store Image"
                  />
                </div>
              </div>
            </div>
          </div>

          <nav
            aria-label="Page navigation example"
            className="d-flex justify-content-center my-5"
          >
            <ul className="pagination">
              <li className={`page-item ${pageNo === 1 ? "disabled" : ""}`}>
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNo - 1);
                  }}
                >
                  Prev
                </a>
              </li>
              {start > 1 && (
                <>
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(1);
                      }}
                    >
                      1
                    </a>
                  </li>
                  {start > 2 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                </>
              )}
              {totalPage.slice(start - 1, end).map((v) => (
                <li
                  key={v}
                  className={`page-item ${v === pageNo ? "active" : ""}`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePageChange(v);
                    }}
                  >
                    {v}
                  </a>
                </li>
              ))}
              {end < totalPage.length && (
                <>
                  {end < totalPage.length - 1 && (
                    <li className="page-item disabled">
                      <span className="page-link">...</span>
                    </li>
                  )}
                  <li className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(totalPage.length);
                      }}
                    >
                      {totalPage.length}
                    </a>
                  </li>
                </>
              )}
              <li
                className={`page-item ${
                  pageNo === totalPage.length ? "disabled" : ""
                }`}
              >
                <a
                  className="page-link"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(pageNo + 1);
                  }}
                >
                  Next
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

export default JobList;
