import React, { useEffect, useState } from "react";
import { getCountriesForJobs, getOccupations } from "../services/info.service";

function JobFilter({ setShowFilter, payload, setPayload }) {
  
  const [departmentList, setDepartmentList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [showFullDep, setShowFullDep] = useState(false);
  const [showFullCountry, setShowFullCountry] = useState(false);

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

  const getCountriesForJobsFunc = async () => {
    try {
      let response = await getCountriesForJobs();
      setCountryList(response?.countries);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCountriesForJobsFunc();
    getOccupationsListFunc();
  }, []);

  const handleCheckboxChange = (type, value, label) => {
    setPayload((prevState) => {
      const updated = { ...prevState };
      if (type === "jobOccupation") {
        if (updated.jobOccupation.includes(value)) {
          updated.jobOccupation = updated.jobOccupation.filter(
            (item) => item !== value
          );
        } else {
          updated.jobOccupation.push(value);
        }
      } else if (type === "jobLocationCountry") {
        if (updated.jobLocationCountry.includes(value)) {
          updated.jobLocationCountry = updated.jobLocationCountry.filter(
            (item) => item !== value
          );
        } else {
          updated.jobLocationCountry.push(value);
        }
      } else if (type === "passportType") {
        updated.passportType = updated.passportType === value ? "" : value;
      } else if (type === "languageRequired") {
        if (updated.languageRequired.includes(value)) {
          updated.languageRequired = updated.languageRequired.filter(
            (item) => item !== value
          );
        } else {
          updated.languageRequired.push(value);
        }
      } else if (type === "contractPeriod") {
        updated.contractPeriod = updated.contractPeriod === value ? "" : value;
      } else if (type === "jobExpTypeReq") {
        updated.jobExpTypeReq = updated.jobExpTypeReq === value ? "" : value;
      } else if (type === "sortBy") {
        updated.sortBy = updated.sortBy === value ? "" : value;
      }
      return updated;
    });
  };

  const handleRemoveBadge = (type, value) => {
    setPayload((prevState) => {
      const updated = { ...prevState };
      if (type === "jobOccupation") {
        updated.jobOccupation = updated.jobOccupation.filter(
          (item) => item !== value
        );
      } else if (type === "jobLocationCountry") {
        updated.jobLocationCountry = updated.jobLocationCountry.filter(
          (item) => item !== value
        );
      } else if (type === "passportType") {
        updated.passportType = "";
      } else if (type === "languageRequired") {
        updated.languageRequired = updated.languageRequired.filter(
          (item) => item !== value
        );
      } else if (type === "contractPeriod") {
        updated.contractPeriod = "";
      }
      return updated;
    });
  };

  const handleApplyFilters = () => {
    setShowFilter(false)
  };

  const getLabelById = (id, list) => {
    const item = list.find((v) => v.value === id);
    return item ? item.label : id;
  };

  const getCountryNameById = (id) => {
    const country = countryList.find((v) => v.id === id);
    return country ? country.name : id;
  };

  return (
    <div
      className="col-lg-3 col-md-4 col-12 mt-4 rounded filterDiv"
      style={{ background: "whitesmoke", overflow: "auto" }}
    >
      <div>
        <div className="d-flex justify-content-between p-2 mt-2 align-items-center">
          <h5>
            <i className="fa fa-filter me-1"></i>Filters
          </h5>
          {window.innerWidth <= 700 && (
            <h5>
              <i
                className="fa fa-close text-danger border px-1 rounded"
                onClick={() => setShowFilter(false)}
              ></i>
            </h5>
          )}
        </div>
        <div className="mb-2">
          <div className="d-flex flex-wrap">
            {Object.entries(payload).map(([key, values]) =>
              Array.isArray(values) && values.length > 0 ? (
                values.map((item) => (
                  <p
                    key={item}
                    className="badge border rounded bg-secondary me-2"
                  >
                    {key === "jobLocationCountry"
                      ? getCountryNameById(item)
                      : key === "jobOccupation"
                      ? getLabelById(item, departmentList)
                      : item}
                    <i
                      className="fa fa-close text-dark ms-2 bg-light p-1 rounded"
                      onClick={() => handleRemoveBadge(key, item)}
                    ></i>
                  </p>
                ))
              ) : key === "passportType" && values ? (
                <p
                  key={values}
                  className="badge border rounded bg-secondary me-2"
                >
                  {values}
                  <i
                    className="fa fa-close text-dark ms-2 bg-light p-1 rounded"
                    onClick={() => handleRemoveBadge(key, values)}
                  ></i>
                </p>
              ) : key === "contractPeriod" && values ? (
                <p
                  key={values}
                  className="badge border rounded bg-secondary me-2"
                >
                  {values === "more"
                    ? "More than 36 months"
                    : `0 to ${values} months`}
                  <i
                    className="fa fa-close text-dark ms-2 bg-light p-1 rounded"
                    onClick={() => handleRemoveBadge(key, values)}
                  ></i>
                </p>
              ) : null
            )}
          </div>
          {window.innerWidth<700 && <button
            className="btn btn-sm btn-outline-primary w-100"
            onClick={handleApplyFilters}
          >
            Apply
          </button>}
          
          <hr />
        </div>
      </div>
      <div className="filterDiv-height pe-2">
        <div className="ms-2">
          <h6 className="mt-2">Sort By</h6>
          {[
            "service_charge_asc",
            "salary_desc",
            "experience_asc",
            "age_limit_desc",
            "date_posted_desc",
            "working_hours_asc",
          ].map((sortOption) => (
            <div key={sortOption} className="d-flex mb-2 align-items-center">
              <input
                type="radio"
                value={sortOption}
                checked={payload.sortBy === sortOption}
                onChange={() => handleCheckboxChange("sortBy", sortOption)}
                className="me-2"
              />
              <span>
                {sortOption === "service_charge_asc" &&
                  "Service Charge - Low to high"}
                {sortOption === "salary_desc" && "Salary - High to Low"}
                {sortOption === "experience_asc" &&
                  "Experience - Fresher to Experienced"}
                {sortOption === "age_limit_desc" && "Age limit - High to Low"}
                {sortOption === "date_posted_desc" &&
                  "Date posted - New to Old"}
                {sortOption === "working_hours_asc" &&
                  "Working Hours - low to High"}
              </span>
            </div>
          ))}
        </div>
        <hr />
        <div className="ms-2 mt-3">
          <h6>Department</h6>
          <div className="mt-2">
            {showFullDep
              ? departmentList.map((v, i) => (
                  <div key={i} className="d-flex mb-2 align-items-center">
                    <input
                      type="checkbox"
                      value={v.value}
                      className="me-2"
                      checked={payload.jobOccupation.includes(v.value)}
                      onChange={() =>
                        handleCheckboxChange("jobOccupation", v.value, v.label)
                      }
                    />
                    <span>{v.label}</span>
                  </div>
                ))
              : departmentList.slice(0, 6).map((v, i) => (
                  <div key={i} className="d-flex mb-2 align-items-center">
                    <input
                      type="checkbox"
                      value={v.value}
                      className="me-2"
                      checked={payload.jobOccupation.includes(v.value)}
                      onChange={() =>
                        handleCheckboxChange("jobOccupation", v.value, v.label)
                      }
                    />
                    <span>{v.label}</span>
                  </div>
                ))}
            {showFullDep ? (
              <h6 className="textBlue" onClick={() => setShowFullDep(false)}>
                <u>Show Less Option</u>
              </h6>
            ) : (
              departmentList.length > 6 && (
                <h6 className="textBlue" onClick={() => setShowFullDep(true)}>
                  <u>{departmentList.length - 6} more department(s)</u>
                </h6>
              )
            )}
          </div>
        </div>
        <hr />
        <div className="ms-2 mt-3">
          <h6>Country</h6>
          <div className="mt-2">
            {showFullCountry
              ? countryList.map((v, i) => (
                  <div key={i} className="d-flex mb-2 align-items-center">
                    <input
                      type="checkbox"
                      value={v.id}
                      className="me-2"
                      checked={payload.jobLocationCountry.includes(v.id)}
                      onChange={() =>
                        handleCheckboxChange("jobLocationCountry", v.id, v.name)
                      }
                    />
                    <span>{v.name}</span>
                  </div>
                ))
              : countryList.slice(0, 6).map((v, i) => (
                  <div key={i} className="d-flex mb-2 align-items-center">
                    <input
                      type="checkbox"
                      value={v.id}
                      className="me-2"
                      checked={payload.jobLocationCountry.includes(v.id)}
                      onChange={() =>
                        handleCheckboxChange("jobLocationCountry", v.id, v.name)
                      }
                    />
                    <span>{v.name}</span>
                  </div>
                ))}
            {showFullCountry ? (
              <h6
                className="textBlue"
                onClick={() => setShowFullCountry(false)}
              >
                <u>Show Less Option</u>
              </h6>
            ) : (
              countryList.length > 6 && (
                <h6
                  className="textBlue"
                  onClick={() => setShowFullCountry(true)}
                >
                  <u>{countryList.length - 6} more country(s)</u>
                </h6>
              )
            )}
          </div>
        </div>
        <hr />
        <div className="ms-2 mt-3">
          <h6>Passport Type</h6>
          <div className="mt-2">
            {["ECR", "ECNR", "ECR/ECNR"].map((type) => (
              <div key={type} className="d-flex mb-2 align-items-center">
                <input
                  type="radio"
                  value={type}
                  checked={payload.passportType === type}
                  onChange={() => handleCheckboxChange("passportType", type)}
                  className="me-2"
                />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div className="ms-2 mt-3">
          <h6>Experience Type</h6>
          <div className="mt-2">
            {["No", "National", "International", "Any"].map((type) => (
              <div key={type} className="d-flex mb-2 align-items-center">
                <input
                  type="radio"
                  value={type}
                  checked={payload.jobExpTypeReq === type}
                  onChange={() => handleCheckboxChange("jobExpTypeReq", type)}
                  className="me-2"
                />
                <span>{type}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div className="ms-2 mt-3">
          <h6>Language Required</h6>
          <div className="mt-2">
            {["English", "Arabic", "Japanese", "German", "Hindi"].map(
              (language) => (
                <div key={language} className="d-flex mb-2 align-items-center">
                  <input
                    type="checkbox"
                    value={language}
                    className="me-2"
                    checked={payload.languageRequired.includes(language)}
                    onChange={() =>
                      handleCheckboxChange("languageRequired", language)
                    }
                  />
                  <span>{language}</span>
                </div>
              )
            )}
          </div>
        </div>
        <hr />
        <div className="ms-2 mt-3">
          <h6>Contract Period</h6>
          <div className="mt-2">
            {["12", "24", "36", "more"].map((period) => (
              <div key={period} className="d-flex mb-2 align-items-center">
                <input
                  type="radio"
                  value={period}
                  checked={payload.contractPeriod === period}
                  onChange={() =>
                    handleCheckboxChange("contractPeriod", period)
                  }
                  className="me-2"
                />
                <span>
                  {period === "more"
                    ? "More than 36 months"
                    : `0 to ${period} months`}
                </span>
              </div>
            ))}
          </div>
        </div>
        <hr />
      </div>
    </div>
  );
}

export default JobFilter;
