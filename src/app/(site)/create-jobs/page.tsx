"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createJobByHr, getEnhancedHrDetails } from "@/services/hra.service";
import { 
  getCountries, 
  getOccupations, 
  getSkillsByOccuId 
} from "@/services/info.service";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Types
type Country = {
  name: string;
  id: number;
};

type Occupation = {
  id: number;
  name: string;
};

type Skill = {
  id: number;
  name: string;
};

// Create a mapped type for form field values
type FormDataValues = {
  [K in keyof FormDataType]: FormDataType[K];
};

interface SelectOption {
  label: string;
  value: string;
}

interface FieldConfig {
  name: keyof FormDataType;
  label: string;
  type: 'text' | 'select' | 'multiple' | 'textarea' | 'number' | 'email' | 'date' | 'file';
  options?: SelectOption[];
  containerClassName?: string;
}

type FormFieldValue = string | string[] | File | null;

// Helper function to safely access form data
function getFormValue(formData: FormDataValues, name: keyof FormDataType): FormFieldValue {
  return formData[name] ?? "";
}

  // Helper function to safely update form data
function updateFormData(
  prevData: FormDataValues,
  name: keyof FormDataType,
  value: FormFieldValue
): FormDataValues {
  return { ...prevData, [name]: value };
}


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

const CreateJobs = () => {
  const router = useRouter();
  const [skillList, setSkillList] = useState<SelectOption[]>([]);
  const [countryList, setCountryList] = useState<SelectOption[]>([]);
  const [currencyList, setCurrencyList] = useState<SelectOption[]>([]);
  const [occupations, setOccupations] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hrDetailsLoading, setHrDetailsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataValues>({} as FormDataValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});

  // Function to populate form with demo data
  const populateDemoData = () => {
    console.log('🎭 Populating form with demo job data...');
    setFormData(demoJobData);
    setErrors({}); // Clear any existing errors
    
    // Load skills for the selected occupation (Construction)
    if (demoJobData.jobOccupation) {
      getSkillList(demoJobData.jobOccupation);
    }
    
    toast.success('🎭 Demo job data loaded! You can now test the form or modify the details.');
  };

  // Demo job data for testing
  const demoJobData: FormDataValues = {
    jobTitle: "Senior Electrician",
    jobOccupation: "1", // Construction
    jobSkill: ["101", "102"], // Masonry, Carpentry
    cmpNameACT: "Gulf Construction Co. Ltd",
    jobLocationCountry: "United Arab Emirates",
    jobDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
    jobVacancyNo: "25",
    jobWages: "3500",
    jobMode: "Offline",
    jobInterviewPlace: "Kolkata Office - 123 Main Street",
    jobInterviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    jobWagesCurrencyType: "AED",
    salary_negotiable: "Yes",
    passport_type: "ECR/ECNR",
    service_charge: "15000",
    contract_period: "24",
    expCerificateReq: "Yes",
    DLReq: "No",
    jobWorkVideoReq: "No",
    jobExpReq: "Yes",
    jobExpTypeReq: "international",
    jobExpDuration: "3",
    jobWorkingDay: "26",
    jobWorkingHour: "8 hours/day",
    jobOvertime: "As Per Company Requirement",
    jobFood: "Free Food",
    jobAccommodation: "Yes",
    jobMedicalFacility: "Yes",
    jobTransportation: "Yes",
    jobAgeLimit: "45",
    jobDescription: "We are looking for an experienced Senior Electrician to join our team in Dubai. The ideal candidate should have at least 3 years of international experience in electrical installations, maintenance, and troubleshooting. Must be able to work independently and as part of a team. Knowledge of local electrical codes and safety regulations is essential.",
    jobPhoto: null,
    hrName: "John Smith",
    hrEmail: "john.smith@gulfconstruction.com",
    hrNumber: "+971501234567",
    companyJobID: "GC-2024-001",
    languageRequired: ["English", "Hindi"],
    jobArea: "Dubai, UAE"
  };

  // Memoize formFields to ensure stable references
  const formFields = React.useMemo((): FieldConfig[] => [
    { 
      name: "jobTitle" as keyof FormDataType, 
      label: "Job Title", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobOccupation" as keyof FormDataType,
      label: "Job Department",
      type: "select",
      options: [{ label: "Select Department", value: "_none" }, ...occupations],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobSkill" as keyof FormDataType,
      label: "Job Skill (Multiple)",
      type: "multiple",
      options: [{ label: "Select Skill", value: "_none" }, ...skillList],
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "cmpNameACT" as keyof FormDataType, 
      label: "Actual Hiring Company", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobMode" as keyof FormDataType,
      label: "Interview Mode",
      type: "select",
      options: [
        { label: "Select Mode", value: "_none" },
        { label: "CV Selection", value: "CV Selection" },
        { label: "Client Interview", value: "Offline" },
        { label: "Online Interview", value: "Online" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobInterviewDate" as keyof FormDataType, 
      label: "Interview Date", 
      type: "date",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobInterviewPlace" as keyof FormDataType, 
      label: "Interview Place", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobLocationCountry" as keyof FormDataType,
      label: "Job Location Country",
      type: "select",
      options: [{ label: "Select Country", value: "_select_country" }, ...countryList],
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobArea" as keyof FormDataType, 
      label: "Job Location City", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobDeadline" as keyof FormDataType, 
      label: "Job Deadline", 
      type: "date",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobVacancyNo" as keyof FormDataType, 
      label: "Number Of Vacancy", 
      type: "number",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobWages" as keyof FormDataType, 
      label: "Wages per month", 
      type: "number",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobWagesCurrencyType" as keyof FormDataType,
      label: "Wages Currency Type",
      type: "select",
      options: [{ label: "Select Currency", value: "_select_currency" }, ...currencyList],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "salary_negotiable" as keyof FormDataType,
      label: "Salary Negotiable",
      type: "select",
      options: [
        { label: "Select", value: "_select" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "passport_type" as keyof FormDataType,
      label: "Passport Type",
      type: "select",
      options: [
        { label: "Select", value: "_select" },
        { label: "ECR", value: "ECR" },
        { label: "ECNR", value: "ECNR" },
        { label: "ECR/ECNR", value: "ECR/ECNR" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "service_charge" as keyof FormDataType,
      label: "Service Charge (in INR)",
      type: "number",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "contract_period" as keyof FormDataType,
      label: "Contract Period (in months)",
      type: "number",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "expCerificateReq" as keyof FormDataType,
      label: "Experience Certificate Required",
      type: "select",
      options: [
        { label: "Select", value: "_select" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobWorkVideoReq" as keyof FormDataType,
      label: "Work Video Required",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobExpReq" as keyof FormDataType,
      label: "Job Experience Required",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobExpTypeReq" as keyof FormDataType,
      label: "Experience Required within India/International",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Within India", value: "national" },
        { label: "International", value: "international" },
        { label: "India/International", value: "Any" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobExpDuration" as keyof FormDataType,
      label: "Year of Experience required",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
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
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "DLReq" as keyof FormDataType,
      label: "Driving License Required",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Indian", value: "Indian" },
        { label: "International", value: "International" },
        { label: "Both Indian and International", value: "Both Indian and International" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobWorkingDay" as keyof FormDataType,
      label: "Job Working Day Per Month",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        ...Array.from({ length: 11 }, (_, i) => ({ label: `${20 + i}`, value: `${20 + i}` }))
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobWorkingHour" as keyof FormDataType, 
      label: "Job Working Hour", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobOvertime" as keyof FormDataType,
      label: "Job Overtime",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Fixed OT", value: "Yes" },
        { label: "As Per Company Requirement", value: "As Per Company Requirement" },
        { label: "No OT", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobFood" as keyof FormDataType,
      label: "Food",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Free Food", value: "Yes" },
        { label: "Food Allowance", value: "Food Allowance" },
        { label: "No Food", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobAccommodation" as keyof FormDataType,
      label: "Accommodation",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobMedicalFacility" as keyof FormDataType,
      label: "Medical Facility",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "jobTransportation" as keyof FormDataType,
      label: "Free Work Transportation",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobAgeLimit" as keyof FormDataType, 
      label: "Age Limit", 
      type: "number",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "hrName" as keyof FormDataType, 
      label: "HR Name (Auto-filled)", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "hrEmail" as keyof FormDataType, 
      label: "HR Email (Auto-filled)", 
      type: "email",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "hrNumber" as keyof FormDataType, 
      label: "HR Number (Auto-filled)", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "companyJobID" as keyof FormDataType, 
      label: "Company Job ID", 
      type: "text",
      containerClassName: "min-h-[4.5rem]"
    },
    {
      name: "languageRequired" as keyof FormDataType,
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
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobDescription" as keyof FormDataType, 
      label: "Job Description", 
      type: "textarea",
      containerClassName: "min-h-[4.5rem]"
    },
    { 
      name: "jobPhoto" as keyof FormDataType, 
      label: "Job Photo", 
      type: "file",
      containerClassName: "min-h-[4.5rem]"
    },
  ], [occupations, skillList, countryList, currencyList]);

  // Memoize fieldsByName for stable reference
  const fieldsByName = React.useMemo(() => 
    Object.fromEntries(formFields.map((f) => [f.name, f] as const))
  , [formFields]);

  // Helper functions for placeholders and validation
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
      jobOvertime: "Select Overtime policy",
      jobFood: "Select Food provision",
      jobAccommodation: "Select Accommodation",
      jobMedicalFacility: "Select Medical facility",
      jobTransportation: "Select Transportation",
      languageRequired: "Add a language",
    };
    return map[name] || fallback;
  };

  // Fallback data if API fails
  const fallbackCountries = [
    { id: 1, name: "United Arab Emirates" },
    { id: 2, name: "Saudi Arabia" },
    { id: 3, name: "Qatar" },
    { id: 4, name: "Kuwait" },
    { id: 5, name: "Bahrain" },
    { id: 6, name: "Oman" },
    { id: 7, name: "Singapore" },
    { id: 8, name: "Malaysia" },
    { id: 9, name: "USA" },
    { id: 10, name: "Canada" },
  ];
  
  const fallbackOccupations = [
    { id: 1, name: "Construction" },
    { id: 2, name: "Hospitality" },
    { id: 3, name: "Healthcare" },
    { id: 4, name: "Oil & Gas" },
    { id: 5, name: "IT & Software" },
    { id: 6, name: "Manufacturing" },
    { id: 7, name: "Retail" },
    { id: 8, name: "Transportation" },
    { id: 9, name: "Education" },
    { id: 10, name: "Finance" },
  ];
  
  const fallbackSkills = {
    "1": [{ id: 101, name: "Masonry" }, { id: 102, name: "Carpentry" }, { id: 103, name: "Plumbing" }, { id: 104, name: "Electrical" }],
    "2": [{ id: 201, name: "Guest Relations" }, { id: 202, name: "F&B Service" }, { id: 203, name: "Housekeeping" }],
    "3": [{ id: 301, name: "Nursing" }, { id: 302, name: "Patient Care" }, { id: 303, name: "Medical Assistant" }],
    "4": [{ id: 401, name: "Rig Operations" }, { id: 402, name: "Pipeline Technician" }, { id: 403, name: "Drilling" }],
    "5": [{ id: 501, name: "Web Development" }, { id: 502, name: "Network Admin" }, { id: 503, name: "IT Support" }],
    "6": [{ id: 601, name: "Assembly Line" }, { id: 602, name: "Quality Control" }, { id: 603, name: "Machine Operation" }],
    "7": [{ id: 701, name: "Sales Associate" }, { id: 702, name: "Cashier" }, { id: 703, name: "Store Manager" }],
    "8": [{ id: 801, name: "Driver" }, { id: 802, name: "Logistics" }, { id: 803, name: "Warehouse Worker" }],
    "9": [{ id: 901, name: "Teacher" }, { id: 902, name: "School Administrator" }, { id: 903, name: "Tutor" }],
    "10": [{ id: 1001, name: "Accountant" }, { id: 1002, name: "Financial Analyst" }, { id: 1003, name: "Banking" }],
  };

  // Effect hooks for data fetching
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // First try to load data from the backend
        console.log('🔄 Fetching data from API...');
        
        // Attempt to fetch from cached API
        try {
          console.log('🚀 Using cached API calls for better performance...');
          const [countriesRes, occupationsRes] = await Promise.all([
            getCountries().catch(err => {
              console.error('Error fetching countries:', err);
              throw err; // Rethrow to trigger fallback
            }),
            getOccupations().catch(err => {
              console.error('Error fetching occupations:', err);
              throw err; // Rethrow to trigger fallback
            })
          ]);
          
          console.log('📊 Raw API responses:', { countriesRes, occupationsRes });
          
          // 1. Handle countries data (expecting { countries: [...] } or { data: [...] } structure)
          const countriesData = countriesRes?.countries || countriesRes?.data || [];
          if (Array.isArray(countriesData) && countriesData.length > 0) {
            const validCountries = countriesData.filter((country: any) => 
              country && typeof country === 'object' && country.name && country.id
            );
            
            if (validCountries.length > 0) {
              setCountryList(
                validCountries.map((country: any) => ({
                  label: country.name,
                  // Always use country ID as value to match database expectation
                  value: country.id?.toString(),
                }))
              );
              console.log('✅ Countries loaded from API:', validCountries.length);
            } else {
              throw new Error('No valid countries found in API response');
            }
          } else {
            throw new Error('Countries API response format invalid');
          }

          // 2. Handle occupations data (expecting { occupation: [...] } or { data: [...] } structure)
          const occupationsData = occupationsRes?.occupation || occupationsRes?.data || [];
          if (Array.isArray(occupationsData) && occupationsData.length > 0) {
            const validOccupations = occupationsData.filter((occupation: any) => 
              occupation && typeof occupation === 'object' && 
              (occupation.occupation || occupation.name || occupation.title) && occupation.id
            );
            
            if (validOccupations.length > 0) {
              setOccupations(
                validOccupations.map((occupation: any) => ({
                  label: occupation.occupation || occupation.name || occupation.title,
                  value: occupation.id.toString(),
                }))
              );
              console.log('✅ Occupations loaded from API:', validOccupations.length);
            } else {
              throw new Error('No valid occupations found in API response');
            }
          } else {
            throw new Error('Occupations API response format invalid');
          }
          
        } catch (apiError) {
          console.error('⚠️ API data loading failed:', apiError);
          console.log('⚙️ Using fallback data instead');
          
          // Use fallback data
          setCountryList(
            fallbackCountries.map(country => ({
              label: country.name,
              // Always use country ID as value to match database expectation
              value: country.id?.toString(),
            }))
          );
          console.log('✅ Fallback countries loaded:', fallbackCountries.length);
          
          setOccupations(
            fallbackOccupations.map(occupation => ({
              label: occupation.name,
              value: occupation.id.toString(),
            }))
          );
          console.log('✅ Fallback occupations loaded:', fallbackOccupations.length);
          
          // Notify user that we're using fallback data
          toast.info('Using offline data. Some features may be limited.');
        }

        // Set currency list (this is static data)
        setCurrencyList([
          { label: "USD", value: "USD" },
          { label: "INR", value: "INR" },
          { label: "AED", value: "AED" },
          { label: "SAR", value: "SAR" },
          { label: "KWD", value: "KWD" },
          { label: "QAR", value: "QAR" },
          { label: "BHD", value: "BHD" },
          { label: "OMR", value: "OMR" },
        ]);
        
        console.log('✅ Currency list set with 8 currencies');
        
      } catch (error) {
        console.error("❌ Error fetching initial data:", error);
        // Even if there's an error, set empty arrays to prevent crashes
        setCountryList([]);
        setOccupations([]);
        setCurrencyList([
          { label: "USD", value: "USD" },
          { label: "INR", value: "INR" },
          { label: "AED", value: "AED" },
          { label: "SAR", value: "SAR" },
          { label: "KWD", value: "KWD" },
          { label: "QAR", value: "QAR" },
          { label: "BHD", value: "BHD" },
          { label: "OMR", value: "OMR" },
        ]);
        toast.error("Some form data couldn't be loaded. You can still create jobs, but some dropdown options may be limited.");
      }
    };

    fetchInitialData();
  }, []);

  // Effect to fetch and prefill HR details
  useEffect(() => {
    const fetchHrDetails = async () => {
      try {
        setHrDetailsLoading(true);
        console.log('🔄 STARTING HR Details fetch for auto-fill...');
        
        // Get access token with detailed logging - use correct key 'access_token'
        let accessToken = localStorage.getItem('access_token');
        console.log('🔑 Access token check:', accessToken ? 'Found' : 'Not found', accessToken ? `(Length: ${accessToken.length})` : '');
        
        if (!accessToken) {
          // Try legacy keys as fallback
          const legacyToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
          if (legacyToken) {
            console.warn('Found token with legacy key, migrating to access_token');
            localStorage.setItem('access_token', legacyToken);
            accessToken = legacyToken;
          } else {
            console.warn('⚠️ No access token found, skipping HR details fetch');
            toast.info('Please log in to auto-fill HR details.');
            return;
          }
        }
        
        console.log('🚀 Calling getEnhancedHrDetails API...');
        
        // Call HR details API
        const hrDetailsResponse = await getEnhancedHrDetails(accessToken);
        console.log('📊 FULL HR Details Response:', JSON.stringify(hrDetailsResponse, null, 2));
        console.log('🔍 Response type:', typeof hrDetailsResponse);
        console.log('🔍 Response keys:', hrDetailsResponse ? Object.keys(hrDetailsResponse) : 'null');
        
        // Check if response has valid data
        if (hrDetailsResponse && typeof hrDetailsResponse === 'object') {
          console.log('🔍 Processing HR details response...');
          
          // Extract HR details with ALL possible field combinations
          const hrName = hrDetailsResponse.name || hrDetailsResponse.hrName || hrDetailsResponse.empName || hrDetailsResponse.full_name || '';
          const hrEmail = hrDetailsResponse.email || hrDetailsResponse.hrEmail || hrDetailsResponse.empEmail || hrDetailsResponse.email_address || '';
          const hrNumber = hrDetailsResponse.phone || hrDetailsResponse.hrContact || hrDetailsResponse.empMobile || hrDetailsResponse.phone_number || hrDetailsResponse.mobile || '';
          const companyName = hrDetailsResponse.company_name || hrDetailsResponse.cmpName || hrDetailsResponse.company || '';
          
          console.log('🎯 ALL FIELD EXTRACTION ATTEMPTS:');
          console.log('  - hrName attempts:', {
            name: hrDetailsResponse.name,
            hrName: hrDetailsResponse.hrName,
            empName: hrDetailsResponse.empName,
            full_name: hrDetailsResponse.full_name,
            final: hrName
          });
          console.log('  - hrEmail attempts:', {
            email: hrDetailsResponse.email,
            hrEmail: hrDetailsResponse.hrEmail,
            empEmail: hrDetailsResponse.empEmail,
            email_address: hrDetailsResponse.email_address,
            final: hrEmail
          });
          console.log('  - hrNumber attempts:', {
            phone: hrDetailsResponse.phone,
            hrContact: hrDetailsResponse.hrContact,
            empMobile: hrDetailsResponse.empMobile,
            phone_number: hrDetailsResponse.phone_number,
            mobile: hrDetailsResponse.mobile,
            final: hrNumber
          });
          console.log('  - companyName attempts:', {
            company_name: hrDetailsResponse.company_name,
            cmpName: hrDetailsResponse.cmpName,
            company: hrDetailsResponse.company,
            final: companyName
          });
          
          // Update form data with HR details
          if (hrName || hrEmail || hrNumber) {
            const updateData: any = {};
            if (hrName) {
              updateData.hrName = hrName;
              console.log('✅ Setting hrName:', hrName);
            }
            if (hrEmail) {
              updateData.hrEmail = hrEmail;
              console.log('✅ Setting hrEmail:', hrEmail);
            }
            if (hrNumber) {
              updateData.hrNumber = hrNumber;
              console.log('✅ Setting hrNumber:', hrNumber);
            }
            if (companyName) {
              updateData.cmpNameACT = companyName;
              console.log('✅ Setting company name:', companyName);
            }
            
            console.log('🚀 UPDATING FORM DATA with:', updateData);
            
            setFormData(prev => {
              const newData = {
                ...prev,
                ...updateData
              };
              console.log('🔄 Form data before update:', prev);
              console.log('🔄 Form data after update:', newData);
              return newData;
            });
            
            console.log('✅ HR details auto-filled successfully!');
            toast.success('HR details loaded automatically!');
          } else {
            console.warn('⚠️ No valid HR details found in response');
            console.warn('⚠️ Available fields:', Object.keys(hrDetailsResponse));
            console.warn('⚠️ Full response for debugging:', hrDetailsResponse);
            toast.info('HR details could not be auto-filled. Please enter manually.');
          }
        } else {
          console.warn('⚠️ Invalid HR details response format:', hrDetailsResponse);
          toast.info('HR details could not be auto-filled. Please enter manually.');
        }
        
      } catch (error) {
        console.error('❌ FULL ERROR in fetchHrDetails:', error);
        console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        toast.error('Failed to load HR details automatically. Please enter manually.');
      } finally {
        console.log('🏁 HR details fetch completed, setting loading to false');
        setHrDetailsLoading(false);
      }
    };

    // Add a small delay to ensure the component is fully mounted
    const timer = setTimeout(() => {
      fetchHrDetails();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle skill list updates when occupation changes
  const getSkillList = async (id: string) => {
    try {
      const occuId = Number(id);
      if (!occuId || id.startsWith('_')) {
        setSkillList([]);
        return;
      }

      console.log('🔍 Fetching skills for occupation ID:', occuId);
      
      try {
        const skillsResponse = await getSkillsByOccuId(occuId);
        console.log('🔍 Skills Response:', skillsResponse);
        
        // Handle skills data (expecting { skills: [...] } structure)
        if (skillsResponse?.skills && Array.isArray(skillsResponse.skills)) {
          const validSkills = skillsResponse.skills.filter((skill: any) => 
            skill && typeof skill === 'object' && (skill.skill || skill.name) && skill.id
          );
          
          if (validSkills.length > 0) {
            // Remove duplicates based on skill name and preserve skill ID
            const uniqueSkills = validSkills.reduce((acc: any[], skill: any) => {
              const skillName = skill.skill || skill.name;
              const skillId = skill.id;
              const existingIndex = acc.findIndex(s => s.label === skillName);
              
              if (existingIndex === -1) {
                // New skill, add it with ID as value for backend
                acc.push({
                  label: skillName,
                  value: skillId.toString(), // Send skill ID to backend
                  skillId: skillId, // Keep ID for reference
                  skillName: skillName // Keep name for display
                });
              }
              return acc;
            }, []);
            
            setSkillList(uniqueSkills);
            console.log('✅ Skills loaded from API (unique):', uniqueSkills.length);
            return;
          } else {
            throw new Error('No valid skills found in API response');
          }
        } else {
          throw new Error('Skills API response format invalid');
        }
        
      } catch (apiError) {
        console.warn('⚠️ API skills loading failed:', apiError);
        console.log('⚙️ Using fallback skills for occupation:', occuId);
        
        // Use fallback skills data with IDs
        const fallbackSkillsForOccupation = fallbackSkills[id as keyof typeof fallbackSkills] || [];
        
        if (fallbackSkillsForOccupation.length > 0) {
          setSkillList(
            fallbackSkillsForOccupation.map((skill: any) => ({
              label: skill.name,
              value: skill.id.toString(), // Use skill ID as value
              skillId: skill.id,
              skillName: skill.name
            }))
          );
          console.log('✅ Fallback skills loaded:', fallbackSkillsForOccupation.length);
        } else {
          console.warn('⚠️ No fallback skills available for occupation:', occuId);
          setSkillList([]);
        }
      }
    } catch (error) {
      console.error("❌ Error in getSkillList:", error);
      setSkillList([]);
    }
  };

  // Form validation function
  const validateForm = (): boolean => {
    console.log('🔍 Starting form validation...');
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};
    const missingFields: string[] = [];
    
    // Required field validations
    const requiredFields: (keyof FormDataType)[] = [
      'jobTitle', 'cmpNameACT', 'jobOccupation', 'jobLocationCountry', 
      'jobDeadline', 'jobVacancyNo', 'jobWages', 'jobWagesCurrencyType',
      'jobWorkingDay', 'jobWorkingHour', 'jobOvertime', 'jobFood', 
      'jobAccommodation', 'jobMedicalFacility', 'jobTransportation',
      'hrName', 'hrEmail', 'hrNumber'
    ];
    
    console.log('📋 Required fields to validate:', requiredFields);
    
    requiredFields.forEach(field => {
      const value = formData[field];
      console.log(`🔍 Validating field ${field}:`, value);
      
      if (!value || 
          (typeof value === 'string' && (value.trim() === '' || value.startsWith('_'))) ||
          (Array.isArray(value) && value.length === 0)) {
        const fieldLabel = fieldsByName[field]?.label || field;
        newErrors[field] = `${fieldLabel} is required`;
        missingFields.push(fieldLabel);
        console.log(`❌ Field ${field} is missing or invalid`);
      } else {
        console.log(`✅ Field ${field} is valid`);
      }
    });
    
    // Email validation
    if (formData.hrEmail && !formData.hrEmail.toString().startsWith('_')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.hrEmail.toString())) {
        newErrors.hrEmail = 'Please enter a valid email address';
      }
    }
    
    // Number validations
    const numberFields: (keyof FormDataType)[] = ['jobVacancyNo', 'jobWages', 'service_charge', 'contract_period'];
    numberFields.forEach(field => {
      const value = formData[field];
      if (value && !value.toString().startsWith('_')) {
        const num = Number(value);
        if (isNaN(num) || num <= 0) {
          newErrors[field] = `${fieldsByName[field]?.label || field} must be a valid positive number`;
        }
      }
    });
    
    // Date validations
    if (formData.jobDeadline && !formData.jobDeadline.toString().startsWith('_')) {
      const deadlineDate = new Date(formData.jobDeadline.toString());
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.jobDeadline = 'Job deadline cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    
    console.log('📊 Validation results:', {
      totalErrors: Object.keys(newErrors).length,
      missingFields: missingFields.length,
      errors: newErrors
    });
    
    // Show specific snackbar message for missing required fields
    if (missingFields.length > 0) {
      if (missingFields.length === 1) {
        toast.error(`${missingFields[0]} is required`);
      } else if (missingFields.length <= 3) {
        toast.error(`Required fields: ${missingFields.join(', ')}`);
      } else {
        toast.error(`Please fill in all required fields (${missingFields.length} missing)`);
      }
    }
    
    // Show snackbar for other validation errors
    const otherErrors = Object.keys(newErrors).filter(key => 
      !requiredFields.includes(key as keyof FormDataType)
    );
    
    if (otherErrors.length > 0) {
      const firstError = newErrors[otherErrors[0] as keyof FormDataType];
      toast.error(firstError || 'Please check your form inputs');
    }
    
    const isValid = Object.keys(newErrors).length === 0;
    console.log(`🏁 Form validation ${isValid ? 'PASSED' : 'FAILED'}`);
    
    return isValid;
  };
  
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📋 Form data:', formData);
    
    // Clear previous errors
    setErrors({});
    
    // Validate form
    console.log('🔍 Validating form...');
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      // Validation function already shows specific error messages
      return;
    }
    
    console.log('✅ Form validation passed');
    setLoading(true);

    try {
      // Get access token with fallback - use correct key 'access_token'
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        // Try legacy keys as fallback
        const legacyToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (legacyToken) {
          console.warn('Found token with legacy key, migrating to access_token');
          localStorage.setItem('access_token', legacyToken);
          accessToken = legacyToken; // Use the migrated token
        } else {
          throw new Error('Authentication token not found. Please log in again.');
        }
      }
      
      // Convert formData object to FormData instance
      const formDataInstance = new FormData();
      let hasValidData = false;
      
      Object.entries(formData).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Filter out placeholder values from arrays
          const filteredValue = value.filter(v => v && !v.startsWith('_'));
          if (filteredValue.length > 0) {
            formDataInstance.append(key, JSON.stringify(filteredValue));
            hasValidData = true;
          }
        } else if (value instanceof File) {
          if (value.size > 0) {
            // Validate file size (10MB limit)
            if (value.size > 10 * 1024 * 1024) {
              throw new Error('File size must be less than 10MB');
            }
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(value.type)) {
              throw new Error('Only JPEG, PNG, and WebP images are allowed');
            }
            formDataInstance.append(key, value);
            hasValidData = true;
          }
        } else if (value != null && 
                   value.toString().trim() !== '' && 
                   !value.toString().startsWith('_')) {
          // Only append non-placeholder values
          const trimmedValue = String(value).trim();
          formDataInstance.append(key, trimmedValue);
          hasValidData = true;
        }
      });
      
      if (!hasValidData) {
        throw new Error('No valid data to submit. Please fill in the required fields.');
      }
      
      // Add timestamp for tracking
      formDataInstance.append('submittedAt', new Date().toISOString());
      
      // Submit the form
      console.log('📤 Submitting job data to API...');
      console.log('🔑 Access token:', accessToken ? 'Found' : 'Not found');
      console.log('📦 Form data instance entries:', Array.from(formDataInstance.entries()));
      
      const response = await createJobByHr(formDataInstance, accessToken);
      
      console.log('📥 API Response received:', response);
      
      // Handle different response scenarios
      if (response && typeof response === 'object') {
        // Check for success message from backend
        if ('message' in response && response.message === 'Job created successfully') {
          toast.success('🎉 Job posted successfully! Your job is now live.');
        } else if ('error' in response) {
          throw new Error(response.error as string || 'Server error occurred');
        } else if ('success' in response && !response.success) {
          throw new Error('Job creation failed on server');
        } else {
          // Default success if no specific success field
          toast.success('🎉 Job posted successfully! Your job is now live.');
        }
      } else {
        // Success for non-object responses
        toast.success('🎉 Job posted successfully! Your job is now live.');
      }
      
      // Clear form data on success
      setFormData({} as FormDataValues);
      setErrors({});
      
      // Redirect to HR dashboard with a small delay to show the success message
      setTimeout(() => {
        router.push("/hra-dashboard");
      }, 2000);
      
    } catch (error: any) {
      console.error("Error creating job:", error);
      
      // Handle different error types with enhanced messages
      let errorMessage = '❌ Failed to create job. Please try again.';
      let errorTitle = 'Job Creation Failed';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.statusText) {
        errorMessage = `Server error: ${error.response.statusText}`;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      
      // Handle specific error codes with tailored messages
      if (error?.response?.status === 401) {
        errorTitle = 'Authentication Required';
        errorMessage = '🔐 Your session has expired. Please log in again.';
        // Optionally redirect to login after showing error
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else if (error?.response?.status === 403) {
        errorTitle = 'Access Denied';
        errorMessage = '🚫 You do not have permission to create jobs.';
      } else if (error?.response?.status === 422) {
        errorTitle = 'Invalid Data';
        errorMessage = '⚠️ Some required information is missing or invalid. Please check your inputs.';
      } else if (error?.response?.status === 400) {
        errorTitle = 'Bad Request';
        errorMessage = '⚠️ Invalid job data. Please review your form and try again.';
      } else if (error?.response?.status >= 500) {
        errorTitle = 'Server Error';
        errorMessage = '🔧 Server is temporarily unavailable. Please try again in a few minutes.';
      } else if (error?.code === 'NETWORK_ERROR' || error?.message?.includes('Network')) {
        errorTitle = 'Connection Error';
        errorMessage = '🌐 Check your internet connection and try again.';
      }
      
      // Show error with enhanced formatting
      toast.error(errorMessage, {
        duration: 5000, // Show for 5 seconds for error messages
      });
      
    } finally {
      setLoading(false);
    }
  };

  // Define form sections for better organization
  const formSections = React.useMemo(() => [
    {
      id: 'basic-info',
      title: 'Basic Job Information',
      description: 'Essential details about the job position',
      icon: '💼',
      fields: ['jobTitle', 'jobOccupation', 'jobSkill', 'cmpNameACT', 'jobDescription']
    },
    {
      id: 'interview-details',
      title: 'Interview & Location',
      description: 'Interview process and job location details',
      icon: '📍',
      fields: ['jobMode', 'jobInterviewDate', 'jobInterviewPlace', 'jobLocationCountry', 'jobArea']
    },
    {
      id: 'compensation',
      title: 'Compensation & Benefits',
      description: 'Salary, benefits and working conditions',
      icon: '💰',
      fields: ['jobWages', 'jobWagesCurrencyType', 'salary_negotiable', 'service_charge', 'contract_period',
               'jobWorkingDay', 'jobWorkingHour', 'jobOvertime', 'jobFood', 'jobAccommodation', 
               'jobMedicalFacility', 'jobTransportation']
    },
    {
      id: 'requirements',
      title: 'Job Requirements',
      description: 'Experience, skills and qualification requirements',
      icon: '📋',
      fields: ['jobDeadline', 'jobVacancyNo', 'jobExpReq', 'jobExpTypeReq', 'jobExpDuration',
               'expCerificateReq', 'DLReq', 'jobWorkVideoReq', 'passport_type', 'languageRequired', 'jobAgeLimit']
    },
    {
      id: 'contact-info',
      title: 'Contact Information',
      description: 'HR contact details and additional information',
      icon: '📞',
      fields: ['hrName', 'hrEmail', 'hrNumber', 'companyJobID', 'jobPhoto']
    }
  ], []);

  const renderField = (field: FieldConfig) => {
    const fieldName = field.name as keyof FormDataType;
    const error = errors[fieldName];
    const isRequired = ['jobTitle', 'cmpNameACT', 'jobOccupation', 'jobLocationCountry', 
                       'jobDeadline', 'jobVacancyNo', 'jobWages', 'jobWagesCurrencyType',
                       'jobWorkingDay', 'jobWorkingHour', 'jobOvertime', 'jobFood', 
                       'jobAccommodation', 'jobMedicalFacility', 'jobTransportation',
                       'hrName', 'hrEmail', 'hrNumber'].includes(fieldName);
    
    // Check if this is an HR field that should show loading state
    const isHrField = ['hrName', 'hrEmail', 'hrNumber'].includes(fieldName);
    const showLoading = isHrField && hrDetailsLoading;

    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {field.label}
          {isRequired && <span className="text-red-500 text-xs">*</span>}
        </Label>
        
        {field.type === "select" && (
          <Select
            value={String(getFormValue(formData, fieldName))}
            onValueChange={(value: string) => {
              setFormData((prev) => ({ ...prev, [field.name]: value }));
              if (field.name === "jobOccupation") {
                getSkillList(value);
              }
            }}
          >
            <SelectTrigger className={`h-11 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}>
              <SelectValue placeholder={getSelectPlaceholder(field.name)} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {field.options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}
        
        {field.type === "multiple" && (
          <div className="space-y-3">
            {/* Selected Skills Display */}
            {Array.isArray(formData[field.name as keyof FormDataType]) && (formData[field.name as keyof FormDataType] as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(formData[field.name as keyof FormDataType] as string[])
                  .filter(skillId => skillId && skillId !== "_none")
                  .map((skillId, index) => {
                    // Find the skill name to display from skillList
                    const skillOption = skillList.find(option => option.value === skillId);
                    const displayName = skillOption?.label || `Skill ${skillId}`;
                    
                    return (
                      <span
                        key={`${skillId}-${index}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                      >
                        {displayName}
                        <button
                          type="button"
                          onClick={() => {
                            const currentSkills = (formData[field.name as keyof FormDataType] as string[]) || [];
                            const updatedSkills = currentSkills.filter(s => s !== skillId);
                            setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, updatedSkills));
                          }}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                          aria-label={`Remove ${displayName}`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    );
                  })
                }
              </div>
            )}
            
            {/* Add Skills Dropdown */}
            <Select
              value=""
              onValueChange={(value: string) => {
                if (value && value !== "_none") {
                  const currentSkills = (formData[field.name as keyof FormDataType] as string[]) || [];
                  // Use the skill ID as the value (no need to extract anything)
                  const skillId = value;
                  if (!currentSkills.includes(skillId)) {
                    const updatedSkills = [...currentSkills, skillId];
                    setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, updatedSkills));
                  }
                }
              }}
            >
              <SelectTrigger className={`h-11 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}>
                <SelectValue placeholder={getSelectPlaceholder(field.name)} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {field.options?.map((option, index) => {
                    const currentSkills = (formData[field.name as keyof FormDataType] as string[]) || [];
                    // Check if this skill ID is already selected
                    const isSelected = currentSkills.includes(option.value);
                    const isPlaceholder = option.value === "_none";
                    
                    return (
                      <SelectItem
                        key={`${option.value}-${index}`}
                        value={option.value}
                        disabled={isSelected && !isPlaceholder}
                        className={isSelected ? "opacity-50" : ""}
                      >
                        <div className="flex items-center gap-2">
                          {option.label}
                          {isSelected && !isPlaceholder && (
                            <span className="text-xs text-green-600">✓ Added</span>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        )}
        
        {field.type === "textarea" && (
          <Textarea
            id={field.name}
            value={String(getFormValue(formData, field.name as keyof FormDataType))}
            onChange={(e) =>
              setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, e.target.value))
            }
            placeholder={getPlaceholder(field.name)}
            className={`min-h-[120px] resize-none ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
          />
        )}
        
        {(field.type === "text" || field.type === "number" || field.type === "email" || field.type === "date") && (
          <div className="relative">
            <Input
              id={field.name}
              type={field.type}
              value={String(getFormValue(formData, field.name as keyof FormDataType))}
              onChange={(e) =>
                setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, e.target.value))
              }
              placeholder={showLoading ? "Loading..." : getPlaceholder(field.name)}
              disabled={showLoading}
              className={`h-11 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} ${showLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
            />
            {showLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
            )}
          </div>
        )}
        
        {field.type === "file" && (
          <div className="space-y-2">
            <Input
              id={field.name}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) =>
                setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, e.target.files?.[0] || null))
              }
              className={`h-11 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            />
            <p className="text-xs text-gray-500">Max 10MB. Supported: JPEG, PNG, WebP</p>
          </div>
        )}
        
        {error && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <span className="text-red-500">⚠</span>
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Job</h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-4">
            Fill out the information below to post a new job opportunity. 
            All fields marked with <span className="text-red-500">*</span> are required.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-blue-700">
              <span className="text-lg">💡</span>
              <span className="text-sm font-medium">Tip: Use the "Load Demo Job" button below to quickly populate the form with sample data for testing!</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {formSections.map((section, sectionIndex) => {
            const sectionFields = formFields.filter(field => 
              section.fields.includes(field.name as string)
            );

            return (
              <div 
                key={section.id} 
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Section Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{section.icon}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                      <p className="text-blue-100 text-sm">{section.description}</p>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sectionFields.map(field => (
                      <div 
                        key={field.name} 
                        className={`
                          ${field.type === 'textarea' ? 'md:col-span-2 lg:col-span-3' : ''}
                          ${field.name === 'jobTitle' || field.name === 'cmpNameACT' ? 'md:col-span-2' : ''}
                        `}
                      >
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="px-6 pb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Section {sectionIndex + 1} of {formSections.length}</span>
                    <div className="flex space-x-1">
                      {formSections.map((_, index) => (
                        <div
                          key={index}
                          className={`h-2 w-8 rounded-full ${
                            index <= sectionIndex ? 'bg-blue-500' : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Demo Data Section */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-purple-700">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">🎭</span>
                  <span className="font-medium">Need help getting started?</span>
                </div>
                <p>Load demo job data for a <strong>Senior Electrician</strong> position in Dubai with complete details including salary, benefits, and requirements.</p>
              </div>
              
              <Button 
                type="button" 
                variant="outline"
                onClick={populateDemoData}
                className="px-6 py-2 h-11 border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400"
                disabled={loading}
              >
                🎭 Load Demo Job
              </Button>
            </div>
          </div>

          {/* Submit Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Ready to publish your job? Review all information before submitting.</p>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setFormData({} as FormDataValues)}
                  className="px-6 py-2 h-11"
                  disabled={loading}
                >
                  Clear Form
                </Button>
                
                <Button 
                  type="submit" 
                  disabled={loading}
                  onClick={() => console.log('🔘 Create Job Posting button clicked')}
                  className="px-8 py-2 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                      Creating Job...
                    </>
                  ) : (
                    'Create Job Posting'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobs;
