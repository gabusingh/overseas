import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
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
} from "../services/info.service";

import { useNavigate, Link } from "react-router-dom";
import Select from "react-select";
import {
  registerUserStep1,
  addExperienceStep2,
} from "../services/user.service";
import { ToastContainer, toast } from "react-toastify";
// Define the validation schema using Yup
const validationSchema = Yup.object().shape({
  empDob: Yup.date().required("Date of Birth is required"),

  empGender: Yup.string().required("Gender is required"),
  empWhatsapp: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .required("WhatsApp Number is required"),
  empWhatsappCountryCode: Yup.string().required("Country code is required"),
  // empLanguage: Yup.string().required('Languages Known is required'),
  empMS: Yup.string().required("Marital Status is required"),
  empPassportQ: Yup.string().required("Passport information is required"),
  empSkill: Yup.string().required("Preffered Department is required"),
  empOccuId: Yup.string().required("Preffered Occupation is required"),
  empInternationMigrationExp: Yup.string().required(
    "International Migration Experience is required"
  ),
  empEdu: Yup.string().required("Education is required"),
  empTechEdu: Yup.string().required("Technical Education is required"),
  empState: Yup.string().required("State is required"),
  empDistrict: Yup.string().required("District is required"),
  empPS: Yup.string(),
  empPSName: Yup.string(),
  empPanchayatID: Yup.string(),
  empPanchayat: Yup.string(),
  empVillage: Yup.string(),
  empVillageID: Yup.string(),
  empPin: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(6, "Must be exactly 6 digits")
    .max(6, "Must be exactly 6 digits")
    .required("Pin Code is required"),
  empEmail: Yup.string().email("Invalid email"),
  empDailyWage: Yup.string().required("Present Monthly Income is required"),
  empExpectedMonthlyIncome: Yup.string().required(
    "Expected Monthly Income is required"
  ),
  empRelocationIntQ: Yup.string().required(
    "Job location prefference  is required"
  ),
  empRelocationIntQCountry: Yup.string().when("empRelocationIntQ", {
    is: "yes",
    then: Yup.string().required("Relocation Country is required"),
  }),
  empRelocationIntQState: Yup.string().when("empRelocationIntQ", {
    is: "yes",
    then: Yup.string().required("Relocation State is required"),
  }),
  empRefName: Yup.string().required("Reference Name is required"),
  empRefPhone: Yup.string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Must be exactly 10 digits")
    .max(10, "Must be exactly 10 digits")
    .required("Reference Phone is required"),
  empRefDistance: Yup.string().required("Distance from Reference is required"),
});
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
const refrenceDistanceOption = [
  { label: "0-5 km", value: "0-5 km" },
  { label: "5-10 km", value: "5-10 km" },
  { label: "10-25 km", value: "10-25 km" },
  { label: "25-50 km", value: "25-50 km" },
  { label: "50-100 km", value: "50-100 km" },
  { label: "Above 100 km", value: "Above 100 km" },
];

