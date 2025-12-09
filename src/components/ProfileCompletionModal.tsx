"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";
import { 
  getState, 
  getDistrict,
  getSkillsByOccuId
} from "../services/info.service";
import { useOccupations, useCountriesForJobs } from "../hooks/useInfoQueries";
import { 
  profileCompleteStep2, 
  profileCompleteStep3,
  getEmpDataForEdit
} from "../services/user.service";
import { handleApiError, isNetworkError, isValidationError } from "../utils/errorHandler";
import { createFormDataRequest } from "../utils/axiosConfig";
import { validateProfileData, formatProfileData, sanitizeFormData } from "../utils/dataValidation";
import { applyJobApi } from "../services/job.service";
import { useGlobalState } from "../contexts/GlobalProvider";
import { CheckCircle, User, GraduationCap, MapPin, Briefcase, Phone } from 'lucide-react';

interface ProfileData {
  // Personal Details
  empName: string;
  empDob: string;
  empGender: string;
  empWhatsapp: string;
  empMS: string;
  empEmail: string;
  
  // Educational Details  
  empEdu: string;
  empTechEdu: string;
  empLanguage: string[];
  
  // Career Details
  empPassportQ: string;
  empSkill: string;
  empOccuId: string;
  empInternationMigrationExp: string;
  empDailyWage: string;
  empExpectedMonthlyIncome: string;
  empRelocationIntQ: string;
  empRelocationIntQCountry: string;
  empRelocationIntQState: string;
  
  // Address Details
  empState: string;
  empDistrict: string;
  empPS: string;
  empPSName: string;
  empPanchayat: string;
  empVillage: string;
  empPin: string;
  
  // Reference Details
  empRefName: string;
  empRefPhone: string;
  empRefDistance: string;
}

interface ProfileCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  onSuccess: () => void;
}

