import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCountriesForJobs, getOccupations } from "../services/info.service";
import { getSkill } from "../services/job.service";

function Footer() {
  const navigate = useNavigate();

  const quickLinks = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About Us",
      link: "/about-us",
    },
    {
      name: "Our Partners",
      link: "/",
    },
    {
      name: "Contact Us",
      link: "/contact-us",
    },
    {
      name: "Labour Law",
      link: "/",
    },
    {
      name: "Privacy Policy",
      link: "/privacy-policy",
    },
    {
      name: "Terms & Conditions",
      link: "/terms-condition",
    },
    {
      name: "Pricing",
      link: "/pricing"
    }
  ];

  const socialLinks = [
    {
      link: "https://www.linkedin.com/company/findoverseasjobs?originalSubdomain=in",
      icon: "fa fa-linkedin",
    },
    {
      link: "https://wa.me/8100929525",
      icon: "fa fa-whatsapp",
    },
    {
      link: "https://www.facebook.com/overseasdreamjobs",
      icon: "fa fa-facebook",
    },
    {
      link: "https://www.youtube.com/channel/UCbmM6NPRf89yYh5AAy0kuVg",
      icon: "fa fa-youtube",
    },
    {
      link: "https://www.instagram.com/overseas.aijobs/?igsh=MTgxdHhkcHdsdWd5YQ%3D%3D",
      icon: "fa fa-instagram",
    },
  ];

  // States
  const [departmentList, setDepartmentList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [skillList, setSkillList] = useState([]);
  const [filteredSkill, setFilteredSkill] = useState([]);
  const [showFullDepartmentList, setShowFullDetartmentList] = useState(false);
  const [showFullSkillList, setShowFullSkillList] = useState(false); // New state for skills

  // Fetch Occupations
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

  // Fetch Countries
  const getCountriesForJobsFunc = async () => {
    try {
      let response = await getCountriesForJobs();
      setCountryList(response?.countries);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Skills
  const getSkillsFunc = async () => {
    try {
      let response = await getSkill();
      setSkillList(response?.skills);
      setFilteredSkill(response?.skills);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch Data on Component Mount
  useEffect(() => {
    getCountriesForJobsFunc();
    getOccupationsListFunc();
    getSkillsFunc();
  }, []);

  return (
    <>
      <div className="text-light">
        <div className=" p-5 " style={{ background: "#437DAA" }}>
          <div className="row px-md-4">
            {/* Find Jobs By Countries */}
            <div className="col-lg-4 p-0 m-0">
              <h5
                className="mb-0 p-0 mb-3 mt-3 mt-lg-0 "
                style={{ color: "wheat" }}
              >
                Find Jobs By Countries
              </h5>
              <div className="row m-0 p-0">
                {countryList?.map((v, i) => (
                  <small className="mb-0 p-0 col-12" key={i}>
                    <Link
                      className="text-light"
                      style={{ textDecoration: "none" }}
                      to={`/jobs/${v?.name}`}
                    >
                      Jobs in {v?.name}
                    </Link>
                  </small>
                ))}
              </div>
            </div>

            <hr className="d-md-none d-block mt-3" />

            {/* Find Jobs By Department */}
            <div className="col-lg-4 p-0">
              <h5
                className="mb-0 p-0 mb-3 mt-3 mt-lg-0"
                style={{ color: "wheat" }}
              >
                Find Jobs By Department
              </h5>
              <div className="row m-0 p-0">
                {departmentList
                  ?.slice(0, showFullDepartmentList ? departmentList.length : 4)
                  .map((v, i) => (
                    <small className="mb-0 p-0 col-12" key={i}>
                      <Link
                        className="text-light"
                        style={{ textDecoration: "none" }}
                        to={`/jobs/${v?.label}`}
                      >
                        Jobs for {v?.label}
                      </Link>
                    </small>
                  ))}

                {departmentList.length > 4 && (
                  <small
                    className="mb-0 p-0 col-12 text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      setShowFullDetartmentList(!showFullDepartmentList)
                    }
                  >
                    <b>{showFullDepartmentList ? "Show Less" : "Show More"}</b>{" "}
                    <i
                      className={
                        "fa " +
                        (showFullDepartmentList
                          ? "fa-caret-up"
                          : "fa-caret-down")
                      }
                    ></i>
                  </small>
                )}
              </div>
            </div>

            <hr className="d-md-none d-block mt-3" />

            {/* Find Jobs By Skill */}
            <div className="col-lg-4 p-0">
              <h5
                className="mb-0 p-0 mb-3 mt-3 mt-lg-0"
                style={{ color: "wheat" }}
              >
                Find Jobs By Skill
              </h5>
              <div className="row m-0 p-0">
                {skillList?.slice(0, 4).map((v, i) => (
                  <small className="mb-0 p-0 col-12" key={i}>
                    <Link
                      className="text-light"
                      style={{ textDecoration: "none" }}
                      to={`/jobs/${v?.skill.replace(/\s+/g, "-")}`}
                    >
                      Jobs for {v?.skill}
                    </Link>
                  </small>
                ))}

                {skillList.length > 4 && (
                  <small
                    className="mb-0 p-0 col-12 text-dark"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowFullSkillList(!showFullSkillList)}
                  >
                    <b>{showFullSkillList ? "Show Less" : "Show More"}</b>{" "}
                    <i
                      className={
                        "fa " +
                        (showFullSkillList ? "fa-caret-up" : "fa-caret-down")
                      }
                    ></i>
                  </small>
                )}
              </div>
            </div>
          </div>
        </div>
        {showFullSkillList && (
          <div className="pt-0 p-5 " style={{ background: "#437DAA" }}>
            <div
              className="row p-md-4 mb-3 rounded custom-scrollbar   shadow"
              style={{ height: "300px", background: "rgba(0, 0, 0, 0.1)" }}
            >
              {skillList?.map((v, i) => (
                <small className="mb-0 p-0 col-lg-4 col-md-4 col-12" key={i}>
                  <Link
                    className="text-light"
                    style={{ textDecoration: "none" }}
                    to={`/jobs/${v?.skill.replace(/\s+/g, "-")}`}
                  >
                    Jobs for {v?.skill}
                  </Link>
                </small>
              ))}
            </div>
          </div>
        )}
        <div className="pt-0 p-5 " style={{ background: "#437DAA" }}></div>
        <hr className="m-0" />
        <div
          className="row p-lg-5 p-md-3 p-3"
          style={{
            background: "linear-gradient(to right, #17487f, #17487f, #17487f)",
          }}
        >
          <div className="col-lg-3">
            <div className="mx-3">
              <div className="">
                <img
                  src="https://backend.overseas.ai/frontend/logo/logo_en.gif"
                  className="img-fluid rounded mt-2 mb-3"
                  style={{ height: "50px" }}
                  alt="logo Image"
                />
                <p>
                  Overseas.ai links skilled individuals with employers globally,
                  emphasizing practical expertise over academic qualifications.
                  It uses technology to capture and organize videos of new
                  skills, creating trustworthy video profiles. This approach
                  allows employers to assess candidates' hands-on abilities
                  before hiring.
                </p>
              </div>
            </div>
          </div>

          <div className="col-lg-3">
            <div className="mx-3">
              <h3>Contact Us</h3>
              <div>
                <div className="mb-1 d-flex">
                  {" "}
                  <i className="fa fa-address-card mt-1 me-2"></i>
                  <span>
                    CA 191, CA Block, Sector 1, Saltlake, Kolkata, West Bengal
                    700064
                  </span>
                </div>
                <div className="mb-1">
                  <a
                    className="text-light text-decoration-none"
                    href="tel:+91 1800 890 4788"
                  >
                    {" "}
                    <i className="fa fa-phone me-2"></i>1800 890 4788
                  </a>
                </div>
                <div className="mb-1">
                  <a
                    className="text-light text-decoration-none"
                    href="https://wa.me/9534404400"
                    target="_blank"
                  >
                    <i className="fa me-2 fa-whatsapp"></i>+91 9907591478
                  </a>
                </div>
                <div className="mb-1">
                  <a
                    className="text-light text-decoration-none"
                    href="mailto:contact@overseas.ai"
                  >
                    {" "}
                    <i className="fa fa-envelope me-2"></i> contact@overseas.ai
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="mx-3">
              <div className=" rounded">
                <h3 className="mb-1">Quick Links</h3>
                <div className="row m-0 p-0">
                  {quickLinks?.map((v, i) => {
                    return (
                      <p
                        className="mb-0 p-0 col-6"
                        style={{ cursor: "pointer" }}
                        onClick={() => navigate(v?.link)}
                      >
                        {v?.name}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="mx-3">
              <div className="  rounded">
                <h3 className="mb-1">Download Our App Now</h3>
                <div className="row justify-content-center mt-3">
                  <div className="col-4">
                    <img
                      src="/images/appQR.png"
                      className="img-fluid rounded shadow"
                      alt="app qr Image"
                    />
                  </div>
                  <div className="col-8 ">
                    <a href="https://play.google.com/store/apps/details?id=ai.overseas">
                      <img
                        src="https://admin.overseas.ai/newfrontend/image/google-play.png"
                        className="img-fluid px-2 py-1 rounded shadow bg-light"
                        alt="play store"
                      />
                    </a>
                  </div>
                </div>
                <hr />
                <h3 className="">Join Our Social Network</h3>
                <div className="m-0 d-flex">
                  {socialLinks?.map((v, i) => {
                    return (
                      <h3>
                        <a target="blank" href={v?.link}>
                          <i className={`me-3 text-light  ${v?.icon}`}></i>
                        </a>
                      </h3>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr className="m-0" />
      <p
        style={{
          fontSize: "18px",
          background: "linear-gradient(to right, #17487f, skyblue)",
        }}
        className="py-3 px-2 mb-0 text-center text-light"
      >
        <b>
          {" "}
          © 2021-2024 All Rights Reserved. Powered by Radiant Cybernetics in collaboration
          with IIT Kharagpur as Technology Partner.
        </b>
      </p>
    </>
  );
}

export default Footer;
