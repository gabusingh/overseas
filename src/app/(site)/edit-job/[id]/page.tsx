"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { getJobById } from "@/services/job.service";
import { editJob, getEnhancedHrDetails } from "@/services/hra.service";
import { getSkillsByOccuId } from "@/services/info.service";
import { useOccupations, useCountries } from "@/hooks/useInfoQueries";
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

// Types - matching create job form
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
  const value = formData[name];
  const arrayFields: (keyof FormDataType)[] = ['jobSkill', 'languageRequired'];
  if (arrayFields.includes(name)) {
    return Array.isArray(value) ? value : [];
  }
  return value ?? "";
}

// Helper function to safely update form data
function updateFormData(
  prevData: FormDataValues,
  name: keyof FormDataType,
  value: FormFieldValue
): FormDataValues {
  return { ...prevData, [name]: value };
}

// Normalize values before submission
function normalizeSubmissionValues(
  data: FormDataValues,
  fields: FieldConfig[]
): Record<keyof FormDataType, FormFieldValue> {
  const normalized: Partial<Record<keyof FormDataType, FormFieldValue>> = {};

  fields.forEach(({ name }) => {
    const value = data[name];

    if (Array.isArray(value)) {
      const arrayFields: (keyof FormDataType)[] = ['jobSkill', 'languageRequired'];
      if (!arrayFields.includes(name)) {
        normalized[name] = '';
        return;
      }
      
      const cleaned = value
        .filter((v) => {
          if (v == null || v === '') return false;
          const stringValue = typeof v === 'string' ? v : String(v);
          return stringValue && !stringValue.startsWith('_');
        })
        .map((v) => {
          if (Array.isArray(v)) {
            return JSON.stringify(v);
          }
          return typeof v === 'string' ? v : String(v);
        });
      normalized[name] = cleaned.length > 0 ? cleaned : [];
      return;
    }

    if (value instanceof File) {
      normalized[name] = value.size > 0 ? value : '';
      return;
    }

    if (typeof value === 'string') {
      const arrayFields: (keyof FormDataType)[] = ['jobSkill', 'languageRequired'];
      if (arrayFields.includes(name)) {
        const trimmed = value.trim();
        if (trimmed === '' || trimmed.startsWith('_')) {
          normalized[name] = [];
        } else {
          normalized[name] = trimmed.includes(',') 
            ? trimmed.split(',').map(s => s.trim()).filter(s => s !== '')
            : [trimmed];
        }
        return;
      }
      const trimmed = value.trim();
      normalized[name] =
        trimmed === '' || trimmed.startsWith('_') ? '' : trimmed;
      return;
    }

    if (value != null) {
      normalized[name] = value;
      return;
    }

    const arrayFields: (keyof FormDataType)[] = ['jobSkill', 'languageRequired'];
    if (arrayFields.includes(name)) {
      normalized[name] = [];
      return;
    }

    normalized[name] = '';
  });

  return normalized as Record<keyof FormDataType, FormFieldValue>;
}

