/**
 * Shared TypeScript types for API requests and responses
 * Centralized type definitions to ensure consistency across the application
 */

// Base API response wrapper
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
  status?: number;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  per_page: number;
  from: number;
  to: number;
}

// User types
export interface User {
  id: number;
  type: 'person' | 'company' | 'institute';
  email: string;
  phone: string;
  name?: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface UserWithToken {
  user: User;
  access_token: string;
}

// Authentication types
export interface LoginRequest {
  empPhone: string;
  password: string;
}

export interface OtpRequest {
  empPhone: string;
}

export interface OtpLoginRequest {
  empPhone: string;
  otp: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  type: 'person' | 'company' | 'institute';
}

// Job types
export interface Job {
  id: number;
  jobID: string;
  jobTitle: string;
  jobVacancyNo: string;
  jobOccupation: string;
  jobOccupation_hi?: string;
  jobOccupation_bn?: string;
  jobMode: string;
  jobWorkingDay: string;
  jobWages?: number;
  jobWagesCurrencyType?: string;
  jobLocationCountry?: {
    id: number;
    name: string;
    countryFlag: string;
    currencyName: string;
    currencySymbol: string;
  };
  jobPhoto?: string;
  jobDeadline?: string;
  jobExpTypeReq?: string;
  jobAgeLimit?: string;
  passportType?: string;
  jobDescription?: string;
  jobAccommodation?: string;
  jobFood?: string;
  jobOvertime?: string;
  jobWorkingHour?: string;
  companyName?: string;
  // Additional properties for compatibility
  job_title?: string;
  title?: string;
  company_name?: string;
  company?: string;
  location?: string;
  jobLocation?: string;
  country?: string;
  salary?: number;
  currency?: string;
  saved_date?: string;
  savedDate?: string;
  created_at?: string;
  jobType?: string;
  job_type?: string;
  employmentType?: string;
  deadline?: string;
  occupation?: string;
  cmpName?: string;
  skills?: Array<{
    id: number;
    skill: string;
  }>;
  created_at: string;
  appliedStatus?: boolean;
  isWishListed?: boolean;
  totalAppliedCandidates?: number;
  contract_period?: string;
  required_documents?: string[];
  jobPublishedDate?: string;
  salary_negotiable?: boolean;
}

export interface JobFilters {
  search?: string;
  country?: number;
  department?: number;
  occupation?: number;
  salary_min?: number;
  salary_max?: number;
  experience?: string;
  page?: number;
  per_page?: number;
}

export interface JobApplication {
  id: number;
  jobId: number;
  userId: number;
  status: 'pending' | 'accepted' | 'rejected' | 'interview_scheduled';
  applied_at: string;
  interview_date?: string;
  interview_location?: string;
  // Additional properties for compatibility
  jobTitle?: string;
  title?: string;
  companyName?: string;
  company?: string;
  applicationStatus?: string;
  jobLocationCountry?: {
    name: string;
  };
  location?: string;
  jobWages?: number;
  jobWagesCurrencyType?: string;
  givenCurrencyValue?: number;
  appliedOn?: string;
  appliedDate?: string;
  created_at?: string;
  jobDeadline?: string;
  occupation?: string;
  contractPeriod?: string;
}

// HR/Company types
export interface HrDetails {
  id: number;
  empId: string;
  empName: string;
  empPhoto?: string;
  empEmail: string;
  empMobile: string;
  empDob?: string;
  empGender?: string;
  empMaritalStatus?: string;
  empAddress?: string;
  empState?: string;
  empDistrict?: string;
  empPincode?: string;
  empExperience?: string;
  empOccupation?: string;
  empSkills?: string;
  empEducation?: string;
  empLanguages?: string;
  empStatus?: string;
  created_at: string;
  updated_at: string;
  cmpData?: {
    id: number;
    cmpName: string;
    cmpLogoS3?: string;
    cmpDescription?: string;
    cmpEmail?: string;
    cmpPhone?: string;
    cmpAddress?: string;
    cmpWebsite?: string;
    cmpIndustry?: string;
    cmpSize?: string;
    cmpFoundedYear?: string;
    cmpGstNumber?: string;
    cmpPanNumber?: string;
    cmpRegistrationNumber?: string;
    activeState?: string;
    created_at?: string;
    updated_at?: string;
  };
  user?: User;
}

export interface HrDashboardData {
  totalPostedJobs: number;
  totalAppliedCandidates: number;
  totalPostedBulkHiring: number;
  recentApplications?: Array<{
    candidateName: string;
    jobTitle: string;
    appliedOn: string;
    status: string;
  }>;
  latestPostedJobs?: Array<{
    id: number;
    jobID: string;
    jobTitle: string;
    jobVacancyNo: string;
    jobDeadline: string;
    jobWages: string;
    country_location: string;
    occupation: string;
    jobAgeLimit: string;
    passportType: string;
    jobExpTypeReq: string;
    totalAppliedCandidates: number;
    created_at: string;
    jobPhoto: string;
    jobLocationCountry: {
      id: number;
      name: string;
      currencyName: string;
      currencySymbol: string;
      countryFlag: string;
    };
  }>;
  latestAppliedCandidates?: Array<{
    id: number;
    empName: string;
    empPhoto: string;
    empDob: string;
    age: number;
    appliedOn: string;
    empState: string;
    empDistrict: string;
  }>;
}

export interface Company {
  id: number;
  cmpName: string;
  cmpLogoS3?: string;
  cmpDescription?: string;
  cmpEmail?: string;
  cmpPhone?: string;
  cmpAddress?: string;
  cmpWebsite?: string;
  cmpIndustry?: string;
  cmpSize?: string;
  jobCount?: number;
  created_at: string;
  updated_at: string;
}

// Institute types
export interface Institute {
  id: number;
  name: string;
  description?: string;
  logo?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  established_year?: string;
  courses_count?: number;
  instituteName?: string;
  created_at: string;
  updated_at: string;
}

// Course types
export interface Course {
  id: number;
  title: string;
  description?: string;
  duration?: string;
  fee?: number;
  currency?: string;
  institute_id: number;
  institute_name?: string;
  institute_logo?: string;
  start_date?: string;
  end_date?: string;
  application_deadline?: string;
  requirements?: string[];
  syllabus?: string;
  created_at: string;
  updated_at: string;
}

// Experience types
export interface Experience {
  id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date?: string;
  current_job: boolean;
  description?: string;
  location?: string;
  salary?: number;
  currency?: string;
  created_at: string;
  updated_at: string;
}

// Document types
export interface Document {
  id: number;
  type: 'passport' | 'cv' | 'driving_license' | 'education_certificate' | 'covid_certificate' | 'other';
  name: string;
  file_url: string;
  file_size?: number;
  uploaded_at: string;
  expiry_date?: string;
  document_number?: string;
}

// Notification types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'system';
  read: boolean;
  created_at: string;
  action_url?: string;
  action_text?: string;
  // Additional properties for compatibility
  notification_id?: number;
  subject?: string;
  heading?: string;
  body?: string;
  content?: string;
  description?: string;
  createdAt?: string;
  date?: string;
  is_read?: boolean;
  isRead?: boolean;
  read_at?: string;
  notification_type?: string;
  priority?: string;
  actionUrl?: string;
  link?: string;
}

