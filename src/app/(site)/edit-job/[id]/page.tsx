"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { getJobById } from "@/services/job.service";
import { editJob } from "@/services/hra.service";

interface JobData {
  id: string;
  title: string;
  department: string;
  location: string;
  workMode: "onsite" | "remote" | "hybrid";
  employmentType: "full-time" | "part-time" | "contract" | "temporary";
  experienceLevel: "entry" | "junior" | "mid" | "senior" | "executive";
  salaryMin: string;
  salaryMax: string;
  currency: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  skillsRequired: string[];
  skillsPreferred: string[];
  benefits: string[];
  applicationDeadline: string;
  startDate: string;
  numberOfPositions: string;
  reportingTo: string;
  educationLevel: string;
  certifications: string[];
  languageRequirements: string[];
  travelRequirement: string;
  companyDescription: string;
  applicationInstructions: string;
  status: "draft" | "active" | "paused" | "closed";
  featured: boolean;
  urgent: boolean;
  remoteWorkBenefits: string[];
  workingHours: string;
  probationPeriod: string;
  noticePeriod: string;
}

const editJobValidationSchema = Yup.object().shape({
  title: Yup.string().required("Job title is required").min(5, "Title must be at least 5 characters"),
  department: Yup.string().required("Department is required"),
  location: Yup.string().required("Location is required"),
  workMode: Yup.string().required("Work mode is required"),
  employmentType: Yup.string().required("Employment type is required"),
  experienceLevel: Yup.string().required("Experience level is required"),
  salaryMin: Yup.number().positive("Minimum salary must be positive").required("Minimum salary is required"),
  salaryMax: Yup.number()
    .positive("Maximum salary must be positive")
    .required("Maximum salary is required")
    .test("salary-range", "Maximum salary must be greater than minimum salary", function(value) {
      return value > this.parent.salaryMin;
    }),
  currency: Yup.string().required("Currency is required"),
  description: Yup.string().required("Job description is required").min(100, "Description must be at least 100 characters"),
  requirements: Yup.array().of(Yup.string()).min(1, "At least one requirement is needed"),
  responsibilities: Yup.array().of(Yup.string()).min(1, "At least one responsibility is needed"),
  skillsRequired: Yup.array().of(Yup.string()).min(1, "At least one required skill is needed"),
  applicationDeadline: Yup.date()
    .min(new Date(), "Application deadline must be in the future")
    .required("Application deadline is required"),
  numberOfPositions: Yup.number().positive("Number of positions must be positive").required("Number of positions is required"),
  reportingTo: Yup.string().required("Reporting manager is required"),
  educationLevel: Yup.string().required("Education level is required"),
});

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [jobData, setJobData] = useState<JobData | null>(null);

  const currencies = [
    { code: "AED", name: "UAE Dirham" },
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "QAR", name: "Qatari Riyal" },
    { code: "KWD", name: "Kuwaiti Dinar" },
    { code: "OMR", name: "Omani Riyal" },
    { code: "BHD", name: "Bahraini Dinar" }
  ];

  const departments = [
    "Engineering", "Product", "Design", "Marketing", "Sales", "Operations", 
    "Finance", "Human Resources", "Legal", "Customer Success", "Data & Analytics",
    "Security", "Quality Assurance", "DevOps", "Research & Development"
  ];

  const availableBenefits = [
    "Health Insurance", "Dental Insurance", "Vision Insurance", "Life Insurance",
    "Retirement Plan (401k)", "Paid Time Off", "Sick Leave", "Maternity/Paternity Leave",
    "Performance Bonus", "Stock Options", "Flexible Working Hours", "Remote Work Option",
    "Professional Development", "Gym Membership", "Transportation Allowance",
    "Meal Allowance", "Phone/Internet Allowance", "Annual Flight Tickets",
    "Education Reimbursement", "Wellness Programs"
  ];

  const commonSkills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "Java", "C#", "PHP",
    "Angular", "Vue.js", "MongoDB", "PostgreSQL", "MySQL", "AWS", "Docker", "Kubernetes",
    "Git", "REST APIs", "GraphQL", "HTML/CSS", "Sass/SCSS", "Webpack", "Jest",
    "Cypress", "Selenium", "Agile/Scrum", "DevOps", "CI/CD", "Linux", "Redis"
  ];

  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const loggedUser = localStorage.getItem("loggedUser");
      
      console.log('🔍 DEBUG - Edit Job Authentication:');
      console.log('- Token exists:', !!token);
      console.log('- LoggedUser exists:', !!loggedUser);
      console.log('- Job ID:', jobId);
      
      if (!token) {
        console.error('❌ No access token found, redirecting to login');
        toast.error('Please log in to edit jobs');
        router.push("/login");
        return;
      }
      
      if (loggedUser) {
        const userData = JSON.parse(loggedUser);
        console.log('📋 DEBUG - User data for edit job:', {
          userType: userData?.user?.type || userData?.type,
          hasUser: !!userData?.user,
          hasCmpData: !!userData?.cmpData,
          userId: userData?.user?.id || userData?.id,
          hrId: userData?.user?.id || userData?.cmpData?.id || userData?.id || userData?.hrId || userData?.empId
        });
        
        // Verify this is a company user
        const userType = userData?.user?.type || userData?.type;
        if (userType !== 'company') {
          console.error('❌ Access denied - user is not a company type:', userType);
          toast.error('Access denied. You must be logged in as an HR user to edit jobs.');
          router.push('/login');
          return;
        }
      }

      // Fetch actual job data from API with timeout
      console.log('🚀 Fetching job data for ID:', jobId);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout - API took too long to respond')), 30000)
      );
      
      const response: any = await Promise.race([
        getJobById(jobId),
        timeoutPromise
      ]);
      
      console.log('📊 API Response received:', {
        hasResponse: !!response,
        hasData: !!response?.data,
        responseStructure: Object.keys(response || {}),
        dataStructure: response?.data ? Object.keys(response.data) : 'No data field'
      });
      
      // Handle different response structures - be more strict about data validation
      let jobApiData;
      if (response?.data?.jobs) {
        jobApiData = response.data.jobs;
        console.log('✓ Using response.data.jobs');
      } else if (response?.data && typeof response.data === 'object') {
        jobApiData = response.data;
        console.log('✓ Using response.data');
      } else if (response?.jobs) {
        jobApiData = response.jobs;
        console.log('✓ Using response.jobs');
      } else if (response && typeof response === 'object') {
        jobApiData = response;
        console.log('✓ Using response directly');
      } else {
        throw new Error('Invalid API response structure - no job data found');
      }
      
      console.log('📋 Raw job API data:', jobApiData);
      
      // Strict validation - no fallback data allowed
      if (!jobApiData || typeof jobApiData !== 'object') {
        throw new Error('Job data is null, undefined, or not an object');
      }
      
      if (!jobApiData.id && !jobApiData.jobID) {
        throw new Error(`Job not found - no valid ID in response. Available fields: ${Object.keys(jobApiData).join(', ')}`);
      }
      
      // Transform API response to match JobData interface - validate required fields
      const transformedJobId = jobApiData.id || jobApiData.jobID;
      const jobTitle = jobApiData.jobTitle || jobApiData.job_title || jobApiData.title;
      
      console.log('🔍 Critical job fields:', {
        id: transformedJobId,
        title: jobTitle,
        department: jobApiData.jobOccupation || jobApiData.department,
        location: jobApiData.jobLocationCountry?.name || jobApiData.location || jobApiData.jobLocation,
        description: jobApiData.jobDescription || jobApiData.description,
        wages: jobApiData.jobWages,
        currency: jobApiData.jobWagesCurrencyType,
        deadline: jobApiData.jobDeadline
      });
      
      if (!jobTitle) {
        throw new Error('Job title is missing from API response - cannot edit job without title');
      }
      
      const transformedJobData: JobData = {
        id: transformedJobId.toString(),
        title: jobTitle,
        department: jobApiData.jobOccupation || jobApiData.department || "",
        location: jobApiData.jobLocationCountry?.name || jobApiData.location || jobApiData.jobLocation || "",
        workMode: jobApiData.jobMode === "onsite" ? "onsite" : jobApiData.jobMode === "remote" ? "remote" : "hybrid",
        employmentType: jobApiData.employmentType || "full-time",
        experienceLevel: jobApiData.jobExpTypeReq || jobApiData.experienceLevel || "mid",
        salaryMin: jobApiData.jobWages ? jobApiData.jobWages.toString() : (jobApiData.salaryMin ? jobApiData.salaryMin.toString() : "0"),
        salaryMax: jobApiData.salaryMax ? jobApiData.salaryMax.toString() : (jobApiData.jobWages ? (parseFloat(jobApiData.jobWages.toString()) * 1.2).toString() : "0"),
        currency: jobApiData.jobWagesCurrencyType || jobApiData.currency || "USD",
        description: jobApiData.jobDescription || jobApiData.description || "",
        requirements: Array.isArray(jobApiData.requirements) ? jobApiData.requirements : [],
        responsibilities: Array.isArray(jobApiData.responsibilities) ? jobApiData.responsibilities : [],
        skillsRequired: jobApiData.skills ? (Array.isArray(jobApiData.skills) ? jobApiData.skills.map((skill: any) => typeof skill === 'string' ? skill : (skill.skill || skill.name || String(skill))) : []) : [],
        skillsPreferred: Array.isArray(jobApiData.skillsPreferred) ? jobApiData.skillsPreferred : [],
        benefits: Array.isArray(jobApiData.benefits) ? jobApiData.benefits : [],
        applicationDeadline: jobApiData.jobDeadline ? new Date(jobApiData.jobDeadline).toISOString().split('T')[0] : (jobApiData.applicationDeadline || ""),
        startDate: jobApiData.startDate || "",
        numberOfPositions: (jobApiData.jobVacancyNo || jobApiData.numberOfPositions || "1").toString(),
        reportingTo: jobApiData.reportingTo || "",
        educationLevel: jobApiData.educationLevel || "",
        certifications: Array.isArray(jobApiData.certifications) ? jobApiData.certifications : [],
        languageRequirements: Array.isArray(jobApiData.languageRequirements) ? jobApiData.languageRequirements : [],
        travelRequirement: jobApiData.travelRequirement || "None",
        companyDescription: jobApiData.companyDescription || "",
        applicationInstructions: jobApiData.applicationInstructions || "",
        status: (jobApiData.status || "active") as JobData['status'],
        featured: Boolean(jobApiData.featured),
        urgent: Boolean(jobApiData.urgent),
        remoteWorkBenefits: Array.isArray(jobApiData.remoteWorkBenefits) ? jobApiData.remoteWorkBenefits : [],
        workingHours: jobApiData.jobWorkingHour || jobApiData.workingHours || "",
        probationPeriod: jobApiData.probationPeriod || "3 months",
        noticePeriod: jobApiData.noticePeriod || ""
      };
      
      console.log('✅ Successfully transformed job data:', {
        id: transformedJobData.id,
        title: transformedJobData.title,
        department: transformedJobData.department,
        location: transformedJobData.location,
        hasDescription: !!transformedJobData.description,
        skillsCount: transformedJobData.skillsRequired.length,
        benefitsCount: transformedJobData.benefits.length
      });

      setJobData(transformedJobData);
      console.log('✅ Job data loaded successfully');
      
    } catch (error: any) {
      console.error("❌ Error fetching job data:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred';
      
      // Determine the type of error and show appropriate message
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
      
      // DO NOT create fallback data - redirect user instead
      console.log('❌ Cannot load job data - redirecting to jobs list');
      setTimeout(() => {
        router.push('/hra-jobs');
      }, 3000);
      
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: JobData) => {
    setSaving(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Convert form data to FormData format expected by the API
      const formData = new FormData();
      formData.append('jobTitle', values.title);
      formData.append('department', values.department);
      formData.append('location', values.location);
      formData.append('jobMode', values.workMode);
      formData.append('employmentType', values.employmentType);
      formData.append('experienceLevel', values.experienceLevel);
      formData.append('salaryMin', values.salaryMin);
      formData.append('salaryMax', values.salaryMax);
      formData.append('currency', values.currency);
      formData.append('jobDescription', values.description);
      formData.append('numberOfPositions', values.numberOfPositions);
      formData.append('reportingTo', values.reportingTo);
      formData.append('educationLevel', values.educationLevel);
      formData.append('applicationDeadline', values.applicationDeadline);
      formData.append('startDate', values.startDate);
      formData.append('status', values.status);
      formData.append('featured', values.featured.toString());
      formData.append('urgent', values.urgent.toString());
      formData.append('workingHours', values.workingHours);
      formData.append('probationPeriod', values.probationPeriod);
      formData.append('noticePeriod', values.noticePeriod);
      formData.append('travelRequirement', values.travelRequirement);
      formData.append('companyDescription', values.companyDescription);
      formData.append('applicationInstructions', values.applicationInstructions);
      
      // Append arrays as JSON strings or individual items
      formData.append('requirements', JSON.stringify(values.requirements));
      formData.append('responsibilities', JSON.stringify(values.responsibilities));
      formData.append('skillsRequired', JSON.stringify(values.skillsRequired));
      formData.append('skillsPreferred', JSON.stringify(values.skillsPreferred));
      formData.append('benefits', JSON.stringify(values.benefits));
      formData.append('certifications', JSON.stringify(values.certifications));
      formData.append('languageRequirements', JSON.stringify(values.languageRequirements));
      formData.append('remoteWorkBenefits', JSON.stringify(values.remoteWorkBenefits));

      // Call the actual API
      await editJob(parseInt(values.id), formData, token);

      toast.success("Job updated successfully!");
      router.push("/hra-jobs");
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateJob = async () => {
    if (!jobData) return;

    try {
      // Create a duplicate with modified title
      const duplicateJob = {
        ...jobData,
        id: `${jobData.id}_copy`,
        title: `${jobData.title} (Copy)`,
        status: "draft" as const
      };

      toast.success("Job duplicated successfully! Redirecting to edit the copy...");
      
      // In real implementation, create new job and redirect to its edit page
      setTimeout(() => {
        router.push(`/edit-job/${duplicateJob.id}`);
      }, 1000);
    } catch (error) {
      console.error("Error duplicating job:", error);
      toast.error("Failed to duplicate job");
    }
  };

  const handleDeleteJob = async () => {
    if (!confirm("Are you sure you want to delete this job posting? This action cannot be undone.")) {
      return;
    }

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Job deleted successfully!");
      router.push("/hra-jobs");
    } catch (error) {
      console.error("Error deleting job:", error);
      toast.error("Failed to delete job");
    }
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

  if (!jobData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="fa fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're trying to edit could not be found.</p>
          <button
            onClick={() => router.push("/hra-jobs")}
            className="bg-[#17487f] text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Edit Job - {jobData.title} | Overseas.ai</title>
        <meta name="description" content={`Edit job posting for ${jobData.title} position`} />
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold textBlue mb-2">
              <i className="fa fa-edit mr-3"></i>
              Edit Job Posting
            </h1>
            <p className="text-gray-600">
              Update and manage your job posting: <span className="font-semibold">{jobData.title}</span>
            </p>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={handleDuplicateJob}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-copy mr-2"></i>
              Duplicate
            </button>
            <button
              onClick={handleDeleteJob}
              className="border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <i className="fa fa-trash mr-2"></i>
              Delete
            </button>
            <button
              onClick={() => router.push("/hra-jobs")}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <i className="fa fa-arrow-left mr-2"></i>
              Back to Jobs
            </button>
          </div>
        </div>

        <Formik
          initialValues={jobData}
          validationSchema={editJobValidationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isValid }) => (
            <Form>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Form */}
                <div className="lg:col-span-2 space-y-8">
                  
                  {/* Basic Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Job Title <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="title"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Senior Software Engineer"
                        />
                        <ErrorMessage name="title" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Department <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="department"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Department</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </Field>
                        <ErrorMessage name="department" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="location"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Dubai, UAE"
                        />
                        <ErrorMessage name="location" component="div" className="text-red-500 text-sm mt-1" />
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
                          Employment Type <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="employmentType"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="contract">Contract</option>
                          <option value="temporary">Temporary</option>
                        </Field>
                        <ErrorMessage name="employmentType" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Experience Level <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="experienceLevel"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="entry">Entry Level</option>
                          <option value="junior">Junior</option>
                          <option value="mid">Mid-level</option>
                          <option value="senior">Senior</option>
                          <option value="executive">Executive</option>
                        </Field>
                        <ErrorMessage name="experienceLevel" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Positions <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="numberOfPositions"
                          type="number"
                          min="1"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="numberOfPositions" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reporting To <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="reportingTo"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. Engineering Manager"
                        />
                        <ErrorMessage name="reportingTo" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Salary Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Salary & Benefits</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Salary <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="salaryMin"
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="15000"
                        />
                        <ErrorMessage name="salaryMin" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Salary <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="salaryMax"
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="25000"
                        />
                        <ErrorMessage name="salaryMax" component="div" className="text-red-500 text-sm mt-1" />
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
                          {currencies.map(currency => (
                            <option key={currency.code} value={currency.code}>
                              {currency.code} - {currency.name}
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="currency" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks</label>
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
                  </div>

                  {/* Job Description */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Job Description</h2>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <Field
                        name="description"
                        as="textarea"
                        rows={8}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                      />
                      <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
                      <p className="text-xs text-gray-500 mt-1">
                        {values.description.length} characters (minimum 100 required)
                      </p>
                    </div>
                  </div>

                  {/* Requirements & Responsibilities */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Requirements & Responsibilities</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Requirements <span className="text-red-500">*</span>
                        </label>
                        <FieldArray name="requirements">
                          {({ push, remove }) => (
                            <div className="space-y-2">
                              {values.requirements.map((_, index) => (
                                <div key={index} className="flex space-x-2">
                                  <Field
                                    name={`requirements.${index}`}
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter requirement..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-800 px-2"
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push("")}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <i className="fa fa-plus mr-1"></i>Add Requirement
                              </button>
                            </div>
                          )}
                        </FieldArray>
                        <ErrorMessage name="requirements" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Responsibilities <span className="text-red-500">*</span>
                        </label>
                        <FieldArray name="responsibilities">
                          {({ push, remove }) => (
                            <div className="space-y-2">
                              {values.responsibilities.map((_, index) => (
                                <div key={index} className="flex space-x-2">
                                  <Field
                                    name={`responsibilities.${index}`}
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter responsibility..."
                                  />
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="text-red-600 hover:text-red-800 px-2"
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              ))}
                              <button
                                type="button"
                                onClick={() => push("")}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <i className="fa fa-plus mr-1"></i>Add Responsibility
                              </button>
                            </div>
                          )}
                        </FieldArray>
                        <ErrorMessage name="responsibilities" component="div" className="text-red-500 text-sm mt-1" />
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Skills</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Required Skills <span className="text-red-500">*</span>
                        </label>
                        <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {commonSkills.map(skill => (
                              <label key={skill} className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={values.skillsRequired.includes(skill)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFieldValue("skillsRequired", [...values.skillsRequired, skill]);
                                    } else {
                                      setFieldValue("skillsRequired", values.skillsRequired.filter(s => s !== skill));
                                    }
                                  }}
                                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                {skill}
                              </label>
                            ))}
                          </div>
                        </div>
                        <ErrorMessage name="skillsRequired" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Skills
                        </label>
                        <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                          <div className="grid grid-cols-2 gap-2">
                            {commonSkills.map(skill => (
                              <label key={skill} className="flex items-center text-sm">
                                <input
                                  type="checkbox"
                                  checked={values.skillsPreferred.includes(skill)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFieldValue("skillsPreferred", [...values.skillsPreferred, skill]);
                                    } else {
                                      setFieldValue("skillsPreferred", values.skillsPreferred.filter(s => s !== skill));
                                    }
                                  }}
                                  className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                {skill}
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Additional Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Education Level <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="educationLevel"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Education Level</option>
                          <option value="High School">High School</option>
                          <option value="Associate Degree">Associate Degree</option>
                          <option value="Bachelor's Degree">Bachelor's Degree</option>
                          <option value="Master's Degree">Master's Degree</option>
                          <option value="PhD">PhD</option>
                          <option value="Professional Certification">Professional Certification</option>
                        </Field>
                        <ErrorMessage name="educationLevel" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Travel Requirement
                        </label>
                        <Field
                          name="travelRequirement"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="None">No Travel Required</option>
                          <option value="Minimal (0-10%)">Minimal (0-10%)</option>
                          <option value="Occasional (10-25%)">Occasional (10-25%)</option>
                          <option value="Frequent (25-50%)">Frequent (25-50%)</option>
                          <option value="Extensive (50%+)">Extensive (50%+)</option>
                        </Field>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working Hours
                        </label>
                        <Field
                          name="workingHours"
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 9:00 AM - 6:00 PM (Flexible)"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Probation Period
                        </label>
                        <Field
                          name="probationPeriod"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="3 months">3 months</option>
                          <option value="6 months">6 months</option>
                          <option value="12 months">12 months</option>
                          <option value="No probation">No probation period</option>
                        </Field>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Application Deadline <span className="text-red-500">*</span>
                        </label>
                        <Field
                          name="applicationDeadline"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <ErrorMessage name="applicationDeadline" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date
                        </label>
                        <Field
                          name="startDate"
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Status & Settings */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Settings</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <Field
                          name="status"
                          as="select"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="closed">Closed</option>
                        </Field>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center">
                          <Field
                            name="featured"
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Featured Job</span>
                        </label>
                        
                        <label className="flex items-center">
                          <Field
                            name="urgent"
                            type="checkbox"
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Urgent Hiring</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Job Actions */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>
                    
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() => router.push(`/view-candidate-application-list?jobId=${jobId}`)}
                        className="w-full text-left px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <i className="fa fa-users mr-2"></i>
                        View Applications
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => router.push(`/recommended-candidates?jobId=${jobId}`)}
                        className="w-full text-left px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <i className="fa fa-magic mr-2"></i>
                        AI Recommendations
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => router.push(`/bulk-hire?jobId=${jobId}`)}
                        className="w-full text-left px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      >
                        <i className="fa fa-users mr-2"></i>
                        Bulk Hire
                      </button>
                    </div>
                  </div>

                  {/* Save Actions */}
                  <div className="bg-white rounded-lg shadow-sm border p-6">
                    <div className="space-y-3">
                      <button
                        type="submit"
                        disabled={!isValid || saving}
                        className="w-full bg-[#17487f] text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-save mr-2"></i>
                            Update Job
                          </>
                        )}
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => router.push("/hra-jobs")}
                        className="w-full border border-gray-300 text-gray-600 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
}
