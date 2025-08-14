"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";

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
      if (!token) {
        router.push("/login");
        return;
      }

      // Mock job data - replace with actual API call
      const mockJobData: JobData = {
        id: jobId,
        title: "Senior Software Engineer",
        department: "Engineering",
        location: "Dubai, UAE",
        workMode: "hybrid",
        employmentType: "full-time",
        experienceLevel: "senior",
        salaryMin: "15000",
        salaryMax: "25000",
        currency: "AED",
        description: `We are looking for an experienced Senior Software Engineer to join our dynamic engineering team. You will be responsible for designing, developing, and maintaining high-quality software solutions that serve millions of users globally.

As a Senior Software Engineer, you will work closely with cross-functional teams including Product, Design, and DevOps to deliver exceptional user experiences. You'll mentor junior developers, participate in architectural decisions, and drive technical excellence across our engineering organization.

This is an excellent opportunity for a passionate technologist who wants to make a significant impact in a fast-growing company while working with cutting-edge technologies.`,
        requirements: [
          "Bachelor's degree in Computer Science or related field",
          "5+ years of professional software development experience",
          "Strong proficiency in JavaScript, TypeScript, and React",
          "Experience with Node.js and backend development",
          "Familiarity with cloud platforms (AWS, Azure, or GCP)",
          "Experience with database design and optimization",
          "Strong problem-solving and analytical skills",
          "Excellent communication and teamwork skills"
        ],
        responsibilities: [
          "Design and develop scalable web applications and APIs",
          "Collaborate with product managers and designers to implement features",
          "Write clean, maintainable, and well-tested code",
          "Participate in code reviews and provide constructive feedback",
          "Mentor junior developers and help them grow their skills",
          "Participate in architectural discussions and technical planning",
          "Troubleshoot and debug complex technical issues",
          "Stay up-to-date with emerging technologies and industry best practices"
        ],
        skillsRequired: ["JavaScript", "TypeScript", "React", "Node.js", "AWS", "MongoDB"],
        skillsPreferred: ["GraphQL", "Docker", "Kubernetes", "Redis", "PostgreSQL", "Jest"],
        benefits: [
          "Health Insurance", "Dental Insurance", "Paid Time Off", "Performance Bonus",
          "Stock Options", "Professional Development", "Flexible Working Hours", "Remote Work Option"
        ],
        applicationDeadline: "2025-01-15",
        startDate: "2025-02-01",
        numberOfPositions: "2",
        reportingTo: "Engineering Manager",
        educationLevel: "Bachelor's Degree",
        certifications: ["AWS Certified Developer", "React Advanced Certification"],
        languageRequirements: ["English (Fluent)", "Arabic (Preferred)"],
        travelRequirement: "Minimal (0-10%)",
        companyDescription: "We are a leading technology company focused on innovative solutions that transform industries. Our team is passionate about creating products that make a real difference in people's lives.",
        applicationInstructions: "Please submit your resume, cover letter, and portfolio. Include links to your GitHub profile and any relevant projects you've worked on.",
        status: "active",
        featured: true,
        urgent: false,
        remoteWorkBenefits: ["Home Office Setup Allowance", "High-Speed Internet Reimbursement", "Co-working Space Access"],
        workingHours: "9:00 AM - 6:00 PM (Flexible)",
        probationPeriod: "6 months",
        noticePeriod: "1 month"
      };

      setJobData(mockJobData);
    } catch (error) {
      console.error("Error fetching job data:", error);
      toast.error("Failed to load job data");
      router.push("/hra-jobs");
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

      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));

      console.log("Updated job data:", values);

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
