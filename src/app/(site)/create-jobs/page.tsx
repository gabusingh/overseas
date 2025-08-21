"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createJobByHr } from "@/services/hra.service";
import {
  getCountries,
  getOccupations,
  getSkillsByOccuId,
} from "@/services/info.service";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import * as CustomSelect from "@/components/ui/select";

// Types
type FormDataType = {
  jobTitle: string;
  jobOccupation: string;
  jobSkill: string[];
  cmpNameACT: string;
  jobLocationCountry: string;
  jobDeadline: string;
  jobVacancyNo: string;
  jobWages: string;
  jobMode: string;
  jobInterviewPlace: string;
  jobInterviewDate: string;
  jobWagesCurrencyType: string;
  salary_negotiable: string;
  passport_type: string;
  service_charge: string;
  contract_period: string;
  expCerificateReq: string;
  DLReq: string;
  jobWorkVideoReq: string;
  jobExpReq: string;
  jobExpTypeReq: string;
  jobExpDuration: string;
  jobWorkingDay: string;
  jobWorkingHour: string;
  jobOvertime: string;
  jobFood: string;
  jobAccommodation: string;
  jobMedicalFacility: string;
  jobTransportation: string;
  jobAgeLimit: string;
  jobDescription: string;
  jobPhoto: File | null;
  hrName: string;
  hrEmail: string;
  hrNumber: string;
  companyJobID: string;
  languageRequired: string[];
  jobArea: string;
};

type ErrorType = Partial<Record<keyof FormDataType, string>>;

