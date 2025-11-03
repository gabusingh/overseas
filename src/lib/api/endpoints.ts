/**
 * Centralized API endpoints
 * All API URLs are defined here to avoid hardcoding across the application
 */

// Base API URL
export const BASE_URL = 'https://backend.overseas.ai/api/';

// Authentication endpoints
export const authEndpoints = {
  // Login
  passwordLogin: 'passsword-login',
  otpRequest: 'otp-request',
  otpLogin: 'otp-login',
  
  // Registration
  getOtp: 'get-otp',
  registerPersonStep1: 'register-person-step1',
  
  // Logout
  logout: 'logout-app',
  
  // Email OTP
  getEmailOtp: 'get-email-otp',
} as const;

// User profile endpoints
export const userEndpoints = {
  // Profile management
  completeProfileStep2: 'user-profile-complete-step2',
  completeProfileStep3: 'user-profile-complete-step3',
  editProfile: 'user-complete-profile-edit',
  getProfileStrength: 'user-improve-profile',
  getUserDashboard: 'user-dashboard-applied-datas',
  
  // Employee data
  getEmpData: 'get-emp-data',
  getEmpDataForEdit: 'get-emp-data-for-edit',
  
  // Experience management
  experienceList: 'experience-list',
  addExperience: 'add-experience',
  addExperienceStep2: 'add-experience-step2',
  editExperience: 'edit-experience',
  viewExperience: (id: number) => `view-experience/${id}`,
  pastExperienceList: 'past-experience-list',
  updatePastOccupation: 'update-past-occupation',
  
  // Documents
  passportUpload: 'passport-upload',
  passportView: 'passport-view',
  passportEdit: 'passport-edit',
  uploadPassport: 'upload-passport',
  uploadCv: 'upload-cv-by-user',
  uploadCovid: 'upload-covid-by-user',
  uploadDrivingLicense: 'upload-dl-by-user',
  uploadEduCertificate: 'upload-edu-certificate-by-user',
  uploadOtherDocs: 'upload-other-docs-by-user',
  editDrivingLicense: 'edit-dl-by-user',
  getAllDocs: 'get-all-docs-by-user',
  viewPassport: 'view-passport',
  
  // Work video
  storeWorkVideo: 'store-work-video',
  getSummarizedVideo: 'get-summarized-video',
  
  // Location and tracking
  storeLocation: 'store-location',
  storeAppUseTime: 'store-app-use-time',
  storeUserLocation: 'store-user-location',
  
  // Notifications
  getAllNotifications: 'user-all-notification',
  userAllNotifications: 'user-all-notification',
  
  // Resume operations
  updateResume: 'user-profile-complete-step2',
  updateResumeExperience: 'add-experience',
  updateResumeLicense: 'upload-dl-by-user',
  updatePassport: 'passport-upload',
  getResumeData: 'get-emp-data',
  
  // Loan and references
  submitLoan: 'need-migration-loan',
  addRegistrationSource: 'add-registration-source',
  checkServiceStatus: 'check-service-status',
} as const;

// Job-related endpoints
export const jobEndpoints = {
  // Job listing and filtering
  filterAllJobs: 'filter-all-jobs',
  searchAllJobs: 'search-all-jobs',
  getLatestJobs: 'get-latest-jobs',
  getLastWeekJobs: 'last-week-jobs',
  getJobs: 'get-jobs',
  getRelatedJobs: 'get-related-jobs',
  
  // Job details
  getJobById: (id: string | number) => `getJobs/${id}`,
  getJobsByDepartment: (id: number) => `occupation-wise-jobs/${id}`,
  getJobsByCountry: (id: number) => `country-wise-jobs/${id}`,
  getJobsByCountryByDepartment: 'get-jobs-by-country-by-department',
  jobsByDepartmentByCountry: 'jobs-by-department-by-country',
  
  // Job application
  applyJob: 'apply-job-r',
  appliedJobList: 'user-applied-job-list',
  appliedJobById: (id: number) => `user-applied-job-list/${id}`,
  interviewStatus: (id: number) => `interview-status-for-emp/${id}`,
  
  // Job favorites
  favoriteJobList: 'user-favourite-job-list',
  saveJob: 'save-job-by-user',
  savedJobList: 'user-saved-job-list',
  removeSavedJob: 'remove-saved-job',
  
  // Job query
  jobQuery: 'job-query',
  
  // Job statistics
  jobStatistics: 'job-statistics',
  
  // Occupations and skills
  getOccupations: 'get-occupations',
  getSkills: 'get-skills',
} as const;

