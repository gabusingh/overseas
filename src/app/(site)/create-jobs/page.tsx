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
  // Local UI state only
  const [loading, setLoading] = useState(false);

  const getSkillList = async (id: string) => {
    try {
      const occuId = Number(id);
      if (!occuId) {
        setSkillList([]);
        return;
      }
      const response = await getSkillsByOccuId(occuId);
      type SkillApi = { id: string | number; skill: string };
      const skills = (response as { skills?: SkillApi[] })?.skills?.map((item) => ({
        label: item.skill,
        value: String(item.skill),
      }));
      setSkillList(skills || []);
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const getListOfCountry = async () => {
    try {
      const response = await getCountries();
      type CountryApi = { id: string | number; name: string; currencyName?: string };
      const countries: CountryApi[] = Array.isArray(response)
        ? (response as CountryApi[])
        : (((response as { countries?: CountryApi[] })?.countries) ?? []);
      const country = countries.map((item) => ({
        label: item.name,
        value: String(item.id),
      }));
      const currencyRaw = countries.map((item) => ({
        label: item.currencyName ?? "",
        value: item.currencyName ?? "",
      })).filter(c => c.value);
      // Deduplicate currencies by value to avoid duplicate keys (e.g., EUR across countries)
      const seenCurrency = new Set<string>();
      const currency = currencyRaw.filter((c) => {
        if (seenCurrency.has(c.value)) return false;
        seenCurrency.add(c.value);
        return true;
      });
      setCountryList(country);
      setCurrencyList(currency);
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const getOccupationList = async () => {
    try {
      const response = await getOccupations();
      type OccupationApi = { id: string | number; occupation: string };
      const occupationList: OccupationApi[] = Array.isArray(response)
        ? (response as OccupationApi[])
        : (((response as { occupation?: OccupationApi[] })?.occupation) ?? []);
      const occupations = occupationList?.map((item) => ({
        label: item.occupation,
        value: String(item.id),
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
        const value = formData[key];
        if (key === "jobSkill" || key === "languageRequired") {
          createFormData.append(key, JSON.stringify(value));
        } else if (key === "jobPhoto") {
          if (value) {
            createFormData.append(key, value as File);
          }
        } else if (value !== null && value !== "") {
          createFormData.append(key, String(value));
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

  const formFields: FieldConfig[] = [
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

  // UI helpers for grouped sections and hints
  const getPlaceholder = (name: string) => {
    const map: Record<string, string> = {
      jobTitle: "e.g. Senior Electrician",
      cmpNameACT: "e.g. Gulf Contracting Co.",
      jobInterviewPlace: "e.g. Kolkata Office or Zoom",
      jobArea: "e.g. Dubai, Abu Dhabi",
      jobVacancyNo: "e.g. 25",
      jobWages: "e.g. 3500",
      service_charge: "e.g. 15000",
      jobWorkingHour: "e.g. 8 hours/day",
      jobAgeLimit: "18 - 60",
      hrName: "Full name",
      hrEmail: "name@company.com",
      hrNumber: "+91 98xxxxxxx",
      companyJobID: "Internal reference (optional)",
    };
    return map[name] || undefined;
  };

  const getSelectPlaceholder = (name: string, fallback: string = "Select option") => {
    const map: Record<string, string> = {
      jobOccupation: "Select department",
      jobSkill: "Add a skill",
      jobMode: "Select interview mode",
      jobLocationCountry: "Select country",
      jobWagesCurrencyType: "Select currency",
      salary_negotiable: "Is salary negotiable?",
      passport_type: "Select passport type",
      expCerificateReq: "Experience certificate?",
      jobWorkVideoReq: "Work video required?",
      jobExpReq: "Experience required?",
      jobExpTypeReq: "Experience location",
      jobExpDuration: "Years of experience",
      DLReq: "Driving license",
      jobWorkingDay: "Working days per month",
      jobOvertime: "Overtime policy",
      jobFood: "Food provision",
      jobAccommodation: "Accommodation",
      jobMedicalFacility: "Medical facility",
      jobTransportation: "Work transportation",
      languageRequired: "Add language",
    };
    return map[name] || fallback;
  };

  const Section: React.FC<{ 
    title: string; 
    subtitle?: string; 
    children: React.ReactNode; 
    cols?: string;
    collapsible?: boolean;
    removable?: boolean;
    onRemove?: () => void;
  }> = ({ 
    title, 
    subtitle, 
    children, 
    cols = "grid-cols-1 md:grid-cols-2",
    collapsible = false,
    removable = false,
    onRemove
  }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    
    return (
      <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between p-6 md:p-8 pb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {collapsible && (
                <button
                  type="button"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
                >
                  <svg 
                    className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {removable && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-red-500 transition-colors ml-4 p-1"
              aria-label={`Remove ${title} section`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {!isCollapsed && (
          <div className="px-6 md:px-8 pb-6 md:pb-8">
            <div className={`grid ${cols} gap-6`}>{children}</div>
          </div>
        )}
      </section>
    );
  };

  type Option = { label: string; value: string };
  type FieldConfig = {
    name: string;
    label: string;
    type: "text" | "number" | "email" | "date" | "select" | "multiple" | "textarea" | "file";
    options?: Option[];
  };

  const renderField = (field: FieldConfig) => (
    <div key={field.name} className="flex flex-col gap-2">
      <Label htmlFor={field.name} className="text-sm text-gray-700">{field.label}</Label>
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
          <CustomSelect.SelectTrigger className="w-full">
            <CustomSelect.SelectValue placeholder={getSelectPlaceholder(field.name)} />
          </CustomSelect.SelectTrigger>
          <CustomSelect.SelectContent className="min-w-[180px] z-50">
            {field?.options?.length === 0 && (
              <CustomSelect.SelectItem value="placeholder" disabled>
                No options available
              </CustomSelect.SelectItem>
            )}
            {field?.options?.map((v: Option, idx: number) => (
              v.value !== '' ? (
                <CustomSelect.SelectItem key={`${v.value}-${idx}`} value={v.value}>
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
          placeholder="Describe responsibilities, requirements, benefits..."
          className="min-h-[120px]"
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
            <CustomSelect.SelectTrigger className="w-full">
              <div className="flex flex-wrap items-center gap-2 w-full min-h-[1.75rem]">
                {Array.isArray(formData[field.name as keyof FormDataType]) && (formData[field.name as keyof FormDataType] as string[]).length > 0 ? (
                  (formData[field.name as keyof FormDataType] as string[]).map((val) => (
                    <span
                      key={val}
                      className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs flex items-center gap-1 border border-gray-200"
                    >
                      {val}
                      <span
                        role="button"
                        tabIndex={0}
                        className="text-gray-500 hover:text-red-500 cursor-pointer select-none"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setFormData({
                            ...formData,
                            [field.name]: (formData[field.name as keyof FormDataType] as string[]).filter(v => v !== val),
                          });
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            setFormData({
                              ...formData,
                              [field.name]: (formData[field.name as keyof FormDataType] as string[]).filter(v => v !== val),
                            });
                          }
                        }}
                        aria-label={`Remove ${val}`}
                      >
                        ×
                      </span>
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">{getSelectPlaceholder(field.name, 'Add option')}</span>
                )}
              </div>
            </CustomSelect.SelectTrigger>
            <CustomSelect.SelectContent className="min-w-[180px] z-50 bg-white border border-gray-200">
              {field?.options?.length === 0 && (
                <CustomSelect.SelectItem value="placeholder" disabled>
                  No options available
                </CustomSelect.SelectItem>
              )}
              {field?.options?.map((v: Option, idx: number) => {
                if (v.value === '') return null;
                const key = `${v.value}-${idx}`;
                return (
                  <CustomSelect.SelectItem key={key} value={v.value}>
                    {v.label}
                  </CustomSelect.SelectItem>
                );
              })}
            </CustomSelect.SelectContent>
          </CustomSelect.Select>
        </div>
      ) : (
        <Input
          id={field.name}
          type={field.type}
          name={field.name}
          placeholder={getPlaceholder(field.name)}
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
  );

  const basicInfoFields = ["jobTitle", "jobOccupation", "jobSkill", "cmpNameACT", "jobPhoto", "jobDescription"];
  const interviewFields = ["jobMode", "jobInterviewDate", "jobInterviewPlace"];
  const locationFields = ["jobLocationCountry", "jobArea", "jobDeadline"];
  const openingsFields = ["jobVacancyNo", "jobWages", "jobWagesCurrencyType", "salary_negotiable", "passport_type", "service_charge", "contract_period"];
  const requirementsFields = ["expCerificateReq", "jobWorkVideoReq", "jobExpReq", "jobExpTypeReq", "jobExpDuration", "DLReq", "languageRequired"];
  const benefitsFields = ["jobWorkingDay", "jobWorkingHour", "jobOvertime", "jobFood", "jobAccommodation", "jobMedicalFacility", "jobTransportation", "jobAgeLimit"];
  const contactFields = ["hrName", "hrEmail", "hrNumber", "companyJobID"];

  const fieldsByName: Record<string, FieldConfig> = Object.fromEntries(
    formFields.map((f) => [f.name, f] as const)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-light-blue to-white">
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-semibold text-brand-blue">Create a New Job</h1>
          <Button
            onClick={handleSubmit}
            className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Creating..." : "Publish Job"}
          </Button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <Section title="Basic Details" subtitle="Role, department, skills and overview">
          {basicInfoFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <Section title="Interview" subtitle="Mode, date and venue" collapsible>
          {interviewFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <Section title="Location & Timeline" subtitle="Where the job is and the deadline" collapsible>
          {locationFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <Section title="Opening & Compensation" subtitle="Vacancies, wages, currency and contract">
          {openingsFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <Section title="Requirements" subtitle="Experience, certificates, licenses and languages" collapsible>
          {requirementsFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <Section title="Benefits & Working Conditions" subtitle="Days, hours, OT, food, accommodation, medical and transport" collapsible>
          {benefitsFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <Section title="Contact" subtitle="Who can candidates reach out to?" collapsible>
          {contactFields.map((n) => renderField(fieldsByName[n]))}
        </Section>

        <div className="flex justify-end">
          <Button type="button" onClick={handleSubmit} className="bg-brand-blue hover:bg-brand-blue/90 text-white font-semibold min-w-[160px]" disabled={loading}>
            {loading ? "Creating..." : "Submit"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateJobs;
