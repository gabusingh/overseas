"use client";
import React, { useEffect, useState } from "react";
import { getCountriesForJobs } from "../services/info.service";
import { getOccupations } from "../services/job.service";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { X, Filter } from "lucide-react";

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
      const response = await getOccupations();
      console.log('Occupations API Response:', response); // Debug log
      
      // Handle different possible response structures
      let occupationData = [];
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
        img: "/images/institute.png", // Use existing image instead of backend URL that might not exist
      }));
      
      console.log('Processed occupations:', occupations); // Debug log
      setDepartmentList(occupations || []);
    } catch (error) {
      console.log('Error fetching occupations:', error);
    }
  };

  const getCountriesForJobsFunc = async () => {
    try {
      const response = await getCountriesForJobs();
      console.log('Countries API Response:', response); // Debug log
      
      // Handle different possible response structures
      let countryData = [];
      if (response?.countries && Array.isArray(response.countries)) {
        countryData = response.countries;
      } else if (response?.data && Array.isArray(response.data)) {
        countryData = response.data;
      } else if (Array.isArray(response)) {
        countryData = response;
      }
      
      console.log('Processed countries:', countryData); // Debug log
      setCountryList(countryData || []);
    } catch (error) {
      console.log('Error fetching countries:', error);
    }
  };

  useEffect(() => {
    getCountriesForJobsFunc();
    getOccupationsListFunc();
  }, []);

  const handleCheckboxChange = (type: string, value: number | string) => {
    setPayload((prevState: JobFilterPayload) => {
      const updated = { ...prevState };
      if (type === "jobOccupation") {
        if (updated.jobOccupation.includes(value as number)) {
          updated.jobOccupation = updated.jobOccupation.filter(
            (item) => item !== value
          );
        } else {
          updated.jobOccupation.push(value as number);
        }
      } else if (type === "jobLocationCountry") {
        if (updated.jobLocationCountry.includes(value as number)) {
          updated.jobLocationCountry = updated.jobLocationCountry.filter(
            (item) => item !== value
          );
        } else {
          updated.jobLocationCountry.push(value as number);
        }
      } else if (type === "passportType") {
        updated.passportType = updated.passportType === value ? "" : (value as string);
      } else if (type === "languageRequired") {
        if (updated.languageRequired.includes(value as string)) {
          updated.languageRequired = updated.languageRequired.filter(
            (item) => item !== value
          );
        } else {
          updated.languageRequired.push(value as string);
        }
      } else if (type === "contractPeriod") {
        updated.contractPeriod = updated.contractPeriod === value ? "" : (value as string);
      } else if (type === "jobExpTypeReq") {
        updated.jobExpTypeReq = updated.jobExpTypeReq === value ? "" : (value as string);
      } else if (type === "sortBy") {
        updated.sortBy = updated.sortBy === value ? "" : (value as string);
      }
      return updated;
    });
  };

  const handleRemoveBadge = (type: string, value: number | string) => {
    setPayload((prevState: JobFilterPayload) => {
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

  return (
    <div className="bg-white lg:rounded-lg lg:border lg:border-gray-200 h-full lg:h-auto flex flex-col">
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
      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Applied Filters - Clean Style */}
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
          <div className="space-y-2.5">
            {[
              "service_charge_asc",
              "salary_desc",
              "experience_asc",
              "age_limit_desc",
              "date_posted_desc",
              "working_hours_asc",
            ].map((sortOption) => (
              <label key={sortOption} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value={sortOption}
                  checked={payload.sortBy === sortOption}
                  onChange={() => handleCheckboxChange("sortBy", sortOption)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
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
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Department */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Department</h4>
          <div className="space-y-2.5">
            {(showFullDep ? departmentList : departmentList.slice(0, 6)).map(
              (v, i) => (
                <label key={i} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    value={v.value}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 rounded"
                    checked={payload.jobOccupation.includes(v.value)}
                    onChange={() =>
                      handleCheckboxChange("jobOccupation", v.value)
                    }
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{v.label}</span>
                </label>
              )
            )}
            {showFullDep ? (
              <button
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setShowFullDep(false)}
              >
                Show Less Options
              </button>
            ) : (
              departmentList.length > 6 && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
          <div className="space-y-2.5">
            {(showFullCountry ? countryList : countryList.slice(0, 6)).map(
              (v, i) => (
                <label key={i} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    value={v.id}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 rounded"
                    checked={payload.jobLocationCountry.includes(v.id)}
                    onChange={() =>
                      handleCheckboxChange("jobLocationCountry", v.id)
                    }
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{v.name}</span>
                </label>
              )
            )}
            {showFullCountry ? (
              <button
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setShowFullCountry(false)}
              >
                Show Less Options
              </button>
            ) : (
              countryList.length > 6 && (
                <button
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
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
          <div className="space-y-2.5">
            {["ECR", "ECNR", "ECR/ECNR"].map((type) => (
              <label key={type} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value={type}
                  checked={payload.passportType === type}
                  onChange={() => handleCheckboxChange("passportType", type)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Experience Type */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Experience Type</h4>
          <div className="space-y-2.5">
            {["No", "National", "International", "Any"].map((type) => (
              <label key={type} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value={type}
                  checked={payload.jobExpTypeReq === type}
                  onChange={() => handleCheckboxChange("jobExpTypeReq", type)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Language Required */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Language Required</h4>
          <div className="space-y-2.5">
            {["English", "Arabic", "Japanese", "German", "Hindi"].map(
              (language) => (
                <label key={language} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    value={language}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3 rounded"
                    checked={payload.languageRequired.includes(language)}
                    onChange={() =>
                      handleCheckboxChange("languageRequired", language)
                    }
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{language}</span>
                </label>
              )
            )}
          </div>
        </div>

        <hr className="border-gray-200" />

        {/* Contract Period */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Contract Period</h4>
          <div className="space-y-2.5">
            {["12", "24", "36", "more"].map((period) => (
              <label key={period} className="flex items-center cursor-pointer group">
                <input
                  type="radio"
                  value={period}
                  checked={payload.contractPeriod === period}
                  onChange={() =>
                    handleCheckboxChange("contractPeriod", period)
                  }
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500 mr-3"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {period === "more"
                    ? "More than 36 months"
                    : `0 to ${period} months`}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Apply Button - Fixed at bottom */}
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