type FormDataType = {
  jobManualID: string;
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

const REQUIRED_FIELDS: (keyof FormDataType)[] = [
  'jobManualID',
  'jobTitle',
  'jobOccupation',
  'jobSkill',
  'jobLocationCountry',
  'jobDeadline',
  'jobVacancyNo',
  'jobWagesCurrencyType',
  'salary_negotiable',
  'passport_type',
  'contract_period',
  'jobExpReq',
  'jobWorkingDay',
  'jobWorkingHour',
  'jobOvertime',
  'jobFood',
  'jobAccommodation',
  'jobMedicalFacility',
  'jobTransportation',
  'jobAgeLimit',
  'languageRequired',
  'DLReq',
  'jobPhoto',
];

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const { data: countriesApiData = [] } = useCountries();
  const { data: occupationsApiData = [] } = useOccupations();
  
  const [skillList, setSkillList] = useState<SelectOption[]>([]);
  const [countryList, setCountryList] = useState<SelectOption[]>([]);
  const [currencyList, setCurrencyList] = useState<SelectOption[]>([]);
  const [occupations, setOccupations] = useState<SelectOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hrDetailsLoading, setHrDetailsLoading] = useState(false);
  const [formData, setFormData] = useState<FormDataValues>({} as FormDataValues);
  const [errors, setErrors] = useState<Partial<Record<keyof FormDataType, string>>>({});
  const [existingJobPhoto, setExistingJobPhoto] = useState<string | null>(null);

  // Sync cached data to state when available
  useEffect(() => {
    if (countriesApiData.length > 0) {
      const validCountries = countriesApiData.filter((country: any) => 
        country && typeof country === 'object' && country.name && country.id
      );
      if (validCountries.length > 0) {
        setCountryList(
          validCountries.map((country: any) => ({
            label: country.name,
            value: country.id?.toString(),
          }))
        );
      }
    }
  }, [countriesApiData]);
  
  useEffect(() => {
    if (occupationsApiData.length > 0) {
      const validOccupations = occupationsApiData.filter((occupation: any) => 
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
      }
    }
  }, [occupationsApiData]);

  // Initialize currency list
  useEffect(() => {
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
  }, []);

  // Fetch job data
  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const loggedUser = localStorage.getItem("loggedUser");
      
      if (!token) {
        toast.error('Please log in to edit jobs');
        router.push("/login");
        return;
      }
      
      if (loggedUser) {
        const userData = JSON.parse(loggedUser);
        const userType = userData?.user?.type || userData?.type;
        if (userType !== 'company') {
          toast.error('Access denied. You must be logged in as an HR user to edit jobs.');
          router.push('/login');
          return;
        }
      }

      const response: any = await getJobById(jobId);
      
      let jobApiData;
      if (response?.data?.jobs) {
        jobApiData = response.data.jobs;
      } else if (response?.data && typeof response.data === 'object') {
        jobApiData = response.data;
      } else if (response?.jobs) {
        jobApiData = response.jobs;
      } else if (response && typeof response === 'object') {
        jobApiData = response;
      } else {
        throw new Error('Invalid API response structure - no job data found');
      }
      
      if (!jobApiData || typeof jobApiData !== 'object') {
        throw new Error('Job data is null, undefined, or not an object');
      }
      
      if (!jobApiData.id && !jobApiData.jobID) {
        throw new Error(`Job not found - no valid ID in response`);
      }

      // Store existing job photo URL if available
      if (jobApiData.jobPhoto) {
        setExistingJobPhoto(jobApiData.jobPhoto);
      }

      // Transform API response to match FormDataType
      const transformedData: FormDataValues = {
        jobManualID: jobApiData.jobManualID || jobApiData.jobID || jobApiData.id?.toString() || '',
        jobTitle: jobApiData.jobTitle || jobApiData.title || '',
        jobOccupation: jobApiData.jobOccupation_id || jobApiData.jobOccupation?.id?.toString() || jobApiData.jobOccupation || '',
        jobSkill: jobApiData.skills ? (Array.isArray(jobApiData.skills) ? jobApiData.skills.map((skill: any) => skill.id?.toString() || skill.skill_id?.toString() || String(skill)) : []) : [],
        cmpNameACT: jobApiData.cmpNameACT || jobApiData.companyName || jobApiData.cmpName || '',
        jobLocationCountry: jobApiData.jobLocationCountry?.id?.toString() || jobApiData.jobLocationCountry?.toString() || '',
        jobDeadline: jobApiData.jobDeadline ? new Date(jobApiData.jobDeadline).toISOString().split('T')[0] : '',
        jobVacancyNo: (jobApiData.jobVacancyNo || jobApiData.vacancyNo || '1').toString(),
        jobWages: (jobApiData.jobWages || jobApiData.wages || '0').toString(),
        jobMode: jobApiData.jobMode || 'Offline',
        jobInterviewPlace: jobApiData.jobInterviewPlace || '',
        jobInterviewDate: jobApiData.jobInterviewDate ? new Date(jobApiData.jobInterviewDate).toISOString().split('T')[0] : '',
        jobWagesCurrencyType: jobApiData.jobWagesCurrencyType || jobApiData.currencyType || 'USD',
        salary_negotiable: jobApiData.salary_negotiable || 'No',
        passport_type: jobApiData.passportType || jobApiData.passport_type || '',
        service_charge: (jobApiData.service_charge || '0').toString(),
        contract_period: (jobApiData.contract_period || jobApiData.contractPeriod || '0').toString(),
        expCerificateReq: jobApiData.expCerificateReq || jobApiData.expCertificateReq || 'No',
        DLReq: jobApiData.DLReq || jobApiData.drivingLicenseReq || 'No',
        jobWorkVideoReq: jobApiData.jobWorkVideoReq || 'No',
        jobExpReq: jobApiData.jobExpReq || 'No',
        jobExpTypeReq: jobApiData.jobExpTypeReq || jobApiData.experienceType || '',
        jobExpDuration: (jobApiData.jobExpDuration || jobApiData.experienceDuration || '').toString(),
        jobWorkingDay: (jobApiData.jobWorkingDay || '26').toString(),
        jobWorkingHour: (jobApiData.jobWorkingHour || '8').toString(),
        jobOvertime: jobApiData.jobOvertime || 'As Per Company Requirement',
        jobFood: jobApiData.jobFood || 'No',
        jobAccommodation: jobApiData.jobAccommodation || 'No',
        jobMedicalFacility: jobApiData.jobMedicalFacility || 'No',
        jobTransportation: jobApiData.jobTransportation || 'No',
        jobAgeLimit: (jobApiData.jobAgeLimit || '60').toString(),
        jobDescription: jobApiData.jobDescription || '',
        jobPhoto: null, // Will be set if user uploads new photo
        hrName: jobApiData.hrName || '',
        hrEmail: jobApiData.hrEmail || '',
        hrNumber: jobApiData.hrNumber || jobApiData.hrContact || '',
        companyJobID: jobApiData.companyJobID || '',
        languageRequired: jobApiData.languageRequired ? (Array.isArray(jobApiData.languageRequired) ? jobApiData.languageRequired : [jobApiData.languageRequired]) : [],
        jobArea: jobApiData.jobArea || jobApiData.location || '',
      };

      setFormData(transformedData);

      // Load skills for the selected occupation
      if (transformedData.jobOccupation) {
        getSkillList(transformedData.jobOccupation);
      }
      
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      
      if (error.message.includes('timeout')) {
        toast.error('Request timed out. Please check your internet connection and try again.');
      } else if (error.response?.status === 404) {
        toast.error('Job not found. It may have been deleted or you may not have permission to access it.');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Unauthorized access. Please log in again.');
        router.push('/login');
        return;
      } else {
        toast.error(`Failed to load job data: ${errorMessage}`);
      }
      
      setTimeout(() => {
        router.push('/hra-jobs');
      }, 3000);
      
    } finally {
      setLoading(false);
    }
  };

  // Handle skill list updates when occupation changes
  const getSkillList = async (id: string) => {
    try {
      const occuId = Number(id);
      if (!occuId || id.startsWith('_')) {
        setSkillList([]);
        return;
      }
      
      const skillsResponse = await getSkillsByOccuId(occuId);
      
      if (skillsResponse?.skills && Array.isArray(skillsResponse.skills)) {
        const validSkills = skillsResponse.skills.filter((skill: any) => 
          skill && typeof skill === 'object' && (skill.skill || skill.name) && skill.id
        );
        
        if (validSkills.length > 0) {
          const uniqueSkills = validSkills.reduce((acc: any[], skill: any) => {
            const skillName = skill.skill || skill.name;
            const skillId = skill.id;
            const existingIndex = acc.findIndex(s => s.label === skillName);
            
            if (existingIndex === -1) {
              acc.push({
                label: skillName,
                value: skillId.toString(),
                skillId: skillId,
                skillName: skillName
              });
            }
            return acc;
          }, []);
          
          setSkillList(uniqueSkills);
        }
      }
    } catch (error) {
      setSkillList([]);
    }
  };

  // Form fields configuration - matching create job form
  const formFields = React.useMemo((): FieldConfig[] => [
    { name: "jobManualID" as keyof FormDataType, label: "Job Manual ID", type: "text" },
    { name: "jobTitle" as keyof FormDataType, label: "Job Title", type: "text" },
    {
      name: "jobOccupation" as keyof FormDataType,
      label: "Job Department",
      type: "select",
      options: [{ label: "Select Department", value: "_none" }, ...occupations],
    },
    {
      name: "jobSkill" as keyof FormDataType,
      label: "Job Skill (Multiple)",
      type: "multiple",
      options: [{ label: "Select Skill", value: "_none" }, ...skillList],
    },
    { name: "cmpNameACT" as keyof FormDataType, label: "Actual Hiring Company", type: "text" },
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
    },
    { name: "jobInterviewDate" as keyof FormDataType, label: "Interview Date", type: "date" },
    { name: "jobInterviewPlace" as keyof FormDataType, label: "Interview Place", type: "text" },
    {
      name: "jobLocationCountry" as keyof FormDataType,
      label: "Job Location Country",
      type: "select",
      options: [{ label: "Select Country", value: "_select_country" }, ...countryList],
    },
    { name: "jobArea" as keyof FormDataType, label: "Job Location City", type: "text" },
    { name: "jobDeadline" as keyof FormDataType, label: "Job Deadline", type: "date" },
    { name: "jobVacancyNo" as keyof FormDataType, label: "Number Of Vacancy", type: "number" },
    { name: "jobWages" as keyof FormDataType, label: "Wages per month", type: "number" },
    {
      name: "jobWagesCurrencyType" as keyof FormDataType,
      label: "Wages Currency Type",
      type: "select",
      options: [{ label: "Select Currency", value: "_select_currency" }, ...currencyList],
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
    },
    { name: "service_charge" as keyof FormDataType, label: "Service Charge (in INR)", type: "number" },
    { name: "contract_period" as keyof FormDataType, label: "Contract Period (in months)", type: "number" },
    {
      name: "expCerificateReq" as keyof FormDataType,
      label: "Experience Certificate Required",
      type: "select",
      options: [
        { label: "Select", value: "_select" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
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
    },
    {
      name: "jobExpReq" as keyof FormDataType,
      label: "Job Experience ",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobExpTypeReq" as keyof FormDataType,
      label: "Experience Type within India/International",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Within India", value: "national" },
        { label: "International", value: "international" },
        { label: "India/International", value: "Any" },
      ],
    },
    {
      name: "jobExpDuration" as keyof FormDataType,
      label: "Year of Experience ",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        ...Array.from({ length: 10 }, (_, i) => ({ label: `${i + 1} year of Experience`, value: `${i + 1}` }))
      ],
    },
    {
      name: "DLReq" as keyof FormDataType,
      label: "Driving License ",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Indian", value: "Indian" },
        { label: "International", value: "International" },
        { label: "Both Indian and International", value: "Both Indian and International" },
        { label: "No", value: "No" },
      ],
    },
    {
      name: "jobWorkingDay" as keyof FormDataType,
      label: "Job Working Day Per Month",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        ...Array.from({ length: 11 }, (_, i) => ({ label: `${20 + i}`, value: `${20 + i}` }))
      ],
    },
    { 
      name: "jobWorkingHour" as keyof FormDataType, 
      label: "Job Working Hour", 
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        ...Array.from({ length: 24 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))
      ],
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
    },
    {
      name: "jobFood" as keyof FormDataType,
      label: "Food Allowance",
      type: "select",
      options: [
        { label: "Select", value: "_none" },
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
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
    },
    { name: "jobAgeLimit" as keyof FormDataType, label: "Age Limit", type: "number" },
    { name: "hrName" as keyof FormDataType, label: "HR Name", type: "text" },
    { name: "hrEmail" as keyof FormDataType, label: "HR Email", type: "email" },
    { name: "hrNumber" as keyof FormDataType, label: "HR Number", type: "text" },
    { name: "companyJobID" as keyof FormDataType, label: "Company Job ID", type: "text" },
    {
      name: "languageRequired" as keyof FormDataType,
      label: "Language ",
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
    { name: "jobDescription" as keyof FormDataType, label: "Job Description", type: "textarea" },
    { name: "jobPhoto" as keyof FormDataType, label: "Job Photo", type: "file" },
  ], [occupations, skillList, countryList, currencyList]);

  const fieldsByName = React.useMemo(() => 
    Object.fromEntries(formFields.map((f) => [f.name, f] as const))
  , [formFields]);

  // Form validation - matching create job form
  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormDataType, string>> = {};
    const missingFields: string[] = [];
    
    REQUIRED_FIELDS.forEach(field => {
      const value = formData[field];
      
      if (field === 'jobPhoto') {
        // For edit, jobPhoto is only required if no existing photo
        if (!existingJobPhoto && (!value || !(value instanceof File) || value.size === 0)) {
          const fieldLabel = fieldsByName[field]?.label || field;
          newErrors[field] = `${fieldLabel} is required`;
          missingFields.push(fieldLabel);
        }
      }
      else if (Array.isArray(value)) {
        if (value.length === 0) {
          const fieldLabel = fieldsByName[field]?.label || field;
          newErrors[field] = `${fieldLabel} is required`;
          missingFields.push(fieldLabel);
        }
      }
      else if (typeof value === 'string') {
        if (value.trim() === '' || value.startsWith('_')) {
          const fieldLabel = fieldsByName[field]?.label || field;
          newErrors[field] = `${fieldLabel} is required`;
          missingFields.push(fieldLabel);
        }
      }
      else if (!value) {
        const fieldLabel = fieldsByName[field]?.label || field;
        newErrors[field] = `${fieldLabel} is required`;
        missingFields.push(fieldLabel);
      }
    });
    
    if (formData.jobExpReq === "Yes") {
      const expTypeValue = formData.jobExpTypeReq;
      if (!expTypeValue || 
          (typeof expTypeValue === 'string' && (expTypeValue.trim() === '' || expTypeValue.startsWith('_')))) {
        const fieldLabel = fieldsByName.jobExpTypeReq?.label || 'Experience Type within India/International';
        newErrors.jobExpTypeReq = `${fieldLabel} is required`;
        missingFields.push(fieldLabel);
      }
      
      const expDurationValue = formData.jobExpDuration;
      if (!expDurationValue || 
          (typeof expDurationValue === 'string' && (expDurationValue.trim() === '' || expDurationValue.startsWith('_')))) {
        const fieldLabel = fieldsByName.jobExpDuration?.label || 'Year of Experience';
        newErrors.jobExpDuration = `${fieldLabel} is required`;
        missingFields.push(fieldLabel);
      }
    }
    
    if (formData.hrEmail && !formData.hrEmail.toString().startsWith('_')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.hrEmail.toString())) {
        newErrors.hrEmail = 'Please enter a valid email address';
      }
    }
    
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
    
    if (formData.jobDeadline && !formData.jobDeadline.toString().startsWith('_')) {
      const deadlineDate = new Date(formData.jobDeadline.toString());
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (deadlineDate < today) {
        newErrors.jobDeadline = 'Job deadline cannot be in the past';
      }
    }
    
    setErrors(newErrors);
    
    if (missingFields.length > 0) {
      if (missingFields.length === 1) {
        toast.error(`${missingFields[0]} is required`);
      } else if (missingFields.length <= 3) {
        toast.error(`Required fields: ${missingFields.join(', ')}`);
      } else {
        toast.error(`Please fill in all required fields (${missingFields.length} missing)`);
      }
    }
    
    const otherErrors = Object.keys(newErrors).filter(key => 
      !REQUIRED_FIELDS.includes(key as keyof FormDataType)
    );
    
    if (otherErrors.length > 0) {
      const firstError = newErrors[otherErrors[0] as keyof FormDataType];
      toast.error(firstError || 'Please check your form inputs');
    }
    
    return Object.keys(newErrors).length === 0;
  };

  // Form submission handler - matching create job form but calling editJob
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setErrors({});
    
    if (!validateForm()) {
      return;
    }
    
    setSaving(true);

    try {
      let accessToken = localStorage.getItem('access_token');
      if (!accessToken) {
        const legacyToken = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (legacyToken) {
          localStorage.setItem('access_token', legacyToken);
          accessToken = legacyToken;
        } else {
          throw new Error('Authentication token not found. Please log in again.');
        }
      }
      
      const formDataInstance = new FormData();
      let hasValidData = false;
      const normalizedValues = normalizeSubmissionValues(formData, formFields);
      
      const arrayFields: (keyof FormDataType)[] = ['jobSkill', 'languageRequired'];
      
      formFields.forEach((fieldConfig) => {
        const fieldName = fieldConfig.name;
        const value = normalizedValues[fieldName];
        
        if (Array.isArray(value)) {
          if (!arrayFields.includes(fieldName)) {
            formDataInstance.append(fieldName, '');
            return;
          }
          
          if (value.length > 0) {
            const validItems: (string | number)[] = [];
            value.forEach((item) => {
              if (typeof item === 'string') {
                const trimmed = item.trim();
                if (trimmed && trimmed !== '' && !trimmed.startsWith('_')) {
                  if (fieldName === 'jobSkill' && !isNaN(Number(trimmed))) {
                    validItems.push(Number(trimmed));
                  } else {
                    validItems.push(trimmed);
                  }
                }
              } else if (typeof item === 'number') {
                validItems.push(item);
              }
            });
            
            if (validItems.length > 0) {
              const jsonString = JSON.stringify(validItems);
              formDataInstance.append(fieldName, jsonString);
              hasValidData = true;
            } else {
              formDataInstance.append(fieldName, JSON.stringify([]));
            }
          } else {
            formDataInstance.append(fieldName, JSON.stringify([]));
          }
        } else if (value instanceof File) {
          if (value.size > 0) {
            if (value.size > 10 * 1024 * 1024) {
              throw new Error('File size must be less than 10MB');
            }
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(value.type)) {
              throw new Error('Only JPEG, PNG, and WebP images are allowed');
            }
            formDataInstance.append(fieldName, value);
            hasValidData = true;
          } else {
            // If no new file uploaded and existing photo exists, don't append (backend will keep existing)
            if (!existingJobPhoto) {
              formDataInstance.append(fieldName, '');
            }
          }
        } else {
          let stringValue: string;
          if (value == null || value === '') {
            stringValue = '';
          } else if (typeof value === 'string') {
            stringValue = value.trim();
          } else if (typeof value === 'number' || typeof value === 'boolean') {
            stringValue = String(value);
          } else {
            stringValue = String(value).trim();
          }
          
          formDataInstance.append(fieldName, stringValue);
          if (stringValue !== '') {
            hasValidData = true;
          }
        }
      });
      
      if (!hasValidData) {
        throw new Error('No valid data to submit. Please fill in the required fields.');
      }
      
      if (formDataInstance.has('jobOccupation')) {
        const occValue = formDataInstance.get('jobOccupation');
        if (occValue) {
          formDataInstance.set('jobOccupation', String(occValue));
        }
      }
      
      // Call editJob instead of createJob
      const response = await editJob(parseInt(jobId), formDataInstance, accessToken);
      
      if (response && typeof response === 'object') {
        if ('message' in response && (response.message === 'Job updated successfully' || response.message === 'Job edited successfully')) {
          toast.success('🎉 Job updated successfully!');
        } else if ('error' in response) {
          throw new Error(response.error as string || 'Server error occurred');
        } else {
          toast.success('🎉 Job updated successfully!');
        }
      } else {
        toast.success('🎉 Job updated successfully!');
      }
      
      router.push("/hra-jobs");
      
    } catch (error: any) {
      let errorMessage = '❌ Failed to update job. Please try again.';
      
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast.error(errorMessage, { duration: 5000 });
      
    } finally {
      setSaving(false);
    }
  };

  // Helper functions for placeholders
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
      jobWorkingHour: "Working hours per day",
      jobOvertime: "Select Overtime policy",
      jobFood: "Select Food Allowance",
      jobAccommodation: "Select Accommodation",
      jobMedicalFacility: "Select Medical facility",
      jobTransportation: "Select Transportation",
      languageRequired: "Add a language",
    };
    return map[name] || fallback;
  };

  // Form sections - matching create job form
  const formSections = React.useMemo(() => [
    {
      id: 'basic-info',
      title: 'Basic Job Information',
      description: 'Essential details about the job position',
      icon: '💼',
      fields: ['jobManualID', 'jobTitle', 'jobOccupation', 'jobSkill', 'cmpNameACT', 'jobDescription']
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

  // Render field function - matching create job form
  const renderField = (field: FieldConfig) => {
    const fieldName = field.name as keyof FormDataType;
    const error = errors[fieldName];
    const isRequired = REQUIRED_FIELDS.includes(fieldName) || 
                      (fieldName === 'jobExpTypeReq' && formData.jobExpReq === 'Yes') || 
                      (fieldName === 'jobExpDuration' && formData.jobExpReq === 'Yes');
    
    const isHrField = ['hrName', 'hrEmail', 'hrNumber'].includes(fieldName);
    const showLoading = isHrField && hrDetailsLoading;

    return (
      <div key={fieldName} className="space-y-2">
        <Label htmlFor={fieldName} className="text-sm font-medium text-gray-700 flex items-center gap-1">
          {field.label}
          {isRequired && <span className="text-red-500 font-bold text-base ml-1" aria-label="required">*</span>}
        </Label>
        
        {field.type === "select" && (
          (() => {
            const rawValue = getFormValue(formData, fieldName);
            const selectValue =
              typeof rawValue === "string" &&
              rawValue.trim() !== "" &&
              !rawValue.startsWith("_")
                ? rawValue
                : undefined;

            return (
          <Select
            value={selectValue}
            onValueChange={(value: string) => {
              setFormData((prev) => ({ ...prev, [field.name]: value }));
              if (field.name === "jobOccupation") {
                getSkillList(value);
              }
              if (field.name === "jobExpReq" && value === "No") {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.jobExpTypeReq;
                  delete newErrors.jobExpDuration;
                  return newErrors;
                });
                setFormData((prev) => ({
                  ...prev,
                  jobExpTypeReq: '',
                  jobExpDuration: '',
                }));
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
            );
          })()
        )}
        
        {field.type === "multiple" && (
          <div className="space-y-3">
            {Array.isArray(formData[field.name as keyof FormDataType]) && (formData[field.name as keyof FormDataType] as string[]).length > 0 && (
              <div className="flex flex-wrap gap-2">
                {(formData[field.name as keyof FormDataType] as string[])
                  .filter(item => item && item !== "_none")
                  .map((item, index) => {
                    const option = skillList.find(opt => opt.value === item) || 
                                  formFields.find(f => f.name === 'languageRequired')?.options?.find(opt => opt.value === item);
                    const displayName = option?.label || item;
                    
                    return (
                      <span
                        key={`${item}-${index}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                      >
                        {displayName}
                        <button
                          type="button"
                          onClick={() => {
                            const current = (formData[field.name as keyof FormDataType] as string[]) || [];
                            const updated = current.filter(s => s !== item);
                            setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, updated));
                          }}
                          className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
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
            
            <Select
              value=""
              onValueChange={(value: string) => {
                if (value && value !== "_none") {
                  const current = (formData[field.name as keyof FormDataType] as string[]) || [];
                  if (!current.includes(value)) {
                    const updated = [...current, value];
                    setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, updated));
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
                    const current = (formData[field.name as keyof FormDataType] as string[]) || [];
                    const isSelected = current.includes(option.value);
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
            className={`min-h-[120px] resize-none placeholder:text-gray-300 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
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
              className={`h-11 placeholder:text-gray-500 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} ${showLoading ? 'bg-gray-50 cursor-not-allowed' : ''}`}
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
            {existingJobPhoto && !(formData[field.name as keyof FormDataType] instanceof File) && (
              <div className="mb-2">
                <p className="text-sm text-gray-600 mb-2">Current photo:</p>
                <img src={existingJobPhoto} alt="Current job photo" className="max-w-xs h-32 object-cover rounded border" />
              </div>
            )}
            <Input
              id={field.name}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) =>
                setFormData(prev => updateFormData(prev, field.name as keyof FormDataType, e.target.files?.[0] || null))
              }
              className={`h-11 ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            />
            {formData[field.name as keyof FormDataType] instanceof File && (
              <p className="text-sm text-green-600 flex items-center gap-1">
                <span>✓</span>
                New file selected: {(formData[field.name as keyof FormDataType] as File).name} ({(Math.round((formData[field.name as keyof FormDataType] as File).size / 1024))} KB)
              </p>
            )}
            <p className="text-xs text-gray-500">Max 10MB. Supported: JPEG, PNG, WebP. Leave empty to keep current photo.</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Job - {formData.jobTitle || 'Job'} | Overseas.ai</title>
        <meta name="description" content={`Edit job posting for ${formData.jobTitle || 'job'} position`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Job Posting</h1>
            <p className="text-gray-600 max-w-2xl mx-auto mb-4">
              Update the information below to modify your job posting. 
              All fields marked with <span className="text-red-500">*</span> are required.
            </p>
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
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{section.icon}</span>
                      <div>
                        <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                        <p className="text-blue-100 text-sm">{section.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {sectionFields
                        .filter(field => {
                          if (field.name === 'jobExpTypeReq' || field.name === 'jobExpDuration') {
                            return formData.jobExpReq === 'Yes';
                          }
                          return true;
                        })
                        .map(field => (
                        <div 
                          key={field.name} 
                          className={`
                            ${field.type === 'textarea' ? 'sm:col-span-2 md:col-span-3' : ''}
                          `}
                        >
                          {renderField(field)}
                        </div>
                      ))}
                    </div>
                  </div>

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

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>Review all information before updating the job posting.</p>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.push("/hra-jobs")}
                    className="px-6 py-2 h-11"
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={saving}
                    className="px-8 py-2 h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-sm"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                        Updating Job...
                      </>
                    ) : (
                      'Update Job Posting'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