// Profile strength types
export interface ProfileStrength {
  overall_percentage: number;
  sections: {
    personal_info: number;
    experience: number;
    education: number;
    documents: number;
    skills: number;
  };
  missing_fields: string[];
  recommendations: string[];
}

// Country and region types
export interface Country {
  id: number;
  name: string;
  countryFlag?: string;
  currencyName?: string;
  currencySymbol?: string;
  job_count?: number;
}

export interface Region {
  id: number;
  name: string;
  country_id: number;
  country_name?: string;
}

// Department/Occupation types
export interface Department {
  id: number;
  title: string;
  name: string;
  label: string;
  value: number;
  img?: string;
  job_count?: number;
}

export interface Skill {
  id: number;
  skill: string;
  category?: string;
}

// News and content types
export interface NewsItem {
  id: number;
  title: string;
  content: string;
  image?: string;
  published_at: string;
  author?: string;
  category?: string;
  // Additional properties for compatibility
  news_title?: string;
  news_description?: string;
  created_at?: string;
  link?: string;
}

export interface SuccessStory {
  id: number;
  candidate_name: string;
  job_title: string;
  company_name: string;
  country: string;
  salary?: number;
  currency?: string;
  story: string;
  image?: string;
  created_at: string;
}

// Form data types for file uploads
export interface FormDataWithFiles {
  [key: string]: string | number | boolean | File | File[];
}

// Error types
export interface ApiError {
  message: string;
  status: number;
  data?: any;
  originalError?: any;
}

// Query key types for React Query
export const queryKeys = {
  auth: ['auth'] as const,
  user: ['user'] as const,
  jobs: ['jobs'] as const,
  hr: ['hr'] as const,
  institutes: ['institutes'] as const,
  courses: ['courses'] as const,
  notifications: ['notifications'] as const,
  countries: ['countries'] as const,
  departments: ['departments'] as const,
  skills: ['skills'] as const,
} as const;

// Mutation types
export interface MutationOptions<TData = any, TError = ApiError, TVariables = any> {
  onSuccess?: (data: TData, variables: TVariables) => void;
  onError?: (error: TError, variables: TVariables) => void;
  onSettled?: (data: TData | undefined, error: TError | null, variables: TVariables) => void;
}
