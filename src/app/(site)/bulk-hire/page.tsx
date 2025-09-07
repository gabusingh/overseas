"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAppliedCandidatesList, createBulkHire } from "@/services/hra.service";

interface Candidate {
  id: string;
  candidateName: string;
  email: string;
  phone: string;
  currentLocation: string;
  experience: string;
  expectedSalary: string;
  currency: string;
  skills: string[];
  education: string;
  profilePicture?: string;
  rating?: number;
  jobTitle: string;
  jobId: string;
  appliedDate: string;
  status: string;
}

interface BulkHireFormData {
  jobTitle: string;
  jobLocation: string;
  contractType: "permanent" | "contract" | "temporary";
  startDate: string;
  salaryOffered: string;
  currency: string;
  benefits: string[];
  workMode: "onsite" | "remote" | "hybrid";
  probationPeriod: string;
  joiningBonus: string;
  additionalNotes: string;
  sendWelcomeEmail: boolean;
  scheduleOrientation: boolean;
  createEmployeeProfiles: boolean;
}

const bulkHireValidationSchema = Yup.object().shape({
  jobTitle: Yup.string().required("Job title is required"),
  jobLocation: Yup.string().required("Job location is required"),
  contractType: Yup.string().required("Contract type is required"),
  startDate: Yup.date()
    .min(new Date(), "Start date must be in the future")
    .required("Start date is required"),
  salaryOffered: Yup.number()
    .positive("Salary must be positive")
    .required("Salary is required"),
  currency: Yup.string().required("Currency is required"),
  workMode: Yup.string().required("Work mode is required"),
  probationPeriod: Yup.string().required("Probation period is required"),
});