const ProfileCompletionModal: React.FC<ProfileCompletionModalProps> = ({
  isOpen,
  onClose,
  jobId,
  onSuccess
}) => {
  const { globalState } = useGlobalState();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  
  // Use cached hooks for occupations and countries
  const { data: cachedOccupations = [] } = useOccupations();
  const { data: cachedCountries = [] } = useCountriesForJobs();
  
  // Options data - prefer cached data
  const [occupations, setOccupations] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [countries, setCountries] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  
  // Sync cached data to state when available
  React.useEffect(() => {
    if (cachedOccupations.length > 0) {
      setOccupations(cachedOccupations);
    }
  }, [cachedOccupations]);
  
  React.useEffect(() => {
    if (cachedCountries.length > 0) {
      setCountries(cachedCountries);
    }
  }, [cachedCountries]);
  const [districts, setDistricts] = useState<any[]>([]);
  
  // Form data
  const [profileData, setProfileData] = useState<ProfileData>({
    empName: '',
    empDob: '',
    empGender: '',
    empWhatsapp: '',
    empMS: '',
    empEmail: '',
    empEdu: '',
    empTechEdu: '',
    empLanguage: [],
    empPassportQ: '',
    empSkill: '',
    empOccuId: '',
    empInternationMigrationExp: '',
    empDailyWage: '',
    empExpectedMonthlyIncome: '',
    empRelocationIntQ: '',
    empRelocationIntQCountry: '',
    empRelocationIntQState: '',
    empState: '',
    empDistrict: '',
    empPS: '',
    empPSName: '',
    empPanchayat: '',
    empVillage: '',
    empPin: '',
    empRefName: '',
    empRefPhone: '',
    empRefDistance: ''
  });

  const educationOptions = [
    { label: "Primary Education (below class 8)", value: "Primary Education (below class 8)" },
    { label: "Middle education (class 8 and above but below class 10)", value: "Middle education (class 8 and above but below class 10)" },
    { label: "Secondary Education", value: "Secondary Education" },
    { label: "Higher Secondary Education", value: "Higher Secondary Education" },
    { label: "Graduate", value: "Graduate" },
    { label: "Post Graduate", value: "Post Graduate" }
  ];

  const technicalEducationOptions = [
    { label: "ITI", value: "ITI" },
    { label: "Polytechnic", value: "Polytechnic" },
    { label: "Graduate in Engineering", value: "Graduate in Engineering" },
    { label: "Any other Vocational Training (one year or above)", value: "Any other Vocational Training (one year or above)" },
    { label: "Any other Vocational Training (less than one year)", value: "Any other Vocational Training (less than one year)" },
    { label: "Not applicable", value: "Not applicable" }
  ];

  const distanceOptions = [
    { label: "0-5 km", value: "0-5 km" },
    { label: "5-10 km", value: "5-10 km" },
    { label: "10-25 km", value: "10-25 km" },
    { label: "25-50 km", value: "25-50 km" },
    { label: "50-100 km", value: "50-100 km" },
    { label: "Above 100 km", value: "Above 100 km" }
  ];

  useEffect(() => {
    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  const loadInitialData = async () => {
    setLoadingInitialData(true);
    try {
      const token = globalState?.user?.access_token;
      if (!token) return;

      // Load existing profile data and states (occupations/countries come from cached hooks)
      const [
        profileResponse,
        statesResponse
      ] = await Promise.allSettled([
        getEmpDataForEdit(token),
        getState()
      ]);
      

      // Handle profile data with better error handling
      if (profileResponse.status === 'fulfilled' && profileResponse.value) {
        const data = profileResponse.value;
        // Only update fields that have actual values to preserve form state
        setProfileData(prevData => ({
          ...prevData,
          empName: data.empName || prevData.empName || '',
          empDob: data.empDob || prevData.empDob || '',
          empGender: data.empGender || prevData.empGender || '',
          empWhatsapp: data.empWhatsapp || prevData.empWhatsapp || '',
          empMS: data.empMS || prevData.empMS || '',
          empEmail: data.empEmail || prevData.empEmail || '',
          empEdu: data.empEdu || prevData.empEdu || '',
          empTechEdu: data.empTechEdu || prevData.empTechEdu || '',
          empPassportQ: data.empPassportQ || prevData.empPassportQ || '',
          empSkill: data.empSkill || prevData.empSkill || '',
          empOccuId: data.empOccuId || prevData.empOccuId || '',
          empInternationMigrationExp: data.empInternationMigrationExp || prevData.empInternationMigrationExp || '',
          empDailyWage: data.empDailyWage || prevData.empDailyWage || '',
          empExpectedMonthlyIncome: data.empExpectedMonthlyIncome || prevData.empExpectedMonthlyIncome || '',
          empRelocationIntQ: data.empRelocationIntQ || prevData.empRelocationIntQ || '',
          empState: data.empState || prevData.empState || '',
          empDistrict: data.empDistrict || prevData.empDistrict || '',
          empPin: data.empPin || prevData.empPin || '',
          empRefName: data.empRefName || prevData.empRefName || '',
          empRefPhone: data.empRefPhone || prevData.empRefPhone || '',
          empRefDistance: data.empRefDistance || prevData.empRefDistance || ''
        }));
      } else {
        // The form will start with empty default values, which is acceptable
      }

      // Occupations and countries are handled by the cached hooks above

      // Handle states
      if (statesResponse.status === 'fulfilled') {
        const stateData = statesResponse.value?.data?.states || [];
        setStates(stateData);
      }

    } catch (error) {
      // Don't show error toast for missing profile data - user can still fill the form
      // Only show error if critical data (like occupations) fails to load
      if (occupations.length === 0 && states.length === 0) {
        toast.error('Failed to load form options. Please refresh and try again.');
      }
    } finally {
      setLoadingInitialData(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string | string[]) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleOccupationChange = async (occupationId: string) => {
    handleInputChange('empOccuId', occupationId);
    
    // Load skills for selected occupation
    try {
      const response = await getSkillsByOccuId(parseInt(occupationId));
      setSkills(response?.skills || []);
    } catch (error) {
      // Set empty skills array on error
      setSkills([]);
    }
  };

  const handleStateChange = async (stateId: string) => {
    handleInputChange('empState', stateId);
    
    // Load districts for selected state
    try {
      const response = await getDistrict(parseInt(stateId));
      setDistricts(response?.districts || []);
    } catch (error) {
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Personal Details
        return !!(profileData.empName && profileData.empDob && profileData.empGender && 
                 profileData.empWhatsapp && profileData.empMS);
      case 2: // Education & Career
        return !!(profileData.empEdu && profileData.empTechEdu && profileData.empPassportQ &&
                 profileData.empSkill && profileData.empOccuId && profileData.empInternationMigrationExp &&
                 profileData.empDailyWage && profileData.empExpectedMonthlyIncome && profileData.empRelocationIntQ);
      case 3: // Address & References
        return !!(profileData.empState && profileData.empDistrict && profileData.empPin &&
                 profileData.empRefName && profileData.empRefPhone && profileData.empRefDistance);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error('Please fill all required fields before proceeding');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast.error('Please fill all required fields');
      return;
    }

    // Validate data before submission
    const validation = validateProfileData(profileData);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      toast.error(firstError);
      return;
    }

    setLoading(true);
    try {
      const token = globalState?.user?.access_token;
      if (!token) {
        toast.error('Please login to continue');
        return;
      }

      // Format and sanitize the data before creating FormData
      const formattedData = formatProfileData(profileData);
      const formData = createFormDataRequest(formattedData);
      const sanitizedFormData = sanitizeFormData(formData);

      // Submit profile completion (this might need to be split into multiple API calls)
      await profileCompleteStep2(sanitizedFormData, token);
      
      // Try to apply for the job now
      const applyPayload = {
        id: jobId,
        "apply-job": "",
      };
      
      const applyResponse = await applyJobApi(applyPayload, token);
      
      if (applyResponse?.data?.msg === "Job Applied Successfully") {
        toast.success('Profile completed and job application submitted successfully!');
        onSuccess();
        onClose();
      } else {
        toast.success('Profile completed successfully!');
        toast.info('Please try applying for the job again.');
        onClose();
      }

    } catch (error: any) {
      
      // Use our standardized error handling
      const processedError = handleApiError(error);
      
      if (isNetworkError(processedError)) {
        toast.error('Network error: Please check your internet connection and try again.');
      } else if (isValidationError(processedError)) {
        toast.error('Validation error: Please check your profile information.');
        
        // Show specific validation errors if available
        if (processedError.data?.errors) {
          Object.entries(processedError.data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              toast.error(`${field}: ${messages[0]}`);
            }
          });
        }
      } else {
        toast.error(processedError.message || 'Failed to complete profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empName" className="text-sm font-medium text-gray-700">
                  Full Name *
                </Label>
                <Input
                  id="empName"
                  value={profileData.empName}
                  onChange={(e) => handleInputChange('empName', e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empDob" className="text-sm font-medium">
                  Date of Birth *
                </Label>
                <Input
                  id="empDob"
                  type="date"
                  value={profileData.empDob}
                  onChange={(e) => handleInputChange('empDob', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empGender" className="text-sm font-medium">
                  Gender *
                </Label>
                <select
                  id="empGender"
                  value={profileData.empGender}
                  onChange={(e) => handleInputChange('empGender', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="empWhatsapp" className="text-sm font-medium">
                  WhatsApp Number *
                </Label>
                <Input
                  id="empWhatsapp"
                  value={profileData.empWhatsapp}
                  onChange={(e) => handleInputChange('empWhatsapp', e.target.value)}
                  placeholder="Enter WhatsApp number"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empMS" className="text-sm font-medium">
                  Marital Status *
                </Label>
                <select
                  id="empMS"
                  value={profileData.empMS}
                  onChange={(e) => handleInputChange('empMS', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Status</option>
                  <option value="Unmarried">Unmarried</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="empEmail" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="empEmail"
                  type="email"
                  value={profileData.empEmail}
                  onChange={(e) => handleInputChange('empEmail', e.target.value)}
                  placeholder="Enter email address"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empEdu" className="text-sm font-medium">
                  Highest Education *
                </Label>
                <select
                  id="empEdu"
                  value={profileData.empEdu}
                  onChange={(e) => handleInputChange('empEdu', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Education</option>
                  {educationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="empTechEdu" className="text-sm font-medium">
                  Technical Education *
                </Label>
                <select
                  id="empTechEdu"
                  value={profileData.empTechEdu}
                  onChange={(e) => handleInputChange('empTechEdu', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Technical Education</option>
                  {technicalEducationOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="empPassportQ" className="text-sm font-medium">
                  Do you have a passport? *
                </Label>
                <select
                  id="empPassportQ"
                  value={profileData.empPassportQ}
                  onChange={(e) => handleInputChange('empPassportQ', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="empSkill" className="text-sm font-medium">
                  Preferred Department *
                </Label>
                <select
                  id="empSkill"
                  value={profileData.empSkill}
                  onChange={(e) => {
                    handleInputChange('empSkill', e.target.value);
                    handleOccupationChange(e.target.value);
                  }}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  {occupations.map(occ => (
                    <option key={occ.id} value={occ.id}>
                      {occ.occupation}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="empOccuId" className="text-sm font-medium">
                  Preferred Occupation *
                </Label>
                <select
                  id="empOccuId"
                  value={profileData.empOccuId}
                  onChange={(e) => handleInputChange('empOccuId', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Occupation</option>
                  {skills.map(skill => (
                    <option key={skill.id} value={skill.id}>
                      {skill.skill}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="empInternationMigrationExp" className="text-sm font-medium">
                  International Migration Experience *
                </Label>
                <select
                  id="empInternationMigrationExp"
                  value={profileData.empInternationMigrationExp}
                  onChange={(e) => handleInputChange('empInternationMigrationExp', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="empDailyWage" className="text-sm font-medium">
                  Present Monthly Income *
                </Label>
                <Input
                  id="empDailyWage"
                  value={profileData.empDailyWage}
                  onChange={(e) => handleInputChange('empDailyWage', e.target.value)}
                  placeholder="Enter present monthly income"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empExpectedMonthlyIncome" className="text-sm font-medium">
                  Expected Monthly Income *
                </Label>
                <Input
                  id="empExpectedMonthlyIncome"
                  value={profileData.empExpectedMonthlyIncome}
                  onChange={(e) => handleInputChange('empExpectedMonthlyIncome', e.target.value)}
                  placeholder="Enter expected monthly income"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empRelocationIntQ" className="text-sm font-medium">
                  Job Location Preference *
                </Label>
                <select
                  id="empRelocationIntQ"
                  value={profileData.empRelocationIntQ}
                  onChange={(e) => handleInputChange('empRelocationIntQ', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Yes">International</option>
                  <option value="No">National</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empState" className="text-sm font-medium">
                  State *
                </Label>
                <select
                  id="empState"
                  value={profileData.empState}
                  onChange={(e) => handleStateChange(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state.id} value={state.id}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="empDistrict" className="text-sm font-medium">
                  District *
                </Label>
                <select
                  id="empDistrict"
                  value={profileData.empDistrict}
                  onChange={(e) => handleInputChange('empDistrict', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select District</option>
                  {districts.map(district => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="empPSName" className="text-sm font-medium">
                  Police Station Name
                </Label>
                <Input
                  id="empPSName"
                  value={profileData.empPSName}
                  onChange={(e) => handleInputChange('empPSName', e.target.value)}
                  placeholder="Enter police station name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empPanchayat" className="text-sm font-medium">
                  Panchayat Name
                </Label>
                <Input
                  id="empPanchayat"
                  value={profileData.empPanchayat}
                  onChange={(e) => handleInputChange('empPanchayat', e.target.value)}
                  placeholder="Enter panchayat name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empVillage" className="text-sm font-medium">
                  Village Name
                </Label>
                <Input
                  id="empVillage"
                  value={profileData.empVillage}
                  onChange={(e) => handleInputChange('empVillage', e.target.value)}
                  placeholder="Enter village name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empPin" className="text-sm font-medium">
                  Pin Code *
                </Label>
                <Input
                  id="empPin"
                  value={profileData.empPin}
                  onChange={(e) => handleInputChange('empPin', e.target.value)}
                  placeholder="Enter pin code"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empRefName" className="text-sm font-medium">
                  Reference Name *
                </Label>
                <Input
                  id="empRefName"
                  value={profileData.empRefName}
                  onChange={(e) => handleInputChange('empRefName', e.target.value)}
                  placeholder="Enter reference name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="empRefPhone" className="text-sm font-medium">
                  Reference Phone *
                </Label>
                <Input
                  id="empRefPhone"
                  value={profileData.empRefPhone}
                  onChange={(e) => handleInputChange('empRefPhone', e.target.value)}
                  placeholder="Enter reference phone"
                  className="mt-1"
                />
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor="empRefDistance" className="text-sm font-medium">
                  Distance from Reference *
                </Label>
                <select
                  id="empRefDistance"
                  value={profileData.empRefDistance}
                  onChange={(e) => handleInputChange('empRefDistance', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Distance</option>
                  {distanceOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="w-5 h-5" />;
      case 2: return <GraduationCap className="w-5 h-5" />;
      case 3: return <MapPin className="w-5 h-5" />;
      default: return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Personal Details";
      case 2: return "Education & Career";
      case 3: return "Address & References";
      default: return "";
    }
  };

  if (loadingInitialData) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Loading Profile</DialogTitle>
            <DialogDescription>Please wait while we load your profile information and form options.</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-12 bg-white">
            <div className="flex flex-col items-center gap-3">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-600 text-sm">Loading profile data...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader className="bg-white">
          <DialogTitle className="text-xl font-bold text-center text-gray-900">
            Complete Your Profile to Apply
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 text-center">
            Please fill in the mandatory fields to apply for this job
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-center mb-6 bg-white px-4">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {currentStep > step ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    getStepIcon(step)
                  )}
                </div>
                <div className="ml-2 text-sm">
                  <div className={`font-medium ${currentStep >= step ? 'text-blue-600' : 'text-gray-500'}`}>
                    Step {step}
                  </div>
                  <div className="text-gray-500 text-xs">{getStepTitle(step)}</div>
                </div>
                {step < 3 && (
                  <div className={`w-12 h-px ml-4 ${currentStep > step ? 'bg-blue-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              {getStepIcon(currentStep)}
              {getStepTitle(currentStep)}
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t bg-white border-gray-200">
          <Button
            variant="outline"
            onClick={() => currentStep > 1 ? setCurrentStep(prev => prev - 1) : onClose()}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {currentStep > 1 ? 'Previous' : 'Cancel'}
          </Button>
          
          {currentStep < 3 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completing Profile...
                </div>
              ) : (
                'Complete & Apply'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCompletionModal;