// HR/Company endpoints
export const hrEndpoints = {
  // HR registration
  registerHra: 'register-hra',
  
  // HR data
  getHrData: 'get-hr-data',
  getHrDashboard: 'get-hr-dashboard',
  getHrDashboardAnalytics: 'get-hr-dashboard-analytics',
  getHraDashboardData: 'get-hr-dashboard',
  getJobsPostedByHra: (hrId: string) => `get-jobs-posted-by-hra/${hrId}`,
  getEnhancedHrDetails: 'get-enhanced-hr-details',
  
  // Company data
  getAllCompanies: 'get-all-companies',
  getCompanies: 'get-companies',
  getCompanyById: (id: number) => `company/${id}`,
  
  // HR job management
  createJob: 'create-job',
  updateJob: 'update-job',
  deleteJob: 'delete-job',
  getHrJobs: 'get-hr-jobs',
  
  // Candidate management
  getCandidateApplications: 'get-candidate-applications',
  updateApplicationStatus: 'update-application-status',
} as const;

// Institute endpoints
export const instituteEndpoints = {
  // Institute listing
  listTrainingInstitutes: 'list-training-institute',
  getInstituteById: (id: number) => `institute/${id}`,
  
  // Institute registration
  registerInstitute: 'register-institute',
  
  // Institute courses
  getInstituteCourses: (id: number) => `institute/${id}/courses`,
} as const;

// Course endpoints
export const courseEndpoints = {
  // Course listing
  getAllCourses: 'get-all-courses',
  getCourseById: (id: number) => `course/${id}`,
  getCoursesByInstitute: (instituteId: number) => `courses/institute/${instituteId}`,
  
  // Course application
  applyCourse: 'apply-course',
  getAppliedCourses: 'get-applied-courses',
  getCourseApplications: (courseId: number) => `course/${courseId}/applications`,
} as const;

// Language training endpoints
export const languageTrainingEndpoints = {
  getLanguageTraining: 'get-language-training',
  applyLanguageTraining: 'apply-language-training',
  getAppliedLanguageTraining: 'get-applied-language-training',
} as const;

// Resume endpoints
export const resumeEndpoints = {
  generateResume: 'generate-resume',
  downloadResume: 'download-resume',
  updateResume: 'update-resume',
} as const;

// Notification endpoints
export const notificationEndpoints = {
  getAllNotifications: 'get-all-notifications',
  markAsRead: 'mark-notification-read',
  deleteNotification: 'delete-notification',
} as const;

// Info/Static data endpoints
export const infoEndpoints = {
  // Countries and regions
  getCountries: 'get-countries',
  getCountriesForJobs: 'get-countries-for-jobs',
  getRegions: 'get-regions',
  
  // News and notifications
  getNewsFeed: 'get-news-feed',
  getSuccessNotifications: 'get-success-notifications',
  
  // Statistics
  getJobStats: 'get-job-stats',
  getCompanyStats: 'get-company-stats',
} as const;

// Contact and support endpoints
export const contactEndpoints = {
  contactUs: 'contact-us',
  submitFeedback: 'submit-feedback',
  reportIssue: 'report-issue',
} as const;

// Utility function to build full URLs
export const buildUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`;
};

// Export all endpoints for easy access
export const endpoints = {
  auth: authEndpoints,
  user: userEndpoints,
  jobs: jobEndpoints,
  hr: hrEndpoints,
  institute: instituteEndpoints,
  course: courseEndpoints,
  languageTraining: languageTrainingEndpoints,
  resume: resumeEndpoints,
  notification: notificationEndpoints,
  info: infoEndpoints,
  contact: contactEndpoints,
} as const;
