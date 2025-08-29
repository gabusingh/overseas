"use client";

import React, { useEffect, useState, useCallback } from 'react';
import Select from 'react-select';
import { motion, AnimatePresence } from 'framer-motion';

// Types interface definitions
interface LoginForm {
  name: string;
  contact: string;
  otp: string;
}

interface User {
  id: string;
  name: string;
  contact: string;
  email?: string;
  photo?: string;
  profileTitle?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  maritalStatus?: 'Married' | 'Unmarried';
  languageKnown?: string[];
  highEdu?: string;
  highEduYear?: string;
  techEdu?: string;
  techEduYear?: string;
  state?: string;
  district?: string;
  village?: string;
  panchayat?: string;
  ps?: string;
}

interface Experience {
  id?: string;
  userId: string;
  organisationName: string;
  designation: string;
  jobType?: string;
  type: 'Domestic' | 'International';
  country?: string;
  state?: string;
  joiningDate: string;
  leavingDate?: string;
  isWorking: boolean;
  duration?: string;
  image?: File | string;
}

interface Passport {
  id?: string;
  userId: string;
  passportNo: string;
  passportCategory: 'ECR' | 'ECNR';
  issueDate: string;
  expiryDate: string;
  image?: File | string;
}

interface License {
  id?: string;
  userId: string;
  licenceName: string;
  licenceImage?: File | string;
}

// Modal Props Interface
interface ModalsProps {
  activeModal: string | null;
  setActiveModal: React.Dispatch<React.SetStateAction<string | null>>;
  userDetails: User | null;
  setUserDetails: React.Dispatch<React.SetStateAction<User | null>>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  passport: Passport | null;
  setPassport: React.Dispatch<React.SetStateAction<Passport | null>>;
  licenses: License[];
  setLicenses: React.Dispatch<React.SetStateAction<License[]>>;
  loginForm?: LoginForm;
  setLoginForm?: (form: LoginForm) => void;
  experienceForm: Partial<Experience>;
  setExperienceForm: React.Dispatch<React.SetStateAction<Partial<Experience>>>;
  passportForm: Partial<Passport>;
  setPassportForm: React.Dispatch<React.SetStateAction<Partial<Passport>>>;
  licenseForm: Partial<License>;
  setLicenseForm: React.Dispatch<React.SetStateAction<Partial<License>>>;
  languageOptions: Array<{ label: string; value: string }>;
  languageKnown: string[];
  setLanguageKnown: React.Dispatch<React.SetStateAction<string[]>>;
  EDUCATION_LEVELS: Array<{ label: string; value: string }>;
  TECHNICAL_EDUCATION: Array<{ label: string; value: string }>;
  showOtpInput?: boolean;
  setShowOtpInput?: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  sendOtp?: () => void;
  verifyOtp?: () => void;
  updateResume: () => void;
  addResumeExperience: () => void;
  addResumeLicence: () => void;
  handleUpdatePassport: () => void;
}