const CreateJobs = () => {
  const router = useRouter();
  const [skillList, setSkillList] = useState<{label: string; value: string}[]>([]);
  const [countryList, setCountryList] = useState<{label: string; value: string}[]>([]);
  const [currencyList, setCurrencyList] = useState<{label: string; value: string}[]>([]);
  const [occupations, setOccupations] = useState<{label: string; value: string}[]>([]);
  const [hrList, setHrList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const getSkillList = async (id: string) => {
    try {
      const occuId = Number(id);
      if (!occuId) {
        setSkillList([]);
        return;
      }
      let response = await getSkillsByOccuId(occuId);
      let skills = response?.skills?.map((item: any) => ({
        label: item.skill,
        value: item.id,
      }));
      setSkillList(skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const getListOfCountry = async () => {
    try {
      let response = await getCountries();
  let countries: any[] = Array.isArray(response) ? response : (response as any)?.countries || [];
      let country = countries.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));
      let currency = countries.map((item: any) => ({
        label: item.currencyName,
        value: item.currencyName,
      }));
      setCountryList(country);
      setCurrencyList(currency);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const getOccupationList = async () => {
    try {
      let response = await getOccupations();
  let occupationList: any[] = Array.isArray(response) ? response : (response as any)?.occupation || [];
      let occupations = occupationList?.map((item: any) => ({
        label: item.occupation,
        value: item.id,
      }));
      setOccupations(occupations || []);
    } catch (error) {
      console.error("Error fetching occupations:", error);
    }
  };

  useEffect(() => {
    getOccupationList();
    getListOfCountry();
  }, []);

  const [formData, setFormData] = useState<FormDataType>({
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

  useEffect(() => {
    getSkillList(formData?.jobOccupation);
  }, [formData?.jobOccupation]);

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    if (type === "file") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: files && files[0] ? files[0] : null,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const [errors, setErrors] = useState<ErrorType>({});

  const formValidation = () => {
    const errors: ErrorType = {};

    if (!formData.jobTitle.trim()) errors.jobTitle = "Job Title is required";
    if (!formData.jobOccupation) errors.jobOccupation = "Job Occupation is required";
    if (formData.jobSkill.length === 0) errors.jobSkill = "Job Skill is required";
    if (!formData.jobLocationCountry.trim()) errors.jobLocationCountry = "Job Location Country is required";
    if (!formData.jobDeadline.trim()) errors.jobDeadline = "Job Deadline is required";
    if (!formData.jobVacancyNo.trim()) errors.jobVacancyNo = "Job Vacancy Number is required";
    if (!formData.jobWagesCurrencyType.trim()) errors.jobWagesCurrencyType = "Wages Currency Type is required";
    if (!formData.salary_negotiable.trim()) errors.salary_negotiable = "Salary Negotiable Status is required";
    if (!formData.passport_type.trim()) errors.passport_type = "Passport Type is required";
    if (!formData.contract_period.trim()) errors.contract_period = "Contract Period is required";
    if (!formData.jobExpReq.trim()) errors.jobExpReq = "Job Experience Required is required";
    if (!formData.jobWorkingDay.trim()) errors.jobWorkingDay = "Job Working Day is required";
    if (!formData.jobWorkingHour.trim()) errors.jobWorkingHour = "Job Working Hour is required";
    if (!formData.jobOvertime.trim()) errors.jobOvertime = "Job Overtime is required";
    if (!formData.jobFood.trim()) errors.jobFood = "Food Provision is required";
    if (!formData.jobAccommodation.trim()) errors.jobAccommodation = "Accommodation is required";
    if (!formData.jobMedicalFacility.trim()) errors.jobMedicalFacility = "Medical Facility is required";
    if (!formData.jobTransportation.trim()) errors.jobTransportation = "Transportation is required";
    if (!formData.jobAgeLimit.trim()) errors.jobAgeLimit = "Age Limit is required";
    if (formData.languageRequired.length === 0) errors.languageRequired = "Language Required is required";

    if (formData.jobAgeLimit && !(Number(formData.jobAgeLimit) >= 18 && Number(formData.jobAgeLimit) < 61)) {
      errors.jobAgeLimit = "Age must be between 18 to 60 years.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!formValidation()) {
      toast.error("Form Validation Failed");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Please log in to create a job");
        router.push("/login");
        return;
      }

      const createFormData = new FormData();
      // Append all form data
      (Object.keys(formData) as (keyof FormDataType)[]).forEach(key => {
        if (key === "jobSkill" || key === "languageRequired") {
          createFormData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] !== null && formData[key] !== "") {
          // @ts-ignore
          createFormData.append(key, formData[key] as any);
        }
      });

  // createJobByHr expects (formData: FormData, token: string)
  const response = await createJobByHr(createFormData, token);

      if (response.data.message === "Job created successfully") {
        toast.success("Job Created Successfully");
        // Reset form
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
          router.push("/hra-jobs");
        }, 1500);
      } else {
        toast.error("Internal Server Error");
      }
    } catch (error) {
      console.error("Error creating job:", error);
      toast.error("Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  const formFields = [
    { name: "jobTitle", label: "Job Title", type: "text" },
    {
      name: "jobOccupation",
      label: "Job Department",
      type: "select",
      options: [{ label: "Select Department", value: "" }, ...occupations],
    },
    {
      name: "jobSkill",
      label: "Job Skill (Multiple)",
      type: "multiple",
      options: [{ label: "Select Skill", value: "" }, ...skillList],
    },
    { name: "cmpNameACT", label: "Actual Hiring Company", type: "text" },
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
      type: "select",
      options: [{ label: "Select Country", value: "" }, ...countryList],
    },
    { name: "jobArea", label: "Job Location City", type: "text" },
    { name: "jobDeadline", label: "Job Deadline", type: "date" },
    { name: "jobVacancyNo", label: "Number Of Vacancy", type: "number" },
    { name: "jobWages", label: "Wages per month", type: "number" },
    {
      name: "jobWagesCurrencyType",
      label: "Wages Currency Type",
      type: "select",
      options: [{ label: "Select Currency", value: "" }, ...currencyList],
    },
    {
      name: "salary_negotiable",
      label: "Salary Negotiable",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "passport_type",
      label: "Passport Type",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "ECR", value: "ECR" },
        { label: "ECNR", value: "ECNR" },
        { label: "ECR/ECNR", value: "ECR/ECNR" },
      ],
    },
    {
      name: "service_charge",
      label: "Service Charge (in INR)",
      type: "number",
    },
    {
      name: "contract_period",
      label: "Contract Period (in months)",
      type: "number",
    },
    {
      name: "expCerificateReq",
      label: "Experience Certificate Required",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobWorkVideoReq",
      label: "Work Video Required",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobExpReq",
      label: "Job Experience Required",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobExpTypeReq",
      label: "Experience Required within India/International",
      type: "select",
      options: [
        { label: "Select", value: "" },
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
        { label: "Select", value: "" },
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
        { label: "Select", value: "" },
        { label: "Indian", value: "Indian" },
        { label: "International", value: "International" },
        { label: "Both Indian and International", value: "Both Indian and International" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobWorkingDay",
      label: "Job Working Day Per Month",
      type: "select",
      options: [
        { label: "Select", value: "" },
        ...Array.from({ length: 11 }, (_, i) => ({ label: `${20 + i}`, value: `${20 + i}` }))
      ],
    },
    { name: "jobWorkingHour", label: "Job Working Hour", type: "text" },
    {
      name: "jobOvertime",
      label: "Job Overtime",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Fixed OT", value: "Yes" },
        { label: "As Per Company Requirement", value: "As Per Company Requirement" },
        { label: "No OT", value: "No" },
      ],
    },
    {
      name: "jobFood",
      label: "Food",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Free Food", value: "Yes" },
        { label: "Food Allowance", value: "Food Allowance" },
        { label: "No Food", value: "No" },
      ],
    },
    {
      name: "jobAccommodation",
      label: "Accommodation",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobMedicalFacility",
      label: "Medical Facility",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobTransportation",
      label: "Free Work Transportation",
      type: "select",
      options: [
        { label: "Select", value: "" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    { name: "jobAgeLimit", label: "Age Limit", type: "number" },
    { name: "hrName", label: "HR Name", type: "text" },
    { name: "hrEmail", label: "HR Email", type: "email" },
    { name: "hrNumber", label: "HR Number", type: "text" },
    { name: "companyJobID", label: "Company Job ID", type: "text" },
    {
      name: "languageRequired",
      label: "Language Required",
      type: "multiple",
      options: [
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
      ],
    },
    { name: "jobDescription", label: "Job Description", type: "textarea" },
    { name: "jobPhoto", label: "Job Photo", type: "file" },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 py-8">
      <Card className="w-full max-w-3xl p-8 shadow-lg border border-gray-200 bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Create a New Job</h1>
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSubmit();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {formFields.map((field) => (
            <div key={field.name} className="flex flex-col gap-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              {field.type === "select" ? (
                <CustomSelect.Select
                  value={
                    typeof formData[field.name as keyof FormDataType] === 'string' || typeof formData[field.name as keyof FormDataType] === 'number'
                      ? String(formData[field.name as keyof FormDataType])
                      : ''
                  }
                  onValueChange={value => setFormData({ ...formData, [field.name]: value })}
                  disabled={field.name === 'jobSkill' && skillList.length === 0}
                >
                  <CustomSelect.SelectTrigger className="w-full" />
                  <CustomSelect.SelectContent className="min-w-[180px] z-50">
                    {field?.options?.length === 0 && (
                      <CustomSelect.SelectItem value="placeholder" disabled>
                        No options available
                      </CustomSelect.SelectItem>
                    )}
                    {field?.options?.map((v) => (
                      v.value !== '' ? (
                        <CustomSelect.SelectItem key={v.value} value={v.value}>
                          {v.label}
                        </CustomSelect.SelectItem>
                      ) : null
                    ))}
                  </CustomSelect.SelectContent>
                </CustomSelect.Select>
              ) : field.type === "textarea" ? (
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={
                    typeof formData[field.name as keyof FormDataType] === 'string' || typeof formData[field.name as keyof FormDataType] === 'number'
                      ? formData[field.name as keyof FormDataType] as string | number
                      : ''
                  }
                  onChange={handleOnChange}
                />
              ) : field.type === "file" ? (
                <Input
                  id={field.name}
                  type="file"
                  name={field.name}
                  onChange={handleOnChange}
                />
              ) : field.type === "multiple" ? (
                <div className="flex flex-col gap-1">
                  <CustomSelect.Select
                    value=""
                    onValueChange={value => {
                      const prev = Array.isArray(formData[field.name as keyof FormDataType]) ? formData[field.name as keyof FormDataType] as string[] : [];
                      if (!prev.includes(value)) {
                        setFormData({ ...formData, [field.name]: [...prev, value] });
                      }
                    }}
                    disabled={field.name === 'jobSkill' && skillList.length === 0}
                  >
                    <CustomSelect.SelectTrigger className="w-full" />
                    <CustomSelect.SelectContent className="min-w-[180px] z-50 bg-white border border-gray-200">
                      {field?.options?.length === 0 && (
                        <CustomSelect.SelectItem value="placeholder" disabled>
                          No options available
                        </CustomSelect.SelectItem>
                      )}
                      {field?.options?.map((v, idx) => {
                        if (v.value === '') return null;
                        // Ensure unique key by appending index if duplicate values exist
                        const duplicateCount = field.options.filter(opt => opt.value === v.value).length;
                        const key = duplicateCount > 1 ? `${v.value}-${idx}` : v.value;
                        return (
                          <CustomSelect.SelectItem key={key} value={v.value}>
                            {v.label}
                          </CustomSelect.SelectItem>
                        );
                      })}
                    </CustomSelect.SelectContent>
                  </CustomSelect.Select>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {/* Show selected values as badges with remove option */}
                    {Array.isArray(formData[field.name as keyof FormDataType]) &&
                      (formData[field.name as keyof FormDataType] as string[]).map((val) => (
                        <span key={val} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                          {val}
                          <button
                            type="button"
                            className="ml-1 text-blue-700 hover:text-red-500 focus:outline-none"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                [field.name]: (formData[field.name as keyof FormDataType] as string[]).filter(v => v !== val),
                              });
                            }}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                </div>
              ) : (
                <Input
                  id={field.name}
                  type={field.type}
                  name={field.name}
                  value={
                    typeof formData[field.name as keyof FormDataType] === 'string' || typeof formData[field.name as keyof FormDataType] === 'number'
                      ? formData[field.name as keyof FormDataType] as string | number
                      : ''
                  }
                  onChange={handleOnChange}
                />
              )}
              {errors[field.name as keyof FormDataType] && (
                <span className="text-red-600 text-xs mt-1">{errors[field.name as keyof FormDataType]}</span>
              )}
            </div>
          ))}
          <div className="md:col-span-2 flex justify-center mt-6">
            <Button type="submit" className="w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg" disabled={loading}>
              {loading ? "Creating..." : "Submit"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateJobs;
