import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getHraList } from "../services/hra.service";
import { Helmet } from "react-helmet";
function Companies() {
  const navigate = useNavigate();
  const [hraList, setHraList] = useState([]);
  const [filteredArray, setFilteredArray] = useState([]);
  const employerRegisterRef = useRef(null); // Ref for the Employer Register section

  const getHraListFunc = async () => {
    try {
      let response = await getHraList();
      setHraList(response?.data?.cmpData);
      setFilteredArray(response?.data?.cmpData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getHraListFunc();
  }, []);

  const renderStars = (numRatings) => {
    const stars = [];
    for (let i = 0; i < numRatings; i++) {
      stars.push(<i className="fa fa-star text-warning me-1" key={i}></i>);
    }
    return stars;
  };

  const [searchKey, setSearchKey] = useState("");

  const searchResultFunc = (key) => {
    if (key.length !== 0) {
      setFilteredArray(
        hraList.filter((item) =>
          item?.cmpName.toLowerCase().includes(key.toLowerCase())
        )
      );
    } else {
      setFilteredArray(hraList);
    }
  };

  const sortByName = (order) => {
    if (order === "asc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => a.cmpName.localeCompare(b.cmpName))
      );
    } else if (order === "desc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => b.cmpName.localeCompare(a.cmpName))
      );
    }
  };

  const sinceSort = (order) => {
    if (order === "asc") {
      setFilteredArray(
        [...filteredArray].sort((a, b) => {
          const workingFromA = a.cmpWorkingFrom || "0000-00-00";
          const workingFromB = b.cmpWorkingFrom || "0000-00-00";
          return workingFromA.localeCompare(workingFromB);
        })
      );
    } else if (order === "desc") {
      setFilteredArray(
        [...filteredArray].sort((b, a) => {
          const workingFromA = a.cmpWorkingFrom || "0000-00-00";
          const workingFromB = b.cmpWorkingFrom || "0000-00-00";
          return workingFromA.localeCompare(workingFromB);
        })
      );
    } else {
      setFilteredArray(hraList);
    }
  };

  const handleScrollToRegister = () => {
    if (employerRegisterRef.current) {
      const offsetTop =
        employerRegisterRef.current.getBoundingClientRect().top +
        window.pageYOffset -
        200; // Adjust the offset as needed
      window.scrollTo({ top: offsetTop, behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Recruiting Company: Top Overseas Job Apps Listed</title>
        <meta
          name="description"
          content="Discover the best recruiting company list for overseas job apps. Find your next opportunity with trusted recruitment solutions tailored for you."
        />
        <meta name="keywords" content="Recruiting companies" />
      </Helmet>
      <div className="mt-5 pt-5">
        <div className="mt-5 pt-md-5 container ">
          <div className="d-md-flex align-items-center justify-content-between my-3 mx-4 pb-3">
            <h1 className="textBlue" style={{ fontSize: "32px" }}>
              <b>COMPANIES THAT HIRE FROM US</b>
            </h1>
            <button
              className="btn btn-outline-primary"
              onClick={handleScrollToRegister}
            >
              Register As HRA
            </button>
          </div>
          {/* Search and Sort */}
          <div className="row mx-3 mb-4">
            <div className="col-6">
              <input
                className="form-control"
                placeholder="Search By Name"
                value={searchKey}
                onChange={(e) => {
                  searchResultFunc(e.target.value);
                  setSearchKey(e.target.value);
                }}
              />
            </div>
            <div className="col-3">
              <select
                className="customSelect text-secondary form-control"
                aria-label="Default select example"
                onChange={(e) => {
                  sortByName(e.target.value);
                }}
              >
                <option value="">Sort By Name</option>
                <option value="asc">Name: A to Z</option>
                <option value="desc">Name: Z to A</option>
              </select>
            </div>
            <div className="col-3">
              <select
                className="customSelect text-secondary form-control"
                aria-label="Default select example"
                onChange={(e) => {
                  sinceSort(e.target.value);
                }}
              >
                <option value="">Since</option>
                <option value="asc">Oldest to Newest</option>
                <option value="desc">Newest to Oldest</option>
              </select>
            </div>
          </div>
          {/* Company List */}
          <div className="row m-0 p-0">
            {filteredArray?.map((v, i) => (
              <div
                key={i}
                className="col-12 col-md-6"
                onClick={() => navigate(`/company/${v?.id}`)}
              >
                <div className="p-4 m-3 shadow rounded">
                  <div className="row">
                    <div className="col-4">
                      <img
                        src={
                          v?.cmpLogoS3 === "placeholder/logo.png"
                            ? "https://overseasdata.s3.ap-south-1.amazonaws.com/Company/6/logo.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240924%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240924T122145Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=b2c7fd5bebe879e2a5c5140c9024b9004379aae58f729d3cda60539085e84edc"
                            : v?.cmpLogoS3
                        }
                        className="img-fluid"
                        alt="Company Logo"
                       
                      />
                    </div>
                    <div className="col-8 my-auto">
                      <h5>{v?.cmpName}</h5>
                      <p className="mb-0">Since {v?.cmpWorkingFrom}</p>
                      <div>{renderStars(v?.cmpRating)}</div>
                      <a
                        href={v?.cmpWebsiteLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          textDecoration: "none",
                          color: "black",
                          fontWeight: "600",
                        }}
                      >
                        Visit Website
                      </a>
                    </div>
                    <div className="col-12">
                      <p className="my-3" style={{ height: "90px" }}>
                        {v?.cmpDescription?.substring(0, 200)}{" "}
                        {v?.cmpDescription?.length > 200 && "..."}
                      </p>
                      <div className="d-flex">
                        <button className="btn btn-outline-primary">
                          View More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Employer Register Section */}
          <div
            className="row mx-3 mb-5 pt-5 mt-3"
            ref={employerRegisterRef} // Reference to this section
          >
            <div className="col-md-6 col-12 my-auto">
              <div className="py-5">
                <h3 className="textBlue">BEST GLOBAL HIRING PLATFORM</h3>
                <h2 className="heading">Find the perfect candidate</h2>
                <p>Trusted By Many Global Employers</p>
              </div>
            </div>
            <div className="col-md-6 col-12 my-auto order-md-1 ">
              <div className="shadow rounded bg-light p-md-4 p-3 m-md-3 m-0">
                <h4 className="mb-4">
                  <i className="fa fa-users me-2"></i>Employer Register
                </h4>
                <label>Company/Office</label>
                <input className="form-control" />
                <br />
                <label>Official Phone Number</label>
                <div className="d-flex">
                  <input
                    className="form-control"
                    style={{ width: "17%" }}
                    placeholder="+91"
                  />
                  <input
                    className="form-control"
                    style={{ width: "83%" }}
                    placeholder=""
                  />
                </div>
                <br />
                <div className="align-items-center d-flex mb-3 justify-content-center">
                  <input type="checkbox" />
                  <span
                    className="ms-2"
                    style={{
                      fontWeight: "500",
                      position: "relative",
                      bottom: "1px",
                    }}
                  >
                    I agree with overseas Terms & Conditions And The Privacy
                    Policy
                  </span>
                </div>
                <button className="btn btn-success w-100">Sign Up</button>
                <p className="text-center mt-3">
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Companies;
