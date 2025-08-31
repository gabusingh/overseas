"use client";
import React, { useEffect, useState } from "react";
import { getOccupations, getCountriesForJobs } from "../services/info.service";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { X, Filter, Check } from "lucide-react";

interface JobFilterProps {
  setShowFilter: (show: boolean) => void;
  payload: {
    jobOccupation: number[];
    jobLocationCountry: number[];
    passportType: string;
    languageRequired: string[];
    contractPeriod: string;
    jobExpTypeReq: string;
    sortBy: string;
  };
  setPayload: (payload: JobFilterPayload | ((prev: JobFilterPayload) => JobFilterPayload)) => void;
}

interface JobFilterPayload {
  jobOccupation: number[];
  jobLocationCountry: number[];
  passportType: string;
  languageRequired: string[];
  contractPeriod: string;
  jobExpTypeReq: string;
  sortBy: string;
}

interface Department {
  label: string;
  value: number;
  img: string;
}

interface Country {
  id: number;
  name: string;
}

interface OccupationApiResponse {
  data: Array<{ id: number; title: string; name: string }>;
}

interface CountryApiResponse {
  data: Array<{ id: number; name: string }>;
}

function JobFilter({ setShowFilter, payload, setPayload }: JobFilterProps) {
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  const [countryList, setCountryList] = useState<Country[]>([]);
  const [showFullDep, setShowFullDep] = useState(false);
  const [showFullCountry, setShowFullCountry] = useState(false);

  const getOccupationsListFunc = async () => {
    try {
      console.log('🔄 Fetching occupations...');
      const response = await getOccupations();
      console.log('📊 Occupations API Response:', response);
      
      let occupationData: any[] = [];
      if (response?.occupation && Array.isArray(response.occupation)) {
        occupationData = response.occupation;
      } else if (response?.data && Array.isArray(response.data)) {
        occupationData = response.data;
      } else if (Array.isArray(response)) {
        occupationData = response;
      }
      
      const occupations = occupationData.map((item: any) => ({
        label: item.occupation || item.title || item.name,
        value: item.id,
        img: "/images/institute.png",
      }));
      
      console.log('✅ Processed occupations:', occupations.length);
      setDepartmentList(occupations || []);
    } catch (error) {
      console.error('❌ Error fetching occupations:', error);
      // Fallback occupations
      const fallbackOccupations = [
        { label: "Construction", value: 1, img: "/images/institute.png" },
        { label: "Hospitality", value: 2, img: "/images/institute.png" },
        { label: "Healthcare", value: 3, img: "/images/institute.png" },
        { label: "Oil & Gas", value: 4, img: "/images/institute.png" },
        { label: "IT & Software", value: 5, img: "/images/institute.png" },
      ];
      setDepartmentList(fallbackOccupations);
    }
  };

  const getCountriesForJobsFunc = async () => {
    try {
      console.log('🔄 Fetching countries...');
      const response = await getCountriesForJobs();
      console.log('📊 Countries API Response:', response);
      
      let countryData: any[] = [];
      if (response?.countries && Array.isArray(response.countries)) {
        countryData = response.countries;
      } else if (response?.data && Array.isArray(response.data)) {
        countryData = response.data;
      } else if (Array.isArray(response)) {
        countryData = response;
      }
      
      console.log('✅ Processed countries:', countryData.length);
      setCountryList(countryData || []);
    } catch (error) {
      console.error('❌ Error fetching countries:', error);
      // Fallback countries
      const fallbackCountries = [
        { id: 1, name: "United Arab Emirates" },
        { id: 2, name: "Saudi Arabia" },
        { id: 3, name: "Qatar" },
        { id: 4, name: "Kuwait" },
        { id: 5, name: "Singapore" },
      ];
      setCountryList(fallbackCountries);
    }
  };

  useEffect(() => {
    getCountriesForJobsFunc();
    getOccupationsListFunc();
  }, []);

  const handleCheckboxChange = (type: string, value: number | string) => {
    console.log('Checkbox clicked:', type, value); // Debug log
    
    setPayload((prevState: JobFilterPayload) => {
      const updated = { ...prevState };
      
      if (type === "jobOccupation") {
        const numValue = value as number;
        if (updated.jobOccupation.includes(numValue)) {
          updated.jobOccupation = updated.jobOccupation.filter(item => item !== numValue);
        } else {
          updated.jobOccupation = [...updated.jobOccupation, numValue];
        }
      } else if (type === "jobLocationCountry") {
        const numValue = value as number;
        if (updated.jobLocationCountry.includes(numValue)) {
          updated.jobLocationCountry = updated.jobLocationCountry.filter(item => item !== numValue);
        } else {
          updated.jobLocationCountry = [...updated.jobLocationCountry, numValue];
        }
      } else if (type === "passportType") {
        updated.passportType = updated.passportType === value ? "" : (value as string);
      } else if (type === "languageRequired") {
        const strValue = value as string;
        if (updated.languageRequired.includes(strValue)) {
          updated.languageRequired = updated.languageRequired.filter(item => item !== strValue);
        } else {
          updated.languageRequired = [...updated.languageRequired, strValue];
        }
      } else if (type === "contractPeriod") {
        updated.contractPeriod = updated.contractPeriod === value ? "" : (value as string);
      } else if (type === "jobExpTypeReq") {
        updated.jobExpTypeReq = updated.jobExpTypeReq === value ? "" : (value as string);
      } else if (type === "sortBy") {
        updated.sortBy = updated.sortBy === value ? "" : (value as string);
      }
      
      console.log('Updated payload:', updated); // Debug log
      return updated;
    });
  };

  const handleRemoveBadge = (type: string, value: number | string) => {
    setPayload((prevState: JobFilterPayload) => {
      const updated = { ...prevState };
      if (type === "jobOccupation") {
        updated.jobOccupation = updated.jobOccupation.filter(item => item !== value);
      } else if (type === "jobLocationCountry") {
        updated.jobLocationCountry = updated.jobLocationCountry.filter(item => item !== value);
      } else if (type === "passportType") {
        updated.passportType = "";
      } else if (type === "languageRequired") {
        updated.languageRequired = updated.languageRequired.filter(item => item !== value);
      } else if (type === "contractPeriod") {
        updated.contractPeriod = "";
      }
      return updated;
    });
  };

  const handleApplyFilters = () => {
    setShowFilter(false);
  };

  const getLabelById = (id: number, list: Department[]) => {
    const item = list.find((v) => v.value === id);
    return item ? item.label : id;
  };

  const getCountryNameById = (id: number) => {
    const country = countryList.find((v) => v.id === id);
    return country ? country.name : id;
  };

  // Custom Checkbox Component
  const CustomCheckbox = ({ 
    checked, 
    onChange, 
    label, 
    value, 
    type = "checkbox" 
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
    value: string | number;
    type?: "checkbox" | "radio";
  }) => (
    <div 
      className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors duration-150"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onChange();
      }}
      role={type}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onChange();
        }
      }}
      aria-checked={checked}
    >
      <div className="relative flex-shrink-0">
        <div 
          className={`w-5 h-5 border-2 rounded transition-all duration-200 flex items-center justify-center ${
            checked 
              ? 'bg-blue-600 border-blue-600' 
              : 'bg-white border-gray-300 group-hover:border-blue-400'
          }`}
        >
          {checked && (
            <Check className="w-3 h-3 text-white" />
          )}
        </div>
        <input
          type={type}
          checked={checked}
          onChange={onChange}
          value={value}
          className="sr-only"
          aria-label={label}
        />
      </div>
      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 select-none">
        {label}
      </span>
    </div>
  );

  return (
    <div className="bg-white lg:rounded-lg lg:border lg:border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">All Filters</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-1 h-6 w-6"
            onClick={() => setShowFilter(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="p-4 space-y-6 flex-1 overflow-y-auto max-h-[calc(100vh-20rem)]">
        {/* Applied Filters */}
        <div className="space-y-2">
          {Object.entries(payload).some(([key, values]) => 
            (Array.isArray(values) && values.length > 0) || 
            (key === "passportType" && values) || 
            (key === "contractPeriod" && values) ||
            (key === "jobExpTypeReq" && values) ||
            (key === "sortBy" && values)
          ) && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-700 uppercase tracking-wide">Applied Filters</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs text-blue-600 hover:text-blue-700 p-0 h-auto"
                  onClick={() => setPayload({
                    jobOccupation: [],
                    jobLocationCountry: [],
                    passportType: "",
                    languageRequired: [],
                    contractPeriod: "",
                    jobExpTypeReq: "",
                    sortBy: ""
                  })}
                >
                  Clear all
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(payload).map(([key, values]) =>
                  Array.isArray(values) && values.length > 0
                    ? values.map((item) => (
                        <span
                          key={item}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          {key === "jobLocationCountry"
                            ? getCountryNameById(item as number)
                            : key === "jobOccupation"
                            ? getLabelById(item as number, departmentList)
                            : item}
                          <button
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                            onClick={() => handleRemoveBadge(key, item)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))
                    : ((key === "passportType" && values) ||
                       (key === "contractPeriod" && values) ||
                       (key === "jobExpTypeReq" && values) ||
                       (key === "sortBy" && values)) ? [
                        <span
                          key={String(values)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-200"
                        >
                          {key === "contractPeriod" && values === "more"
                            ? "More than 36 months"
                            : key === "contractPeriod"
                            ? `0 to ${values} months`
                            : values}
                          <button
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                            onClick={() => handleRemoveBadge(key, values as string)}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>,
                      ] : null
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Sort By</h4>
          <div className="space-y-1">
            {[
              { value: "service_charge_asc", label: "Service Charge - Low to high" },
              { value: "salary_desc", label: "Salary - High to Low" },
              { value: "experience_asc", label: "Experience - Fresher to Experienced" },
              { value: "age_limit_desc", label: "Age limit - High to Low" },
              { value: "date_posted_desc", label: "Date posted - New to Old" },
              { value: "working_hours_asc", label: "Working Hours - low to High" },
            ].map((option) => (
              <CustomCheckbox
                key={option.value}
                checked={payload.sortBy === option.value}
                onChange={() => handleCheckboxChange("sortBy", option.value)}
                label={option.label}
                value={option.value}
                type="radio"
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Department */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Department</h4>
          <div className="space-y-1">
            {(showFullDep ? departmentList : departmentList.slice(0, 6)).map((dept) => (
              <CustomCheckbox
                key={dept.value}
                checked={payload.jobOccupation.includes(dept.value)}
                onChange={() => handleCheckboxChange("jobOccupation", dept.value)}
                label={dept.label}
                value={dept.value}
                type="checkbox"
              />
            ))}
            {showFullDep ? (
              <button
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                onClick={() => setShowFullDep(false)}
              >
                Show Less Options
              </button>
            ) : (
              departmentList.length > 6 && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                  onClick={() => setShowFullDep(true)}
                >
                  +{departmentList.length - 6} more
                </button>
              )
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Country */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Country</h4>
          <div className="space-y-1">
            {(showFullCountry ? countryList : countryList.slice(0, 6)).map((country) => (
              <CustomCheckbox
                key={country.id}
                checked={payload.jobLocationCountry.includes(country.id)}
                onChange={() => handleCheckboxChange("jobLocationCountry", country.id)}
                label={country.name}
                value={country.id}
                type="checkbox"
              />
            ))}
            {showFullCountry ? (
              <button
                className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                onClick={() => setShowFullCountry(false)}
              >
                Show Less Options
              </button>
            ) : (
              countryList.length > 6 && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2"
                  onClick={() => setShowFullCountry(true)}
                >
                  +{countryList.length - 6} more
                </button>
              )
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Passport Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Passport Type</h4>
          <div className="space-y-1">
            {["ECR", "ECNR", "ECR/ECNR"].map((type) => (
              <CustomCheckbox
                key={type}
                checked={payload.passportType === type}
                onChange={() => handleCheckboxChange("passportType", type)}
                label={type}
                value={type}
                type="radio"
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Experience Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Experience Type</h4>
          <div className="space-y-1">
            {["No", "National", "International", "Any"].map((type) => (
              <CustomCheckbox
                key={type}
                checked={payload.jobExpTypeReq === type}
                onChange={() => handleCheckboxChange("jobExpTypeReq", type)}
                label={type}
                value={type}
                type="radio"
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Language Required */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Language Required</h4>
          <div className="space-y-1">
            {["English", "Arabic", "Japanese", "German", "Hindi"].map((language) => (
              <CustomCheckbox
                key={language}
                checked={payload.languageRequired.includes(language)}
                onChange={() => handleCheckboxChange("languageRequired", language)}
                label={language}
                value={language}
                type="checkbox"
              />
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Contract Period */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Contract Period</h4>
          <div className="space-y-1">
            {[
              { value: "12", label: "0 to 12 months" },
              { value: "24", label: "0 to 24 months" },
              { value: "36", label: "0 to 36 months" },
              { value: "more", label: "More than 36 months" },
            ].map((period) => (
              <CustomCheckbox
                key={period.value}
                checked={payload.contractPeriod === period.value}
                onChange={() => handleCheckboxChange("contractPeriod", period.value)}
                label={period.label}
                value={period.value}
                type="radio"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Apply Button */}
      <div className="lg:hidden p-4 border-t border-gray-100 bg-white flex-shrink-0">
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export default JobFilter;