export default function BulkHirePage() {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Select Candidates, 2: Configure Hire Details, 3: Review & Confirm

  const availableBenefits = [
    "Health Insurance",
    "Dental Insurance", 
    "Vision Insurance",
    "Life Insurance",
    "Retirement Plan (401k)",
    "Paid Time Off",
    "Sick Leave",
    "Maternity/Paternity Leave",
    "Performance Bonus",
    "Stock Options",
    "Flexible Working Hours",
    "Remote Work Option",
    "Professional Development",
    "Gym Membership",
    "Transportation Allowance",
    "Meal Allowance",
    "Phone/Internet Allowance"
  ];

  const currencies = [
    { code: "AED", name: "UAE Dirham" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "QAR", name: "Qatari Riyal" },
    { code: "KWD", name: "Kuwaiti Dinar" }
  ];

  useEffect(() => {
    fetchShortlistedCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [availableCandidates, searchQuery]);

  const fetchShortlistedCandidates = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch actual applied candidates from API
      const response = await getAppliedCandidatesList(token, 1);
      
      if (response?.data && response.data.length > 0) {
        // Transform API response to match our Candidate interface
        const transformedCandidates: Candidate[] = response.data
          .filter((candidate: any) => candidate.status === 'shortlisted' || candidate.empStatus === 'Shortlisted')
          .map((candidate: any, index: number) => ({
            id: candidate.id?.toString() || index.toString(),
            candidateName: candidate.empName || candidate.candidateName || 'Unknown Candidate',
            email: candidate.empEmail || candidate.email || 'No email',
            phone: candidate.empMobile || candidate.phone || 'No phone',
            currentLocation: candidate.empCurrentLocation || candidate.currentLocation || 'Unknown Location',
            experience: candidate.experience || candidate.empExperience || '0 years',
            expectedSalary: candidate.empExpectedSalary || candidate.expectedSalary || '0',
            currency: candidate.currency || 'AED',
            skills: candidate.skills ? (typeof candidate.skills === 'string' ? candidate.skills.split(',') : candidate.skills) : [],
            education: candidate.empEducation || candidate.education || 'Not specified',
            profilePicture: candidate.empProfilePic || candidate.profilePicture,
            rating: candidate.rating || 0,
            jobTitle: candidate.jobTitle || candidate.job_title || candidate.position || 'Applied Position',
            jobId: candidate.jobId?.toString() || candidate.job_id?.toString() || '0',
            appliedDate: candidate.appliedOn || candidate.applied_on || new Date().toISOString().split('T')[0],
            status: candidate.status || candidate.empStatus || 'Applied'
          }));

        setAvailableCandidates(transformedCandidates);
        
        // If no shortlisted candidates, show all applied candidates
        if (transformedCandidates.length === 0) {
          // Show all applied candidates if no shortlisted ones
          const allCandidates: Candidate[] = response.data
            .map((candidate: any, index: number) => ({
              id: candidate.id?.toString() || index.toString(),
              candidateName: candidate.empName || candidate.candidateName || 'Unknown Candidate',
              email: candidate.empEmail || candidate.email || 'No email',
              phone: candidate.empMobile || candidate.phone || 'No phone',
              currentLocation: candidate.empCurrentLocation || candidate.currentLocation || 'Unknown Location',
              experience: candidate.experience || candidate.empExperience || '0 years',
              expectedSalary: candidate.empExpectedSalary || candidate.expectedSalary || '0',
              currency: candidate.currency || 'AED',
              skills: candidate.skills ? (typeof candidate.skills === 'string' ? candidate.skills.split(',') : candidate.skills) : [],
              education: candidate.empEducation || candidate.education || 'Not specified',
              profilePicture: candidate.empProfilePic || candidate.profilePicture,
              rating: candidate.rating || 0,
              jobTitle: candidate.jobTitle || candidate.job_title || candidate.position || 'Applied Position',
              jobId: candidate.jobId?.toString() || candidate.job_id?.toString() || '0',
              appliedDate: candidate.appliedOn || candidate.applied_on || new Date().toISOString().split('T')[0],
              status: candidate.status || candidate.empStatus || 'Applied'
            }));
          
          setAvailableCandidates(allCandidates);
          
          if (allCandidates.length > 0) {
            toast.info('No shortlisted candidates found. Showing all applied candidates.');
          }
        }
      } else {
        // No candidates available
        setAvailableCandidates([]);
      }
    } catch (error) {
      toast.error("Failed to load candidates. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = [...availableCandidates];

    if (searchQuery.trim()) {
      filtered = filtered.filter(candidate =>
        candidate.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.currentLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredCandidates(filtered);
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidates(prev => {
      const isSelected = prev.some(c => c.id === candidate.id);
      if (isSelected) {
        return prev.filter(c => c.id !== candidate.id);
      } else {
        return [...prev, candidate];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedCandidates.length === filteredCandidates.length) {
      setSelectedCandidates([]);
    } else {
      setSelectedCandidates([...filteredCandidates]);
    }
  };

  const handleBulkHire = async (values: BulkHireFormData) => {
    if (selectedCandidates.length === 0) {
      toast.error("Please select candidates to hire");
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        router.push("/login");
        return;
      }

      // Prepare form data for API
      const formData = new FormData();
      formData.append("candidateIds", JSON.stringify(selectedCandidates.map(c => c.id)));
      formData.append("jobTitle", values.jobTitle);
      formData.append("jobLocation", values.jobLocation);
      formData.append("contractType", values.contractType);
      formData.append("startDate", values.startDate);
      formData.append("salaryOffered", values.salaryOffered);
      formData.append("currency", values.currency);
      formData.append("benefits", JSON.stringify(values.benefits));
      formData.append("workMode", values.workMode);
      formData.append("probationPeriod", values.probationPeriod);
      formData.append("joiningBonus", values.joiningBonus || "0");
      formData.append("additionalNotes", values.additionalNotes);
      formData.append("sendWelcomeEmail", values.sendWelcomeEmail.toString());
      formData.append("scheduleOrientation", values.scheduleOrientation.toString());
      formData.append("createEmployeeProfiles", values.createEmployeeProfiles.toString());

      // Call actual bulk hire API
      const response = await createBulkHire(formData, token);

      if (response?.data?.success || response?.status === 200) {
        toast.success(`Successfully initiated hire process for ${selectedCandidates.length} candidates!`);
        
        // Reset form and redirect
        setSelectedCandidates([]);
        setCurrentStep(1);
        router.push("/hra-jobs");
      } else {
        throw new Error(response?.data?.message || "Failed to process bulk hire");
      }
      
    } catch (error: any) {
      toast.error(error?.message || "Failed to process bulk hire. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const getRatingStars = (rating?: number) => {
    if (!rating) return null;
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`fa fa-star text-sm ${
              i < fullStars 
                ? 'text-yellow-400' 
                : i === fullStars && hasHalfStar 
                  ? 'text-yellow-400' 
                  : 'text-gray-300'
            }`}
          ></i>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const initialValues: BulkHireFormData = {
    jobTitle: "Senior Software Engineer",
    jobLocation: "Dubai, UAE",
    contractType: "permanent",
    startDate: "",
    salaryOffered: "",
    currency: "AED",
    benefits: [],
    workMode: "hybrid",
    probationPeriod: "6",
    joiningBonus: "",
    additionalNotes: "",
    sendWelcomeEmail: true,
    scheduleOrientation: true,
    createEmployeeProfiles: true
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#17487f]"></div>
          <p className="mt-4 text-gray-600">Loading shortlisted candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Bulk Hire Candidates - Hire Multiple Candidates | Overseas.ai</title>
        <meta name="description" content="Efficiently hire multiple shortlisted candidates at once with bulk hire functionality." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold textBlue mb-2">
              <i className="fa fa-users mr-3"></i>
              Bulk Hire Candidates
            </h1>
            <p className="text-gray-600">
              Hire multiple shortlisted candidates efficiently
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={() => router.push("/view-candidate-application-list")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Applications
            </button>
            <button
              onClick={() => router.push("/hra-dashboard")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-dashboard mr-2"></i>
              Dashboard
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-8">
            {[
              { step: 1, title: "Select Candidates", icon: "fa-users" },
              { step: 2, title: "Configure Details", icon: "fa-cogs" },
              { step: 3, title: "Review & Hire", icon: "fa-check" }
            ].map(({ step, title, icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step ? 'bg-[#17487f] text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  <i className={`fa ${icon}`}></i>
                </div>
                <span className={`ml-3 font-medium ${
                  currentStep >= step ? 'text-[#17487f]' : 'text-gray-500'
                }`}>
                  {title}
                </span>
                {step < 3 && <i className="fa fa-arrow-right text-gray-300 ml-8"></i>}
              </div>
            ))}
          </div>
        </div>

        {currentStep === 1 && (
          <>
            {/* Step 1: Select Candidates */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold textBlue">
                  Step 1: Select Candidates ({selectedCandidates.length} selected)
                </h2>
                
                <div className="flex space-x-3">
                  <div className="relative">
                    <i className="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Search candidates..."
                    />
                  </div>
                  
                  <button
                    onClick={handleSelectAll}
                    className="border border-gray-300 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <i className="fa fa-check-square mr-2"></i>
                    {selectedCandidates.length === filteredCandidates.length ? "Deselect All" : "Select All"}
                  </button>
                </div>
              </div>

              {filteredCandidates.length === 0 ? (
                <div className="text-center py-12">
                  <i className="fa fa-users text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Shortlisted Candidates</h3>
                  <p className="text-gray-500">There are no shortlisted candidates available for bulk hire.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCandidates.map((candidate) => (
                    <div
                      key={candidate.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedCandidates.some(c => c.id === candidate.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleCandidateSelect(candidate)}
                    >
                      <div className="flex items-start space-x-4">
                        <input
                          type="checkbox"
                          checked={selectedCandidates.some(c => c.id === candidate.id)}
                          onChange={() => handleCandidateSelect(candidate)}
                          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        
                        <div className="flex-shrink-0">
                          <img
                            src={candidate.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidateName)}&background=random`}
                            alt={candidate.candidateName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold textBlue">{candidate.candidateName}</h3>
                            {getRatingStars(candidate.rating)}
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <div><i className="fa fa-envelope mr-2"></i>{candidate.email}</div>
                            <div><i className="fa fa-map-marker mr-2"></i>{candidate.currentLocation}</div>
                            <div><i className="fa fa-briefcase mr-2"></i>{candidate.experience} experience</div>
                            <div><i className="fa fa-money mr-2"></i>{candidate.currency} {candidate.expectedSalary}</div>
                          </div>
                          
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {candidate.skills.slice(0, 3).map((skill, index) => (
                                <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {candidate.skills.length > 3 && (
                                <span className="text-gray-500 text-xs">+{candidate.skills.length - 3} more</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={selectedCandidates.length === 0}
                className="bg-[#17487f] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Continue to Configure Details
                <i className="fa fa-arrow-right ml-2"></i>
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Step 2: Configure Hire Details */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold textBlue mb-6">
                Step 2: Configure Hire Details
              </h2>

              <Formik
                initialValues={initialValues}
                validationSchema={bulkHireValidationSchema}
                onSubmit={(values) => {
                  setCurrentStep(3);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="jobTitle"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter job title"
                        />
                        <ErrorMessage name="jobTitle" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Location <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="jobLocation"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter job location"
                        />
                        <ErrorMessage name="jobLocation" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contract Type <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="contractType"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="permanent">Permanent</option>
                          <option value="contract">Contract</option>
                          <option value="temporary">Temporary</option>
                        </Field>
                        <ErrorMessage name="contractType" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="startDate"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="startDate" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Salary Offered <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="salaryOffered"
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter salary amount"
                        />
                        <ErrorMessage name="salaryOffered" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Currency <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="currency"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {currencies.map((currency) => (
                            <option key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="currency" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Work Mode <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="workMode"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="onsite">On-site</option>
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                        </Field>
                        <ErrorMessage name="workMode" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Probation Period (months) <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="probationPeriod"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="3">3 months</option>
                          <option value="6">6 months</option>
                          <option value="12">12 months</option>
                        </Field>
                        <ErrorMessage name="probationPeriod" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Joining Bonus (Optional)
                        </label>
                        <Field
                          name="joiningBonus"
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter joining bonus amount"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Benefits & Perks
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-4">
                        {availableBenefits.map((benefit) => (
                          <label key={benefit} className="flex items-center text-sm">
                            <input
                              type="checkbox"
                              checked={values.benefits.includes(benefit)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setFieldValue("benefits", [...values.benefits, benefit]);
                                } else {
                                  setFieldValue("benefits", values.benefits.filter(b => b !== benefit));
                                }
                              }}
                              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            {benefit}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Notes
                      </label>
                      <Field
                        name="additionalNotes"
                        as="textarea"
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter any additional notes or instructions..."
                      />
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Automation Settings</h3>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <Field
                            name="sendWelcomeEmail"
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Send welcome email to hired candidates</span>
                        </label>
                        
                        <label className="flex items-center">
                          <Field
                            name="scheduleOrientation"
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Schedule orientation sessions</span>
                        </label>
                        
                        <label className="flex items-center">
                          <Field
                            name="createEmployeeProfiles"
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Create employee profiles in system</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <i className="fa fa-arrow-left mr-2"></i>
                        Back to Selection
                      </button>
                      
                      <button
                        type="submit"
                        className="bg-[#17487f] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                      >
                        Review & Confirm
                        <i className="fa fa-arrow-right ml-2"></i>
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            {/* Step 3: Review & Confirm */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-xl font-semibold textBlue mb-6">
                Step 3: Review & Confirm Bulk Hire
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Selected Candidates */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Selected Candidates ({selectedCandidates.length})
                  </h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedCandidates.map((candidate) => (
                      <div key={candidate.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                        <img
                          src={candidate.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.candidateName)}&background=random`}
                          alt={candidate.candidateName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium textBlue">{candidate.candidateName}</p>
                          <p className="text-sm text-gray-600">{candidate.email}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{candidate.currency} {candidate.expectedSalary}</p>
                          <p className="text-xs text-gray-500">{candidate.experience} exp</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hire Details Summary */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Hire Details Summary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Title:</span>
                      <span className="font-medium">Senior Software Engineer</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">Dubai, UAE</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contract Type:</span>
                      <span className="font-medium">Permanent</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Work Mode:</span>
                      <span className="font-medium">Hybrid</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Probation:</span>
                      <span className="font-medium">6 months</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      <i className="fa fa-info-circle mr-2"></i>
                      What happens next?
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Offer letters will be sent to all selected candidates</li>
                      <li>• Welcome emails will be automatically sent</li>
                      <li>• Orientation sessions will be scheduled</li>
                      <li>• Employee profiles will be created in the system</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep(2)}
                className="border border-gray-300 text-gray-600 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <i className="fa fa-arrow-left mr-2"></i>
                Back to Configure
              </button>
              
              <button
                onClick={() => handleBulkHire(initialValues)}
                disabled={isProcessing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fa fa-check mr-2"></i>
                    Confirm Bulk Hire
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