const CandidateRegister = () => {
  const navigate = useNavigate();
  const [countryCodeArr, setCountryCodeArr] = useState([]);
  const initialValues = {
    empDob: "",
    empGender: "",
    empWhatsapp: "",
    empWhatsappCountryCode: "+91",
    // empLanguage: "",
    empMS: "",
    empPassportQ: "",
    empSkill: "",
    empOccuId: "",
    empInternationMigrationExp: "",
    empEdu: "",
    empTechEdu: "",
    empState: "",
    empDistrict: "",
    empPS: "",
    empPSName: "",
    empPanchayatID: "",
    empPanchayat: "",
    empVillage: "",
    empVillageID: "",
    empPin: "",
    empEmail: "",
    empDailyWage: "",
    empExpectedMonthlyIncome: "",
    empRelocationIntQ: "",
    empRelocationIntQCountry: "",
    empRelocationIntQState: "",
    empRefName: "",
    empRefPhone: "",
    empRefDistance: "",
  };
  const [empLanguage, setEmpLanguage]=useState([])
  const handleSubmit = async (values) => {
    try {
      const finalPayload = {
        ...values,
        empLanguage: JSON.stringify(empLanguage),
        type:"web"
      };
      let response = await registerUserStep1(
        finalPayload,
        JSON.parse(localStorage.getItem("semiUser")).access_token
      );
      if (response?.msg == "Data Updated Successfully") {
        toast.success("Data Updated Successfully");
        localStorage.setItem("loggedUser", JSON.stringify(response));
        localStorage.removeItem("semiUser");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Internal Server Error");
      console.log(error)
    }
  };

  const [skillList, setSkillList] = useState([]);
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
  const [stateListforPref, setStateListforPref] = useState([]);
  const [stateList, setStateList] = useState([]);
  const getStateList = async () => {
    try {
      let response = await getState();
      let state = response.data.states.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      let statePref = response.data.states.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      setStateList(state);
      setStateListforPref(statePref);
    } catch (error) {
      console.log(error);
    }
  };
  const [districtList, setDistrictList] = useState([]);
  const getDistrictListFunc = async (value) => {
    try {
      let response = await getDistrict(value);
      let district = response.districts.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setDistrictList(district);
    } catch (error) {
      console.log(error);
    }
  };
  const [psList, setPsList] = useState([]);
  const getPoliceStationById = async (id) => {
    try {
      let response = await getPs(id);
      let psList = response?.data?.ps_list.map((item) => ({
        label: item.name,
        value: item.id,
      }));

      setPsList(psList);
    } catch (error) {
      console.log(error);
    }
  };
  const [panchayatList, setPanchayatList] = useState([]);
  const getPanchayatById = async (id) => {
    try {
      let response = await getPanchayat(id);
      let panchayatList = response?.data.panchayat_list.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setPanchayatList(panchayatList);
    } catch (error) {
      console.log(error);
    }
  };
  const [villageList, setVillageList] = useState([]);
  const getVillageList = async (id) => {
    try {
      let response = await getVillage(id);
      let villageList = response?.data.village_list.map((item) => ({
        label: item.name,
        value: item.id,
      }));
      setVillageList(villageList);
    } catch (error) {
      console.log(error);
    }
  };
  const [countryList, setCountryList] = useState([]);
  const getListOfCountry = async () => {
    try {
      let response = await getCountries();
      let country = response.countries.map((item) => ({
        label: item.name,
        value: item.name,
      }));
      setCountryList(country);
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
  useEffect(() => {
    const getListOfCountryCode = async () => {
      try {
        let response = await getCountryCode();
        setCountryCodeArr(response?.data?.countryCodes);
      } catch (error) {
        console.log(error);
      }
    };
    getOccupationList();
    getStateList();
    getListOfCountry();
    getListOfCountryCode();
  }, []);
  const handleLanguageChange = (e)=>{
    e.map((v, i)=>{
      return(
        setEmpLanguage([...empLanguage, v.value])
      )
    })
  }
  return (
    <div className="container mt-5 pt-5 customLabel">
      <div className="mt-md-5 py-5 mb-5">
        <h2 className="text-center mb-5 mt-3">
          {" "}
          <i className="fa fa-user me-2"></i>Register yourself as a Candidate
        </h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <div className="row m-0 px-0">
                <div
                  className="row border mx-0 px-0 shadow-sm rounded my-3 py-3 col-12"
                  style={{ background: "#F4FAFD" }}
                >
                  <p className="mb-0">Personal Details</p>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empDob">Date Of Birth*</label>
                    <Field
                      type="date"
                      name="empDob"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empDob}
                    />
                    {errors.empDob && touched.empDob ? (
                      <div className="text-danger">{errors.empDob}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empGender">Gender*</label>
                    <Field
                      as="select"
                      name="empGender"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empGender}
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </Field>
                    {errors.empGender && touched.empGender ? (
                      <div className="text-danger">{errors.empGender}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empWhatsapp">WhatsApp Number</label>
                    <div className="d-flex">
                      <Field
                        as="select"
                        name="empWhatsappCountryCode"
                        className="form-control"
                        style={{
                          width: "17%",
                          borderTopRightRadius: "0px",
                          borderBottomRightRadius: "0px",
                        }}
                      >
                        <option value="+91">+91 India</option>
                        {countryCodeArr.map((v, i) => (
                          <option
                            key={i}
                            value={`+${v.countryCode}`}
                          >{`+${v.countryCode} ${v.name}`}</option>
                        ))}
                      </Field>
                      <Field
                        type="text"
                        name="empWhatsapp"
                        className="form-control"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.empWhatsapp}
                        placeholder="Enter your whatsapp number"
                        style={{
                          width: "83%",
                          borderTopLeftRadius: "0px",
                          borderBottomLeftRadius: "0px",
                        }}
                      />
                    </div>
                    {errors.empWhatsapp && touched.empWhatsapp ? (
                      <div className="text-danger">{errors.empWhatsapp}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empEmail">Email</label>
                    <Field
                      type="email"
                      name="empEmail"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empEmail}
                    />
                    {errors.empEmail && touched.empEmail ? (
                      <div className="text-danger">{errors.empEmail}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empMS">Marital Status*</label>
                    <Field
                      as="select"
                      name="empMS"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empMS}
                    >
                      <option value="">Select Marital Status</option>
                      <option value="Unmarried">Unmarried</option>
                      <option value="Married">Married</option>
                    </Field>
                    {errors.empMS && touched.empMS ? (
                      <div className="text-danger">{errors.empMS}</div>
                    ) : null}
                  </div>
                </div>
                <div
                  className="row mx-0 px-0 border shadow-sm rounded my-3 py-3 col-12"
                  style={{ background: "#E6E6FA" }}
                >
                  <p className="mb-0">Educational Details</p>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empLanguage">Languages Known</label>
                    {/* <Field
                      as="select"
                      name="empLanguage"
                      className="form-control"
                      // onChange={(event) => handleLanguageChange(event, setFieldValue)}
                      // multiple={true}
                    >
                      <option value="">Select </option>
                      {languageOption.map((v, i) => (
                        <option key={i} value={v.label}>
                          {v?.label}
                        </option>
                      ))}
                    </Field> */}
                    <Select isMulti={true} options={languageOption} onChange={(e)=>handleLanguageChange(e) }/>
                    {errors.empLanguage && touched.empLanguage ? (
                      <div className="text-danger">{errors.empLanguage}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empEdu">
                      Highest Education Qualification*
                    </label>
                    <Field
                      as="select"
                      name="empEdu"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empEdu}
                    >
                      <option value="">Select</option>
                      {highestEducationArr?.map((v, i) => {
                        return <option value={v?.value}>{v?.label}</option>;
                      })}
                    </Field>
                    {errors.empEdu && touched.empEdu ? (
                      <div className="text-danger">{errors.empEdu}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empTechEdu">
                      Technical / Vocational Education*
                    </label>
                    <Field
                      as="select"
                      name="empTechEdu"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empTechEdu}
                    >
                      <option value="">Select</option>
                      {vocationalEduArr?.map((v, i) => {
                        return <option value={v?.value}>{v?.label}</option>;
                      })}
                    </Field>
                    {errors.empTechEdu && touched.empTechEdu ? (
                      <div className="text-danger">{errors.empTechEdu}</div>
                    ) : null}
                  </div>
                </div>
                <div
                  className="row border mx-0 px-0 shadow-sm rounded my-3 py-3 col-12"
                  style={{ background: "#F5F5F5" }}
                >
                  <p className="mb-0">Carrer Objectives</p>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empPassportQ">
                      Do you have a passport?*
                    </label>
                    <Field
                      as="select"
                      name="empPassportQ"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empPassportQ}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Field>
                    {errors.empPassportQ && touched.empPassportQ ? (
                      <div className="text-danger">{errors.empPassportQ}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empSkill">
                      Preferred Working Department*
                    </label>
                    <Field
                      as="select"
                      name="empSkill"
                      className="form-control"
                      onChange={(e) => {
                        handleChange(e);
                        getSkillList(e.target.value);
                      }}
                      onBlur={handleBlur}
                      value={values.empSkill}
                    >
                      <option value="">Select</option>
                      {occupations?.map((v, i) => (
                        <option key={i} value={v?.value}>
                          {v?.label}
                        </option>
                      ))}
                    </Field>

                    {errors.empSkill && touched.empSkill ? (
                      <div className="text-danger">{errors.empSkill}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empOccuId">Preferred Occupation*</label>
                    <Field
                      as="select"
                      name="empOccuId"
                      className="form-control"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.empOccuId}
                    >
                      <option value="">Select</option>
                      {skillList?.map((v, i) => (
                        <option key={i} value={v?.value}>
                          {v?.label}
                        </option>
                      ))}
                    </Field>

                    {errors.empOccuId && touched.empOccuId ? (
                      <div className="text-danger">{errors.empOccuId}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empInternationMigrationExp">
                      Do you have International Migration Experience?
                    </label>

                    <Field
                      as="select"
                      name="empInternationMigrationExp"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empInternationMigrationExp}
                    >
                      <option value="">Select</option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </Field>
                    {errors.empInternationMigrationExp &&
                    touched.empInternationMigrationExp ? (
                      <div className="text-danger">
                        {errors.empInternationMigrationExp}
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empDailyWage">
                      Present Monthly Income*
                    </label>
                    <Field
                      type="text"
                      name="empDailyWage"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empDailyWage}
                    />
                    {errors.empDailyWage && touched.empDailyWage ? (
                      <div className="text-danger">{errors.empDailyWage}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empExpectedMonthlyIncome">
                      Expected Monthly Income*
                    </label>
                    <Field
                      type="text"
                      name="empExpectedMonthlyIncome"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empExpectedMonthlyIncome}
                    />
                    {errors.empExpectedMonthlyIncome &&
                    touched.empExpectedMonthlyIncome ? (
                      <div className="text-danger">
                        {errors.empExpectedMonthlyIncome}
                      </div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empRelocationIntQ">
                      Prefered Job Location
                    </label>
                    <Field
                      as="select"
                      name="empRelocationIntQ"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empRelocationIntQ}
                    >
                      <option value="">Select</option>
                      <option value="Yes">International</option>
                      <option value="No">National</option>
                    </Field>
                    {errors.empRelocationIntQ && touched.empRelocationIntQ ? (
                      <div className="text-danger">
                        {errors.empRelocationIntQ}
                      </div>
                    ) : null}
                  </div>
                  {values.empRelocationIntQ === "Yes" ? (
                    <div className="form-group col-md-6 my-2">
                      <label htmlFor="empRelocationIntQCountry">
                        Relocation Country
                      </label>
                      <Field
                        as="select"
                        name="empRelocationIntQCountry"
                        className="form-control"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        value={values.empRelocationIntQCountry}
                      >
                        <option value="">Select</option>
                        {countryList?.map((v, i) => (
                          <option key={i} value={v?.value}>
                            {v?.label}
                          </option>
                        ))}
                      </Field>

                      {errors.empRelocationIntQCountry &&
                      touched.empRelocationIntQCountry ? (
                        <div className="text-danger">
                          {errors.empRelocationIntQCountry}
                        </div>
                      ) : null}
                    </div>
                  ) : (
                    <div className="form-group col-md-6 my-2">
                      <label htmlFor="empRelocationIntQState">
                        Relocation State
                      </label>
                      <Field
                        as="select"
                        name="empRelocationIntQState"
                        className="form-control"
                        onChange={(e) => {
                          handleChange(e);
                        }}
                        onBlur={handleBlur}
                        value={values.empRelocationIntQState}
                      >
                        <option value="">Select</option>
                        {stateList?.map((v, i) => (
                          <option key={i} value={v?.value}>
                            {v?.label}
                          </option>
                        ))}
                      </Field>

                      {errors.empRelocationIntQState &&
                      touched.empRelocationIntQState ? (
                        <div className="text-danger">
                          {errors.empRelocationIntQState}
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
                <div
                  className="row border mx-0 px-0 shadow-sm rounded my-3 py-3 col-12"
                  style={{ background: "#FDF5E6  " }}
                >
                  <p className="mb-0">Address Details</p>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empState">State</label>
                    <Field
                      as="select"
                      name="empState"
                      className="form-control"
                      onChange={(e) => {
                        handleChange(e);
                        getDistrictListFunc(e.target.value);
                      }}
                      onBlur={handleBlur}
                      value={values.empState}
                    >
                      <option value="">Select</option>
                      {stateList?.map((v, i) => (
                        <option key={i} value={v?.value}>
                          {v?.label}
                        </option>
                      ))}
                    </Field>

                    {errors.empState && touched.empState ? (
                      <div className="text-danger">{errors.empState}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empDistrict">District</label>
                    <Field
                      as="select"
                      name="empDistrict"
                      className="form-control"
                      onChange={(e) => {
                        handleChange(e);
                        getPoliceStationById(e.target.value);
                      }}
                      onBlur={handleBlur}
                      value={values.empDistrict}
                    >
                      <option value="">Select</option>
                      {districtList?.map((v, i) => (
                        <option key={i} value={v?.value}>
                          {v?.label}
                        </option>
                      ))}
                    </Field>
                    {errors.empDistrict && touched.empDistrict ? (
                      <div className="text-danger">{errors.empDistrict}</div>
                    ) : null}
                  </div>
                  {values.empState == 35 ? (
                    <>
                      <div className="form-group col-md-6 my-2">
                        <label htmlFor="empPS">Select Police Station</label>
                        <Field
                          as="select"
                          name="empPS"
                          className="form-control"
                          onChange={(e) => {
                            handleChange(e);
                            getPanchayatById(e.target.value);
                            getVillageList(e.target.value);
                          }}
                          onBlur={handleBlur}
                          value={values.empPS}
                        >
                          <option value="">Select</option>
                          {psList?.map((v, i) => (
                            <option key={i} value={v?.value}>
                              {v?.label}
                            </option>
                          ))}
                        </Field>

                        {errors.empPS && touched.empPS ? (
                          <div className="text-danger">{errors.empPS}</div>
                        ) : null}
                      </div>
                      <div className="form-group col-md-6 my-2">
                        <label htmlFor="empPanchayatID">Select Panchayat</label>
                        <Field
                          as="select"
                          name="empPanchayatID"
                          className="form-control"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.empPanchayatID}
                        >
                          <option value="">Select</option>
                          {panchayatList?.map((v, i) => (
                            <option key={i} value={v?.value}>
                              {v?.label}
                            </option>
                          ))}
                        </Field>

                        {errors.empPanchayatID && touched.empPanchayatID ? (
                          <div className="text-danger">
                            {errors.empPanchayatID}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group col-md-6 my-2">
                        <label htmlFor="empVillageID">Select Village</label>
                        <Field
                          as="select"
                          name="empVillageID"
                          className="form-control"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          onBlur={handleBlur}
                          value={values.empVillageID}
                        >
                          <option value="">Select</option>
                          {villageList?.map((v, i) => (
                            <option key={i} value={v?.value}>
                              {v?.label}
                            </option>
                          ))}
                        </Field>

                        {errors.empVillageID && touched.empVillageID ? (
                          <div className="text-danger">
                            {errors.empVillageID}
                          </div>
                        ) : null}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="form-group col-md-6 my-2">
                        <label htmlFor="empPSName">Police Station Name</label>
                        <Field
                          type="text"
                          name="empPSName"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.empPSName}
                        />
                        {errors.empPSName && touched.empPSName ? (
                          <div className="text-danger">{errors.empPSName}</div>
                        ) : null}
                      </div>

                      <div className="form-group col-md-6 my-2">
                        <label htmlFor="empPanchayat">Panchayat Name</label>
                        <Field
                          type="text"
                          name="empPanchayat"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.empPanchayat}
                        />
                        {errors.empPanchayat && touched.empPanchayat ? (
                          <div className="text-danger">
                            {errors.empPanchayat}
                          </div>
                        ) : null}
                      </div>
                      <div className="form-group col-md-6 my-2">
                        <label htmlFor="empVillage">Village Name</label>
                        <Field
                          type="text"
                          name="empVillage"
                          className="form-control"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.empVillage}
                        />
                        {errors.empVillage && touched.empVillage ? (
                          <div className="text-danger">{errors.empVillage}</div>
                        ) : null}
                      </div>
                    </>
                  )}

                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empPin">Pin Code</label>
                    <Field
                      type="text"
                      name="empPin"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empPin}
                    />
                    {errors.empPin && touched.empPin ? (
                      <div className="text-danger">{errors.empPin}</div>
                    ) : null}
                  </div>
                </div>
                <div
                  className="row border mx-0 px-0 shadow-sm rounded my-3 py-3 col-12"
                  style={{ background: "#F8F8FF " }}
                >
                  <p className="mb-0">Refference Details</p>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empRefName">Reference Name</label>
                    <Field
                      type="text"
                      name="empRefName"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empRefName}
                    />
                    {errors.empRefName && touched.empRefName ? (
                      <div className="text-danger">{errors.empRefName}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empRefPhone">Reference Phone</label>
                    <Field
                      type="text"
                      name="empRefPhone"
                      className="form-control"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.empRefPhone}
                    />
                    {errors.empRefPhone && touched.empRefPhone ? (
                      <div className="text-danger">{errors.empRefPhone}</div>
                    ) : null}
                  </div>
                  <div className="form-group col-md-6 my-2">
                    <label htmlFor="empRefDistance">
                      Distance from Reference
                    </label>
                    <Field
                      as="select"
                      name="empRefDistance"
                      className="form-control"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.empRefDistance}
                    >
                      <option value="">Select</option>
                      {refrenceDistanceOption?.map((v, i) => (
                        <option key={i} value={v?.value}>
                          {v?.label}
                        </option>
                      ))}
                    </Field>

                    {errors.empRefDistance && touched.empRefDistance ? (
                      <div className="text-danger">{errors.empRefDistance}</div>
                    ) : null}
                  </div>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-5">
                Submit
              </button>
            </Form>
          )}
        </Formik>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CandidateRegister;
