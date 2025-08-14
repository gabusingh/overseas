"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface JobFormData {
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  location: string;
  country: string;
  jobType: string;
  experienceLevel: string;
  salaryRange: string;
  currency: string;
  benefits: string;
  applicationDeadline: string;
  positionsAvailable: string;
  companyName: string;
  industry: string;
  skillsRequired: string[];
  languagesRequired: string[];
  educationLevel: string;
  workingHours: string;
  accommodationProvided: boolean;
  visaSponsorship: boolean;
  medicalInsurance: boolean;
  transportationProvided: boolean;
}

export default function CreateJobsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const jobTypes = [
    { label: "Full-time", value: "full-time" },
    { label: "Part-time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Temporary", value: "temporary" },
    { label: "Internship", value: "internship" }
  ];

  const experienceLevels = [
    { label: "Entry Level (0-1 years)", value: "entry" },
    { label: "Junior (1-3 years)", value: "junior" },
    { label: "Mid-Level (3-5 years)", value: "mid" },
    { label: "Senior (5-8 years)", value: "senior" },
    { label: "Lead (8+ years)", value: "lead" }
  ];

  const countries = [
    { label: "UAE", value: "UAE" },
    { label: "Saudi Arabia", value: "Saudi Arabia" },
    { label: "Qatar", value: "Qatar" },
    { label: "Kuwait", value: "Kuwait" },
    { label: "Bahrain", value: "Bahrain" },
    { label: "Oman", value: "Oman" },
    { label: "Singapore", value: "Singapore" },
    { label: "Malaysia", value: "Malaysia" }
  ];

  const currencies = [
    { label: "AED", value: "AED" },
    { label: "SAR", value: "SAR" },
    { label: "QAR", value: "QAR" },
    { label: "KWD", value: "KWD" },
    { label: "BHD", value: "BHD" },
    { label: "OMR", value: "OMR" },
    { label: "SGD", value: "SGD" },
    { label: "MYR", value: "MYR" },
    { label: "USD", value: "USD" }
  ];

  const educationLevels = [
    { label: "High School", value: "high-school" },
    { label: "Diploma", value: "diploma" },
    { label: "Bachelor's Degree", value: "bachelors" },
    { label: "Master's Degree", value: "masters" },
    { label: "PhD", value: "phd" }
  ];

  const validationSchema = Yup.object({
    jobTitle: Yup.string().required("Job title is required"),
    jobDescription: Yup.string().required("Job description is required").min(50, "Description must be at least 50 characters"),
    requirements: Yup.string().required("Requirements are required"),
    location: Yup.string().required("Location is required"),
    country: Yup.string().required("Country is required"),
    jobType: Yup.string().required("Job type is required"),
    experienceLevel: Yup.string().required("Experience level is required"),
    salaryRange: Yup.string().required("Salary range is required"),
    currency: Yup.string().required("Currency is required"),
    applicationDeadline: Yup.date().required("Application deadline is required").min(new Date(), "Deadline must be in the future"),
    positionsAvailable: Yup.number().positive("Must be positive").integer("Must be a whole number").required("Number of positions is required"),
    companyName: Yup.string().required("Company name is required"),
    industry: Yup.string().required("Industry is required"),
    educationLevel: Yup.string().required("Education level is required"),
    workingHours: Yup.string().required("Working hours are required")
  });

  const initialValues: JobFormData = {
    jobTitle: "",
    jobDescription: "",
    requirements: "",
    location: "",
    country: "",
    jobType: "",
    experienceLevel: "",
    salaryRange: "",
    currency: "AED",
    benefits: "",
    applicationDeadline: "",
    positionsAvailable: "1",
    companyName: "",
    industry: "",
    skillsRequired: [],
    languagesRequired: [],
    educationLevel: "",
    workingHours: "",
    accommodationProvided: false,
    visaSponsorship: false,
    medicalInsurance: false,
    transportationProvided: false
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem("access_token");
    const user = localStorage.getItem("loggedUser");
    
    if (!token || !user) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(user);
    setUserData(userData);
    
    // Pre-fill company name if available
    initialValues.companyName = userData?.cmpData?.cmpName || "";
  };

  const onSubmit = async (values: JobFormData) => {
    setLoading(true);
    try {
      // Mock API call - replace with actual service
      const response = await mockCreateJob(values);
      
      if (response.success) {
        toast.success("Job posted successfully!");
        setTimeout(() => {
          router.push("/hra-jobs");
        }, 1500);
      } else {
        toast.error("Failed to create job");
      }
    } catch (error) {
      console.error("Create job error:", error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  // Mock function - replace with actual API call
  const mockCreateJob = async (values: JobFormData) => {
    return new Promise<{success: boolean}>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  return (
    <>
      <Head>
        <title>Create Job Posting - Post New Job | Overseas.ai</title>
        <meta name="description" content="Create and post new job opportunities for international candidates. Reach qualified candidates worldwide." />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold textBlue mb-2">
                <i className="fa fa-plus-circle mr-3"></i>
                Create Job Posting
              </h1>
              <p className="text-gray-600">
                Fill out the form below to post a new job opportunity
              </p>
            </div>
            <button
              onClick={() => router.push("/hra-dashboard")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Dashboard
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ values, setFieldValue }) => (
              <Form className="p-6">
                {/* Basic Job Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold textBlue mb-4 pb-2 border-b">
                    <i className="fa fa-info-circle mr-2"></i>
                    Basic Job Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <Field
                        name="jobTitle"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Senior Software Engineer"
                      />
                      <ErrorMessage name="jobTitle" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <Field
                        name="companyName"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your company name"
                      />
                      <ErrorMessage name="companyName" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry *
                      </label>
                      <Field
                        name="industry"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Information Technology"
                      />
                      <ErrorMessage name="industry" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Positions *
                      </label>
                      <Field
                        name="positionsAvailable"
                        type="number"
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <ErrorMessage name="positionsAvailable" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Job Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold textBlue mb-4 pb-2 border-b">
                    <i className="fa fa-file-text mr-2"></i>
                    Job Description & Requirements
                  </h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Description *
                      </label>
                      <Field
                        as="textarea"
                        name="jobDescription"
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                      />
                      <ErrorMessage name="jobDescription" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Requirements *
                      </label>
                      <Field
                        as="textarea"
                        name="requirements"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="List the required qualifications, skills, and experience..."
                      />
                      <ErrorMessage name="requirements" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Benefits & Perks
                      </label>
                      <Field
                        as="textarea"
                        name="benefits"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the benefits, perks, and what makes this job attractive..."
                      />
                    </div>
                  </div>
                </div>

                {/* Job Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold textBlue mb-4 pb-2 border-b">
                    <i className="fa fa-cogs mr-2"></i>
                    Job Details
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Job Type *
                      </label>
                      <Field
                        as="select"
                        name="jobType"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Job Type</option>
                        {jobTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="jobType" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Level *
                      </label>
                      <Field
                        as="select"
                        name="experienceLevel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Experience Level</option>
                        {experienceLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="experienceLevel" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Education Level *
                      </label>
                      <Field
                        as="select"
                        name="educationLevel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Education Level</option>
                        {educationLevels.map((level) => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="educationLevel" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Hours *
                      </label>
                      <Field
                        name="workingHours"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 9:00 AM - 6:00 PM, Monday to Friday"
                      />
                      <ErrorMessage name="workingHours" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Location & Salary */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold textBlue mb-4 pb-2 border-b">
                    <i className="fa fa-map-marker mr-2"></i>
                    Location & Compensation
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country *
                      </label>
                      <Field
                        as="select"
                        name="country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                          <option key={country.value} value={country.value}>
                            {country.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="country" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City/Location *
                      </label>
                      <Field
                        name="location"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. Dubai, Abu Dhabi"
                      />
                      <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Currency *
                      </label>
                      <Field
                        as="select"
                        name="currency"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {currencies.map((currency) => (
                          <option key={currency.value} value={currency.value}>
                            {currency.label}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="currency" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Range *
                      </label>
                      <Field
                        name="salaryRange"
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 5000 - 8000 per month"
                      />
                      <ErrorMessage name="salaryRange" component="div" className="text-red-500 text-sm mt-1" />
                    </div>
                  </div>
                </div>

                {/* Additional Benefits */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold textBlue mb-4 pb-2 border-b">
                    <i className="fa fa-heart mr-2"></i>
                    Additional Benefits
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="visaSponsorship"
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Visa Sponsorship Provided
                      </label>
                    </div>

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="accommodationProvided"
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Accommodation Provided
                      </label>
                    </div>

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="medicalInsurance"
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Medical Insurance
                      </label>
                    </div>

                    <div className="flex items-center">
                      <Field
                        type="checkbox"
                        name="transportationProvided"
                        className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700">
                        Transportation Provided
                      </label>
                    </div>
                  </div>
                </div>

                {/* Application Deadline */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold textBlue mb-4 pb-2 border-b">
                    <i className="fa fa-calendar mr-2"></i>
                    Application Deadline
                  </h3>
                  
                  <div className="max-w-md">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Deadline *
                    </label>
                    <Field
                      name="applicationDeadline"
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <ErrorMessage name="applicationDeadline" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-between items-center pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => router.push("/hra-dashboard")}
                    className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="bgBlue text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Publishing Job...
                      </div>
                    ) : (
                      <>
                        <i className="fa fa-check mr-2"></i>
                        Publish Job
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
}