// Move component definitions outside to prevent recreation on each render
const InputField = ({ icon, label, type = "text", placeholder, value, onChange, required = false, options = null, disabled = false }: {
  icon?: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  required?: boolean;
  options?: Array<{ value: string; label: string }> | null;
  disabled?: boolean;
}) => (
  <div className="space-y-2">
    <label className="block text-xs sm:text-sm font-medium text-gray-700">
      {label}{required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <i className={`${icon} text-gray-400 text-xs sm:text-sm`}></i>
        </div>
      )}
      {type === 'select' && options ? (
        <select
          className={`w-full ${icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-white text-gray-900 text-sm sm:text-base ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-8 sm:pl-10' : 'pl-3 sm:pl-4'} pr-3 sm:pr-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 text-sm sm:text-base ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}
          value={value || ''}
          onChange={onChange}
          disabled={disabled}
        />
      )}
    </div>
  </div>
);

const ImageUploadField = ({ label, value, onChange, required = false, preview }: {
  label: string;
  value?: File | string;
  onChange: (file: File | null) => void;
  required?: boolean;
  preview?: string;
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs sm:text-sm font-medium text-gray-700">
        {label}{required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 bg-gray-50 hover:bg-gray-100 text-sm sm:text-base file:mr-2 sm:file:mr-4 file:py-1 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-md file:border-0 file:text-xs sm:file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {(preview || (typeof value === 'string' && value)) && (
          <div className="mt-3 relative inline-block">
            <img
              src={preview || (typeof value === 'string' ? value : '')}
              alt="Preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={() => onChange(null)}
              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const ActionButton = ({ onClick, children, variant = 'primary', loading = false, disabled = false, fullWidth = true }: {
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}) => {
  const baseClasses = "px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm sm:text-base";
  const variantClasses = {
    primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white focus:ring-gray-500",
    success: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white focus:ring-green-500 shadow-lg hover:shadow-xl"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''} ${disabled || loading ? 'opacity-50 cursor-not-allowed transform-none hover:scale-100' : ''}`}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white mr-2"></div>
          <span className="text-sm sm:text-base">Processing...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

const ModalHeader = ({ icon, title, subtitle, gradient = "from-blue-600 to-indigo-600" }: {
  icon: string;
  title: string;
  subtitle: string;
  gradient?: string;
}) => (
  <div className="relative overflow-hidden">
    <div className={`bg-gradient-to-r ${gradient} px-4 sm:px-6 lg:px-8 py-4 sm:py-6 text-white`}>
      <div className="flex items-center justify-center mb-3 sm:mb-4">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <i className={`${icon} text-lg sm:text-2xl`}></i>
        </div>
      </div>
      <div className="text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">{title}</h2>
        <p className="text-white/80 text-sm sm:text-base">{subtitle}</p>
      </div>
    </div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
  </div>
);

const ResumeBuilderModals: React.FC<ModalsProps> = ({
  activeModal,
  setActiveModal,
  userDetails,
  setUserDetails,
  experiences,
  setExperiences,
  passport,
  setPassport,
  licenses,
  setLicenses,
  loginForm,
  setLoginForm,
  experienceForm,
  setExperienceForm,
  passportForm,
  setPassportForm,
  licenseForm,
  setLicenseForm,
  languageOptions,
  languageKnown,
  setLanguageKnown,
  EDUCATION_LEVELS,
  TECHNICAL_EDUCATION,
  showOtpInput,
  setShowOtpInput,
  isLoading,
  sendOtp,
  verifyOtp,
  updateResume,
  addResumeExperience,
  addResumeLicence,
  handleUpdatePassport,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [otpInputVisible, setOtpInputVisible] = useState(showOtpInput);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  useEffect(() => {
    console.log('showOtpInput prop changed:', showOtpInput);
    setOtpInputVisible(showOtpInput);
  }, [showOtpInput]);

  // Create stable onChange handlers to prevent focus loss
  const handleUserDetailsChange = useCallback((field: keyof User, value: any) => {
    setUserDetails((prevDetails: User | null) => {
      if (!prevDetails) return null;
      return { ...prevDetails, [field]: value };
    });
  }, [setUserDetails]);

  const handleExperienceFormChange = useCallback((field: keyof Experience, value: any) => {
    setExperienceForm((prevForm: Partial<Experience>) => ({ ...prevForm, [field]: value }));
  }, [setExperienceForm]);

  const handlePassportFormChange = useCallback((field: keyof Passport, value: any) => {
    setPassportForm((prevForm: Partial<Passport>) => ({ ...prevForm, [field]: value }));
  }, [setPassportForm]);

  const handleLicenseFormChange = useCallback((field: keyof License, value: any) => {
    setLicenseForm((prevForm: Partial<License>) => ({ ...prevForm, [field]: value }));
  }, [setLicenseForm]);

  const handleImageUpload = useCallback((file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      handleUserDetailsChange('photo', file);
    } else {
      setImagePreview(undefined);
      handleUserDetailsChange('photo', null);
    }
  }, [handleUserDetailsChange]);

  // Validation functions
  const isPersonalDetailsValid = () => {
    if (!userDetails) return false;
    return !!(userDetails.name && userDetails.contact);
  };

  const isExperienceFormValid = () => {
    return !!(experienceForm.organisationName && experienceForm.designation && experienceForm.joiningDate);
  };

  const isPassportFormValid = () => {
    return !!(passportForm.passportNo && passportForm.issueDate && passportForm.expiryDate);
  };

  // Set image preview from existing photo
  useEffect(() => {
    if (userDetails?.photo && typeof userDetails.photo === 'string') {
      setImagePreview(userDetails.photo);
    }
  }, [userDetails?.photo]);

  if (!isMounted) return null;
  if (!activeModal) return null;

  const modalContent = () => {
    switch (activeModal) {
      case 'personal':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-2xl w-full mx-4 sm:mx-0"
          >
            <ModalHeader 
              icon="fa fa-user-circle" 
              title="Personal Details" 
              subtitle="Build your professional profile"
              gradient="from-purple-600 to-pink-600"
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <ImageUploadField
                    label="Profile Photo"
                    value={userDetails?.photo}
                    onChange={handleImageUpload}
                    preview={imagePreview}
                  />
                </div>
                <div className="lg:col-span-2">
                  <InputField
                    icon="fa fa-user"
                    label="Full Name"
                    placeholder="e.g., John Doe"
                    value={userDetails?.name}
                    onChange={(e) => handleUserDetailsChange('name', e.target.value)}
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <InputField
                    icon="fa fa-phone"
                    label="Contact Number"
                    placeholder="e.g., +91 9876543210"
                    value={userDetails?.contact}
                    onChange={(e) => handleUserDetailsChange('contact', e.target.value)}
                    required
                  />
                </div>
                <div className="lg:col-span-2">
                  <InputField
                    icon="fa fa-briefcase"
                    label="Profile Title"
                    placeholder="e.g., Senior Software Engineer"
                    value={userDetails?.profileTitle}
                    onChange={(e) => handleUserDetailsChange('profileTitle', e.target.value)}
                  />
                </div>
                <InputField
                  icon="fa fa-calendar"
                  label="Date of Birth"
                  type="date"
                  value={userDetails?.dob}
                  onChange={(e) => handleUserDetailsChange('dob', e.target.value)}
                />
                <InputField
                  icon="fa fa-venus-mars"
                  label="Gender"
                  type="select"
                  placeholder="Select Gender"
                  value={userDetails?.gender}
                  onChange={(e) => handleUserDetailsChange('gender', e.target.value as User['gender'])}
                  options={[
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
                <InputField
                  icon="fa fa-heart"
                  label="Marital Status"
                  type="select"
                  placeholder="Select Marital Status"
                  value={userDetails?.maritalStatus}
                  onChange={(e) => handleUserDetailsChange('maritalStatus', e.target.value as User['maritalStatus'])}
                  options={[
                    { value: 'Married', label: 'Married' },
                    { value: 'Unmarried', label: 'Unmarried' }
                  ]}
                />
                <div className="lg:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Languages Known</label>
                  <Select
                    isMulti
                    options={languageOptions}
                    value={languageOptions.filter(option => languageKnown.includes(option.value))}
                    onChange={(selected) => setLanguageKnown(selected ? selected.map(option => option.value) : [])}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    placeholder="Select languages..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: '0.5rem',
                        // sm:rounded-xl
                        borderWidth: '2px',
                        borderColor: '#e5e7eb',
                        padding: '0.25rem',
                        // sm:p-2
                        minHeight: '42px',
                        fontSize: '14px',
                        // sm:text-base
                        '&:focus': {
                          borderColor: '#3b82f6',
                          boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
                        }
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: '#ede9fe',
                        borderRadius: '0.375rem',
                        // sm:rounded-lg
                        fontSize: '12px',
                        // sm:text-sm
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: '#7c3aed',
                        fontSize: '12px',
                        // sm:text-sm
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: '#7c3aed',
                        ':hover': {
                          backgroundColor: '#c4b5fd',
                          color: '#5b21b6'
                        }
                      }),
                      placeholder: (base) => ({
                        ...base,
                        fontSize: '14px',
                        // sm:text-base
                      }),
                      input: (base) => ({
                        ...base,
                        fontSize: '14px',
                        // sm:text-base
                      })
                    }}
                  />
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <ActionButton 
                  onClick={() => setActiveModal(null)} 
                  variant="secondary" 
                  fullWidth={false}
                >
                  <i className="fa fa-times mr-2"></i>
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={updateResume} 
                  loading={isLoading}
                  variant="success"
                  disabled={!isPersonalDetailsValid()}
                >
                  <i className="fa fa-save mr-2"></i>
                  Save Details
                </ActionButton>
              </div>
            </div>
          </motion.div>
        );

      case 'experience':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-2xl w-full mx-4 sm:mx-0"
          >
            <ModalHeader 
              icon="fa fa-briefcase" 
              title="Work Experience" 
              subtitle="Add your professional experience"
              gradient="from-emerald-600 to-teal-600"
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <InputField
                  icon="fa fa-building"
                  label="Organization Name"
                  placeholder="e.g., Microsoft Corporation"
                  value={experienceForm.organisationName}
                  onChange={(e) => handleExperienceFormChange('organisationName', e.target.value)}
                  required
                />
                <InputField
                  icon="fa fa-user-tie"
                  label="Designation"
                  placeholder="e.g., Software Engineer"
                  value={experienceForm.designation}
                  onChange={(e) => handleExperienceFormChange('designation', e.target.value)}
                  required
                />
                <InputField
                  icon="fa fa-globe"
                  label="Work Type"
                  type="select"
                  placeholder="Select Work Type"
                  value={experienceForm.type}
                  onChange={(e) => handleExperienceFormChange('type', e.target.value as Experience['type'])}
                  options={[
                    { value: 'Domestic', label: 'Domestic' },
                    { value: 'International', label: 'International' }
                  ]}
                />
                <InputField
                  icon={experienceForm.type === 'International' ? 'fa fa-flag' : 'fa fa-map-marker-alt'}
                  label={experienceForm.type === 'International' ? 'Country' : 'State'}
                  placeholder={experienceForm.type === 'International' ? 'e.g., United States' : 'e.g., California'}
                  value={experienceForm.type === 'International' ? experienceForm.country : experienceForm.state}
                  onChange={(e) => handleExperienceFormChange(
                    experienceForm.type === 'International' ? 'country' : 'state', 
                    e.target.value
                  )}
                />
                <InputField
                  icon="fa fa-calendar-plus"
                  label="Joining Date"
                  type="date"
                  value={experienceForm.joiningDate}
                  onChange={(e) => handleExperienceFormChange('joiningDate', e.target.value)}
                  required
                />
                {!experienceForm.isWorking && (
                  <InputField
                    icon="fa fa-calendar-minus"
                    label="Leaving Date"
                    type="date"
                    value={experienceForm.leavingDate}
                    onChange={(e) => handleExperienceFormChange('leavingDate', e.target.value)}
                  />
                )}
                <div className={`${!experienceForm.isWorking ? 'lg:col-span-2' : 'lg:col-span-2'} flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl`}>
                  <input
                    type="checkbox"
                    id="currently-working"
                    className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2"
                    checked={experienceForm.isWorking || false}
                    onChange={(e) => handleExperienceFormChange('isWorking', e.target.checked)}
                  />
                  <label htmlFor="currently-working" className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer">
                    <i className="fa fa-clock mr-1 sm:mr-2 text-emerald-600"></i>
                    I am currently working in this role
                  </label>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <ActionButton 
                  onClick={() => setActiveModal(null)} 
                  variant="secondary" 
                  fullWidth={false}
                >
                  <i className="fa fa-times mr-2"></i>
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={addResumeExperience} 
                  loading={isLoading}
                  variant="success"
                  disabled={!isExperienceFormValid()}
                >
                  <i className="fa fa-plus mr-2"></i>
                  Add Experience
                </ActionButton>
              </div>
            </div>
          </motion.div>
        );

      case 'education':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-2xl w-full mx-4 sm:mx-0"
          >
            <ModalHeader 
              icon="fa fa-graduation-cap" 
              title="Education Details" 
              subtitle="Add your educational qualifications"
              gradient="from-indigo-600 to-blue-600"
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-indigo-800 mb-3 sm:mb-4 flex items-center">
                    <i className="fa fa-university mr-1 sm:mr-2"></i>
                    Highest Education
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <InputField
                      icon="fa fa-book"
                      label="Education Level"
                      type="select"
                      placeholder="Select Highest Education"
                      value={userDetails?.highEdu}
                      onChange={(e) => handleUserDetailsChange('highEdu', e.target.value)}
                      options={EDUCATION_LEVELS}
                    />
                    <InputField
                      icon="fa fa-calendar"
                      label="Year of Completion"
                      type="date"
                      value={userDetails?.highEduYear}
                      onChange={(e) => handleUserDetailsChange('highEduYear', e.target.value)}
                    />
                  </div>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 sm:p-6 rounded-lg sm:rounded-xl">
                  <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-3 sm:mb-4 flex items-center">
                    <i className="fa fa-tools mr-1 sm:mr-2"></i>
                    Technical Education
                  </h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                    <InputField
                      icon="fa fa-cogs"
                      label="Technical Qualification"
                      type="select"
                      placeholder="Select Technical Education"
                      value={userDetails?.techEdu}
                      onChange={(e) => handleUserDetailsChange('techEdu', e.target.value)}
                      options={TECHNICAL_EDUCATION}
                    />
                    <InputField
                      icon="fa fa-calendar"
                      label="Year of Completion"
                      type="date"
                      value={userDetails?.techEduYear}
                      onChange={(e) => handleUserDetailsChange('techEduYear', e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <ActionButton 
                  onClick={() => setActiveModal(null)} 
                  variant="secondary" 
                  fullWidth={false}
                >
                  <i className="fa fa-times mr-2"></i>
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={updateResume} 
                  loading={isLoading}
                  variant="success"
                >
                  <i className="fa fa-save mr-2"></i>
                  Save Education
                </ActionButton>
              </div>
            </div>
          </motion.div>
        );

      case 'address':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-2xl w-full mx-4 sm:mx-0"
          >
            <ModalHeader 
              icon="fa fa-map-marker-alt" 
              title="Address Details" 
              subtitle="Add your contact information"
              gradient="from-orange-600 to-red-600"
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="lg:col-span-2">
                  <InputField
                    icon="fa fa-envelope"
                    label="Email Address"
                    type="email"
                    placeholder="e.g., john.doe@example.com"
                    value={userDetails?.email}
                    onChange={(e) => handleUserDetailsChange('email', e.target.value)}
                  />
                </div>
                <InputField
                  icon="fa fa-map"
                  label="State"
                  placeholder="e.g., West Bengal"
                  value={userDetails?.state}
                  onChange={(e) => handleUserDetailsChange('state', e.target.value)}
                />
                <InputField
                  icon="fa fa-city"
                  label="District"
                  placeholder="e.g., Kolkata"
                  value={userDetails?.district}
                  onChange={(e) => handleUserDetailsChange('district', e.target.value)}
                />
                <InputField
                  icon="fa fa-home"
                  label="Village"
                  placeholder="e.g., Village Name"
                  value={userDetails?.village}
                  onChange={(e) => handleUserDetailsChange('village', e.target.value)}
                />
                <InputField
                  icon="fa fa-shield-alt"
                  label="Police Station"
                  placeholder="e.g., Station Name"
                  value={userDetails?.ps}
                  onChange={(e) => handleUserDetailsChange('ps', e.target.value)}
                />
                <div className="lg:col-span-2">
                  <InputField
                    icon="fa fa-users"
                    label="Panchayat"
                    placeholder="e.g., Panchayat Name"
                    value={userDetails?.panchayat}
                    onChange={(e) => handleUserDetailsChange('panchayat', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <ActionButton 
                  onClick={() => setActiveModal(null)} 
                  variant="secondary" 
                  fullWidth={false}
                >
                  <i className="fa fa-times mr-2"></i>
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={updateResume} 
                  loading={isLoading}
                  variant="success"
                >
                  <i className="fa fa-save mr-2"></i>
                  Save Address
                </ActionButton>
              </div>
            </div>
          </motion.div>
        );

      case 'passport':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-2xl w-full mx-4 sm:mx-0"
          >
            <ModalHeader 
              icon="fa fa-passport" 
              title="Passport Details" 
              subtitle="Add your passport information"
              gradient="from-cyan-600 to-blue-600"
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <InputField
                  icon="fa fa-id-card"
                  label="Passport Number"
                  placeholder="e.g., A1234567"
                  value={passportForm.passportNo}
                  onChange={(e) => handlePassportFormChange('passportNo', e.target.value)}
                  required
                />
                <InputField
                  icon="fa fa-tag"
                  label="Passport Category"
                  type="select"
                  placeholder="Select Category"
                  value={passportForm.passportCategory}
                  onChange={(e) => handlePassportFormChange('passportCategory', e.target.value as Passport['passportCategory'])}
                  options={[
                    { value: 'ECR', label: 'ECR (Emigration Check Required)' },
                    { value: 'ECNR', label: 'ECNR (Emigration Check Not Required)' }
                  ]}
                />
                <InputField
                  icon="fa fa-calendar-plus"
                  label="Issue Date"
                  type="date"
                  value={passportForm.issueDate}
                  onChange={(e) => handlePassportFormChange('issueDate', e.target.value)}
                  required
                />
                <InputField
                  icon="fa fa-calendar-times"
                  label="Expiry Date"
                  type="date"
                  value={passportForm.expiryDate}
                  onChange={(e) => handlePassportFormChange('expiryDate', e.target.value)}
                  required
                />
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <ActionButton 
                  onClick={() => setActiveModal(null)} 
                  variant="secondary" 
                  fullWidth={false}
                >
                  <i className="fa fa-times mr-2"></i>
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={handleUpdatePassport} 
                  loading={isLoading}
                  variant="success"
                  disabled={!isPassportFormValid()}
                >
                  <i className="fa fa-save mr-2"></i>
                  Save Passport
                </ActionButton>
              </div>
            </div>
          </motion.div>
        );

      case 'license':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg sm:rounded-2xl overflow-hidden shadow-2xl max-w-sm sm:max-w-md lg:max-w-lg w-full mx-4 sm:mx-0"
          >
            <ModalHeader 
              icon="fa fa-certificate" 
              title="License Details" 
              subtitle="Add your certifications and licenses"
              gradient="from-yellow-600 to-orange-600"
            />
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="space-y-4 sm:space-y-6">
                <InputField
                  icon="fa fa-award"
                  label="License Name"
                  placeholder="e.g., Driving License, Professional Certificate"
                  value={licenseForm.licenceName}
                  onChange={(e) => handleLicenseFormChange('licenceName', e.target.value)}
                  required
                />
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <i className="fa fa-info-circle text-yellow-400"></i>
                    </div>
                    <div className="ml-2 sm:ml-3">
                      <p className="text-xs sm:text-sm text-yellow-700">
                        Add any professional licenses, certifications, or permits that are relevant to your career.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <ActionButton 
                  onClick={() => setActiveModal(null)} 
                  variant="secondary" 
                  fullWidth={false}
                >
                  <i className="fa fa-times mr-2"></i>
                  Cancel
                </ActionButton>
                <ActionButton 
                  onClick={addResumeLicence} 
                  loading={isLoading}
                  variant="success"
                  disabled={!licenseForm.licenceName?.trim()}
                >
                  <i className="fa fa-plus mr-2"></i>
                  Add License
                </ActionButton>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {activeModal && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" 
            onClick={() => activeModal !== 'verification' && setActiveModal(null)} 
          />
          <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-fit max-h-[95vh] flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative"
              >
                {activeModal !== 'verification' && (
                  <button 
                    onClick={() => setActiveModal(null)} 
                    className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-200 transform hover:scale-110"
                  >
                    <i className="fa fa-times text-sm sm:text-base"></i>
                  </button>
                )}
                {modalContent()}
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ResumeBuilderModals;
