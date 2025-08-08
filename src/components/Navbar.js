import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { getCountriesForJobs, getOccupations } from "../services/info.service";
import { getSkill } from "../services/job.service";
import { useGlobalState } from "../GlobalProvider";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDepartment, setShowDepartment] = useState(false);
  const [showLangPopup, setShowLangPopup] = useState(false);
  const [showCountry, setShowCountry] = useState(false);
  const [showSkill, setShowSkill] = useState(false);
  
  const navItem = [
    {
      name: "Jobs",
      icon: "fa fa-suitcase",
      // path: "/all-jobs",
      subMenu: [
        {
          name: "All Jobs",
          path: "/jobs",
        },
        {
          name: "Jobs By Department",
          popUp: setShowDepartment,
        },
        {
          name: "Jobs By Skill",
          popUp: setShowSkill,
        },
        {
          name: "Jobs By Country",
          popUp: setShowCountry,
        },
        {
          name: "Jobs Of the week",
          path: "/jobs/last-week",
        },
      ],
    },
    {
      name: "Services",
      icon: "fa fa-cogs",
      subMenu: [
        {
          name: "Resume Building",
          path: "about-resume-building",
        },
        // {
        //   name: "Language Training",
        //   path: "institutes",
        // },
        {
          name: "Skill Training",
          path: "skill-training-institute",
        },
        {
          name: "Trade Testing",
          path: "trade-testing-institute",
        },
      ],
    },
    {
      name: "Recruiters",
      icon: "fa fa-users",
      path: "/recruiting-companies",
    },
    {
      name: "Collaboration",
      icon: "fa fa-handshake-o",
      subMenu: [
        {
          name: "Training Institutes",
          path: "training-institutes",
        },
        {
          name: "Trade Test Centres",
          path: "trade-test-center",
        },
      ],
    },
    // {
    //   name: "Pricing",
    //   icon: "fa fa-credit-card",
    //   path: "/pricing",
    // },
    {
      name: !globalState?.user
        ? "Login/Register"
        : globalState?.user?.user?.type === "person"
        ? "My Profile"
        : globalState?.user?.user?.type === "company"
        ? "Dashboard"
        : globalState?.user?.user?.type === "institute"
        ? "Dashboard"
        : "Login/Register",
      icon: !globalState?.user
        ? "fa fa-user"
        : globalState?.user?.user?.type === "person"
        ? "fa fa-user"
        : globalState?.user?.user?.type === "company"
        ? "fa fa-tachometer" // Dashboard icon
        : "fa fa-user",
      path: !globalState?.user
        ? "/login"
        : globalState?.user?.user?.type === "person"
        ? "/my-profile"
        : globalState?.user?.user?.type === "company"
        ? "/hra-dashboard"
        : globalState?.user?.user?.type === "institute"
        ? "/institute-dashboard"
        : "/login",
    },
  ];
  const [departmentList, setDepartmentList] = useState([]);
  const getOccupationsListFunc = async () => {
    try {
      let response = await getOccupations();
      let occupations = response?.occupation?.map((item) => ({
        label: item.occupation,
        value: item.id,
        img:
          "https://backend.overseas.ai/storage/uploads/occupationImage/" +
          item.id +
          "/" +
          item.occuLgIcon,
      }));
      setDepartmentList(occupations);
    } catch (error) {
      console.log(error);
    }
  };
  const [countryList, setCountryList] = useState([]);
  const getCountriesForJobsFunc = async () => {
    try {
      let response = await getCountriesForJobs();
      setCountryList(response?.countries);
    } catch (error) {
      console.log(error);
    }
  };
  const [filteredSkill, setFilteredSkill] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const getSkillsFunc = async () => {
    try {
      let response = await getSkill();
      setSkillList(response?.skills);
      setFilteredSkill(response?.skills);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCountriesForJobsFunc();
    getOccupationsListFunc();
    getSkillsFunc();
  }, []);

  const handleSkillKey = (key) => {
    if (key.length != 0) {
      let newSkillArr = skillList?.filter((v, i) => {
        return v.skill.toLowerCase().includes(key.toLowerCase());
      });
      setFilteredSkill(newSkillArr);
    } else {
      setFilteredSkill(skillList);
    }
  };
  const [searchKey, setSearchKey] = useState({
    jobName: "",
    jobOccupation: "",
    jobLocationCountry: "",
    countryName: "",
    departmentName: "",
    skillId:"",
    skillName:""
  });
  const navigatePage = () => {
    const formatUrl = (name) => {
      return name.toLowerCase().replace(/\s+/g, "-"); // Convert to lowercase and replace spaces with hyphens
    };
    if (searchKey?.jobOccupation) {
      navigate(`/jobs/${formatUrl(searchKey.departmentName)}-all-jobs`);
      setSearchKey({
        jobName: "",
        jobOccupation: "",
        jobLocationCountry: "",
        countryName: "",
        departmentName: "",
      });
    }
    if (searchKey?.jobLocationCountry) {
      navigate(`/jobs/${formatUrl(searchKey.countryName)}-all-jobs`);
      setSearchKey({
        jobName: "",
        jobOccupation: "",
        jobLocationCountry: "",
        countryName: "",
        departmentName: "",
      });
    }
    if (searchKey?.skillId) {
      navigate(`/jobs/${formatUrl(searchKey.skillName)}-all-jobs`);
      setSearchKey({
        jobName: "",
        jobOccupation: "",
        jobLocationCountry: "",
        countryName: "",
        departmentName: "",
      });
    }
    setShowSkill(false)
    setShowDepartment(false);
    setShowCountry(false);
  };

  useEffect(() => {
    navigatePage();
  }, [searchKey]);
  
  console.log("dfsdf", globalState?.user?.user?.type)
  return (
    <>
      {showDepartment && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog ">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h5 className="modal-title">Select Department</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowDepartment(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>
                <div className="modal-body row ">
                  {departmentList?.map((v, i) => {
                    return (
                      <div className="col-md-6 col-12">
                        <div
                          className="dropDownItemHover mb-md-2 mb-1 p-2 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setSearchKey({
                              ...searchKey,
                              departmentName: v?.label,
                              jobOccupation: v?.value,
                            })
                          }
                        >
                          <img
                            src={v?.img}
                            className="img-fluid me-2"
                            style={{
                              height: "35px",
                              width: "35px",
                              borderRadius: "50%",
                            }}
                            alt="Department Image"
                          />
                          <p className="mb-0" style={{ fontSize: "13px" }}>
                            {v?.label}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {showDepartment && <div className="modal-backdrop fade show"></div>}
        </>
      )}
      {showCountry && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h5 className="modal-title">Select Countries</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowCountry(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>
                <div className="modal-body row">
                  {countryList?.map((v, i) => {
                    return (
                      <div className="col-md-6 col-12">
                        <div
                          className="dropDownItemHover mb-md-2 mb-1 p-2 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setSearchKey({
                              ...searchKey,
                              countryName: v?.name,
                              jobLocationCountry: v?.id,
                            })
                          }
                        >
                          <img
                            src={`https://backend.overseas.ai/storage/uploads/countryFlag/${v?.countryFlag}`}
                            className="img-fluid me-2"
                            style={{
                              height: "35px",
                              width: "35px",
                              borderRadius: "50%",
                            }}
                            alt="Flag Image"
                          />
                          <p className="mb-0" style={{ fontSize: "13px" }}>
                            {v?.name}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {showCountry && <div className="modal-backdrop fade show"></div>}
        </>
      )}
      {showSkill && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h5 className="modal-title">Select Skill</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowSkill(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body row">
                  <div className="col-12 align-items-center justify-content-between  mb-3">
                    <input
                      placeholder="Search Skill"
                      className="form-control"
                      onChange={(e) => handleSkillKey(e.target.value)}
                    />
                    <i
                      className="fa fa-search me-3"
                      style={{
                        position: "absolute",
                        right: "20px",
                        top: "25px",
                      }}
                    ></i>
                  </div>
                  {filteredSkill?.slice(0, 12).map((v, i) => {
                    return (
                      <div className="col-md-6 col-12">
                        <div
                          className="dropDownItemHover mb-md-2 mb-1 p-2 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            setSearchKey({
                              ...searchKey,
                              skillName: v?.skill,
                              skillId: v?.skill,
                            })
                          }
                        >
                          <p className="mb-0" style={{ fontSize: "13px" }}>
                            {v?.skill}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {showSkill && <div className="modal-backdrop fade show"></div>}
        </>
      )}
      {showLangPopup && (
        <>
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-between">
                  <h5 className="modal-title">Select Language</h5>
                  <button
                    type="button"
                    className="btn "
                    onClick={() => setShowLangPopup(false)}
                  >
                    <i className="fa fa-close"></i>
                  </button>
                </div>

                <div className="modal-body row">
                  {["English", "Hindi", "Bengali"].map((v, i) => {
                    return (
                      <div className="col-12">
                        <div
                          className="dropDownItemHover mb-md-2 mb-1 p-3 d-flex align-items-center"
                          style={{ cursor: "pointer" }}
                        >
                          <p className="mb-0" style={{ fontSize: "13px" }}>
                            {v}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          {showLangPopup && <div className="modal-backdrop fade show"></div>}
        </>
      )}
      <div className="" style={{ background: "#F4FAFD" }}>
        <div className="">
          <nav
            className="navbar navbar-expand-lg   py-2 px-lg-2"
            style={{ background: "#F4FAFD" }}
          >
            <div className="container-fluid ">
              <Link className="navbar-brand" to="/">
                <img
                  src="/images/brandlogo.gif"
                  style={{ height: 50, width: 160 }}
                  alt="logo"
                />
              </Link>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#mynavbar"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div className="collapse navbar-collapse" id="mynavbar">
                <ul className="navbar-nav ms-auto">
                  {navItem.map((v, i) => {
                    if (v.subMenu) {
                      return (
                        <li key={i} className="nav-item dropdown ">
                          <a
                            className="nav-link mx-lg-1 mx-xl-2 d-flex align-items-center dropdown-toggle"
                            href="#"
                            id="navbarDropdownMenuLink"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i
                              className={
                                v?.icon +
                                " d-md-none d-sm-none d-lg-block" +
                                " me-1 "
                              }
                            ></i>
                            <b>{v.name}</b>
                          </a>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="navbarDropdownMenuLink"
                          >
                            {v.subMenu.map((subItem, subIndex) => {
                              return (
                                <li
                                  key={subIndex}
                                  onClick={() => {
                                    subItem.popUp && subItem.popUp(true);
                                  }}
                                >
                                  <Link
                                    className="dropdown-item justify-content-between d-flex align-items-center"
                                    to={subItem?.path}
                                  >
                                    <span>{subItem.name}</span>{" "}
                                    {subItem?.popUp && (
                                      <i className="fa fa-caret-down ms-1 text-secondary " />
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    } else {
                      return (
                        <li
                          key={i}
                          className={`nav-item  ${
                            location.pathname === v.path ? "borderBottom" : ""
                          }`}
                        >
                          <b>
                            <Link
                              className="nav-link d-flex align-items-center mx-lg-1 mx-xl-2"
                              to={v.path}
                            >
                              <i
                                className={
                                  v.icon +
                                  " d-md-none me-1 d-lg-block" +
                                  (location.pathname === v.path
                                    ? " textBlue "
                                    : " ")
                                }
                              ></i>
                              <span
                                className={
                                  " " +
                                  (location.pathname === v.path && " textBlue")
                                }
                              >
                                {v.name}
                              </span>
                            </Link>
                          </b>
                        </li>
                      );
                    }
                  })}
                  <div className="d-md-none d-flex align-items-center">
                    <button
                      className="btn btn-primary bgBlue"
                      style={{
                        borderRadius: "10px",
                        width: "150px",
                        outline: "none",
                        border: "none",
                      }}
                    >
                      <a
                        className="text-light text-decoration-none"
                        href="https://play.google.com/store/apps/details?id=ai.overseas"
                        target="blank"
                      >
                        Download App
                      </a>
                    </button>
                    <h5 className="mb-0">
                      <i
                        className="fa fa-language bg-light textBlue rounded py-1 px-2 ms-3"
                        onClick={() => setShowLangPopup(true)}
                      />
                    </h5>
                  </div>
                </ul>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default Navbar;
