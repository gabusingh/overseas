"use client";

import React, { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Select from "react-select";
import { useRouter } from "next/navigation";
import {
  updateResumeApi,
  updateResumeExperience,
  updateResumeLicence,
  updatePassport,
} from "../../../services/resume.service";
import { ResumePreview, BuilderSidebar } from "../../../components/resume-builder/ResumeBuilderComponents";
import ResumeBuilderModals from "./ResumeBuilderModals";
import { getStoredUser, getStoredToken, isAuthenticated } from "../../../lib/auth";
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

// Types
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

const languageOptions = [
  { label: "Bengali", value: "Bengali" },
  { label: "Assamese", value: "Assamese" },
  { label: "Hindi", value: "Hindi" },
  { label: "Marathi", value: "Marathi" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Oriya", value: "Oriya" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Tamil", value: "Tamil" },
  { label: "Telugu", value: "Telugu" },
  { label: "Urdu", value: "Urdu" },
  { label: "Arabic", value: "Arabic" },
  { label: "English", value: "English" },
  { label: "Japanese", value: "Japanese" },
  { label: "German", value: "German" },
  { label: "Spanish", value: "Spanish" },
  { label: "French", value: "French" },
];

const EDUCATION_LEVELS = [
  {
    label: "Primary Education (below class 8)",
    value: "Primary Education (below class 8)",
  },
  {
    label: "Middle education (class 8 and above but below class 10)",
    value: "Middle education (class 8 and above but below class 10)",
  },
  { label: "Secondary Education", value: "Secondary Education" },
  { label: "Higher Secondary Education", value: "Higher Secondary Education" },
  { label: "Graduate", value: "Graduate" },
  { label: "Post Graduate", value: "Post Graduate" },
];

const TECHNICAL_EDUCATION = [
  { label: "ITI", value: "ITI" },
  { label: "Polytechnic", value: "Polytechnic" },
  { label: "Graduate in Engineering", value: "Graduate in Engineering" },
  {
    label: "Any other Vocational Training (one year or above)",
    value: "Any other Vocational Training (one year or above)",
  },
  {
    label: "Any other Vocational Training (less than one year)",
    value: "Any other Vocational Training (less than one year)",
  },
  { label: "Not applicable", value: "Not applicable" },
];

export default function ResumeBuilding() {
  const router = useRouter();
  
  // State management
  const [userDetails, setUserDetails] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('resumeUser');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [experiences, setExperiences] = useState<Experience[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('resumeExperience');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const [passport, setPassport] = useState<Passport | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('resumePassport');
        if (stored) {
          const parsed = JSON.parse(stored);
          return Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : null;
        }
      } catch {}
    }
    return null;
  });

  const [licenses, setLicenses] = useState<License[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('resumeLicence');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Initialize user data from main auth system
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check if user is authenticated in main system
      if (!isAuthenticated()) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/resume-building');
        return;
      }
      
      // Get user data from main auth system
      const mainUser = getStoredUser();
      const mainToken = getStoredToken();
      
      if (mainUser && mainToken) {
        // Check if we already have resume data in session
        const existingResumeUser = sessionStorage.getItem('resumeUser');
        
        if (!existingResumeUser) {
          // Create resume user object from main user data (defensive: avoid calling toString on undefined)
          const resumeUser: User = {
            id: String((mainUser as any)?.id ?? (mainUser as any)?.user?.id ?? ''),
            name: (mainUser as any)?.name ?? (mainUser as any)?.user?.name ?? '',
            contact: (mainUser as any)?.phone ?? (mainUser as any)?.user?.phone ?? '',
            email: (mainUser as any)?.email ?? (mainUser as any)?.user?.email ?? '',
            photo: '/images/default-avatar.png'
          };
          
          // Initialize resume data in session
          setUserDetails(resumeUser);
          sessionStorage.setItem('resumeUser', JSON.stringify(resumeUser));
          sessionStorage.setItem('resumeAccessToken', mainToken);
          
          // Initialize empty arrays if not exists
          if (!sessionStorage.getItem('resumeExperience')) {
            sessionStorage.setItem('resumeExperience', JSON.stringify([]));
          }
          if (!sessionStorage.getItem('resumePassport')) {
            sessionStorage.setItem('resumePassport', JSON.stringify([]));
          }
          if (!sessionStorage.getItem('resumeLicence')) {
            sessionStorage.setItem('resumeLicence', JSON.stringify([]));
          }
        }
      }
    }
  }, [router]);

  // Modal and UI states
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [experienceForm, setExperienceForm] = useState<Partial<Experience>>({
    organisationName: '',
    designation: '',
    type: 'Domestic',
    joiningDate: '',
    isWorking: false
  });

  const [passportForm, setPassportForm] = useState<Partial<Passport>>({
    passportNo: '',
    passportCategory: 'ECR',
    issueDate: '',
    expiryDate: ''
  });

  const [licenseForm, setLicenseForm] = useState<Partial<License>>({
    licenceName: ''
  });

  // Image dimensions for background
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = '/images/templetBackground.jpeg';
    img.onload = () => {
      setImageDimensions({ width: img.width, height: img.height });
    };
  }, []);

  // PDF Download functionality
  const downloadPDF = useCallback(async () => {
    try {
      const element = document.getElementById('resume-content');
      if (!element) return;

      const canvas = await html2canvas(element, { useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${userDetails?.name || 'resume'}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  }, [userDetails]);

  const [languageKnown, setLanguageKnow] = useState<string[]>([]);

  // Update resume - Save details in state and sessionStorage only
  const updateResume = async () => {
    if (!userDetails?.id) {
      toast.error('User not found. Please login first.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Update user details with language known
      const updatedUser: User = {
        ...userDetails,
        languageKnown: Array.isArray(languageKnown) ? languageKnown : (Array.isArray(userDetails.languageKnown) ? userDetails.languageKnown : [])
      };
      
      // Update state and sessionStorage
      setUserDetails(updatedUser);
      sessionStorage.setItem("resumeUser", JSON.stringify(updatedUser));
      
      setActiveModal(null);
      toast.success('Personal details saved successfully! 🎉');
      
    } catch (error) {
      console.error('Error saving details:', error);
      toast.error('Failed to save details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const [experienceDetails, setExperienceDetails] = useState({
    userId: "",
    organisationName: "",
    designation: "",
    jobType: "",
    type: "",
    country: "",
    state: "",
    joiningDate: "",
    leavingDate: "",
    isWorking: "",
    image: "",
  });

  const [licenceDetails, setLicenceDetails] = useState({
    licenceName: "",
    licenceImage: "",
  });

  const addResumeExperience = () => {
    if (!userDetails?.id) {
      toast.error('User not found. Please login first.');
      return;
    }

    if (!experienceForm.organisationName || !experienceForm.designation || !experienceForm.joiningDate) {
      toast.error('Please fill in all required fields (Organization, Designation, and Joining Date).');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create new experience object
      const newExperience: Experience = {
        ...experienceForm,
        id: Date.now().toString(),
        userId: userDetails.id,
        organisationName: experienceForm.organisationName || '',
        designation: experienceForm.designation || '',
        joiningDate: experienceForm.joiningDate || '',
        type: experienceForm.type || 'Domestic',
        isWorking: experienceForm.isWorking || false
      };
      
      // Update experiences list in state and sessionStorage
      const updatedExperiences = [...experiences, newExperience];
      setExperiences(updatedExperiences);
      sessionStorage.setItem("resumeExperience", JSON.stringify(updatedExperiences));
      
      // Reset form
      setExperienceForm({
        organisationName: '',
        designation: '',
        type: 'Domestic',
        joiningDate: '',
        isWorking: false
      });
      
      setActiveModal(null);
      toast.success('Work experience added successfully! 💼');
    } catch (error) {
      console.error('Error adding experience:', error);
      toast.error('Failed to add experience. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const addResumeLicence = () => {
    if (!userDetails?.id) {
      toast.error('User not found. Please login first.');
      return;
    }

    if (!licenseForm.licenceName?.trim()) {
      toast.error('Please enter license name.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create new license object
      const newLicense: License = {
        ...licenseForm,
        id: Date.now().toString(),
        userId: userDetails.id,
        licenceName: licenseForm.licenceName.trim()
      };
      
      // Update licenses list in state and sessionStorage
      const updatedLicenses = [...licenses, newLicense];
      setLicenses(updatedLicenses);
      sessionStorage.setItem("resumeLicence", JSON.stringify(updatedLicenses));
      
      // Reset form
      setLicenseForm({ licenceName: '' });
      
      setActiveModal(null);
      toast.success('License added successfully! 🏆');
    } catch (error) {
      console.error('Error adding license:', error);
      toast.error('Failed to add license. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassport = () => {
    if (!userDetails?.id) {
      toast.error('User not found. Please login first.');
      return;
    }

    if (!passportForm.passportNo?.trim()) {
      toast.error('Please enter passport number.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create new passport object
      const updatedPassport: Passport = {
        ...passportForm,
        id: Date.now().toString(),
        userId: userDetails.id,
        passportNo: passportForm.passportNo.trim(),
        passportCategory: passportForm.passportCategory || 'ECR',
        issueDate: passportForm.issueDate || '',
        expiryDate: passportForm.expiryDate || ''
      };
      
      // Update passport in state and sessionStorage
      setPassport(updatedPassport);
      sessionStorage.setItem("resumePassport", JSON.stringify([updatedPassport]));
      
      // Reset form
      setPassportForm({
        passportNo: '',
        passportCategory: 'ECR',
        issueDate: '',
        expiryDate: ''
      });
      
      setActiveModal(null);
      toast.success('Passport details saved successfully! 🛫');
    } catch (error) {
      console.error('Error saving passport details:', error);
      toast.error('Failed to save passport details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#10b981',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      <div className="">
        <div className="mt-5 pt-5">
          <div className="container mt-5 pt-5">
            <div className="row">
              <div className="col-lg-4">
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Resume Builder</h3>
                    <p className="text-gray-600">Build your professional resume step by step</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div
                      className="group bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border-2 border-purple-200 hover:border-purple-300 rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => setActiveModal('personal')}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                          <i className="fa fa-user text-white"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">Personal Details</h5>
                          <p className="text-sm text-gray-600">Basic information & profile</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="group bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200 hover:border-emerald-300 rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => setActiveModal('experience')}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                          <i className="fa fa-briefcase text-white"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">Work Experience</h5>
                          <p className="text-sm text-gray-600">Professional background</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="group bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-200 hover:border-blue-300 rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => setActiveModal('education')}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                          <i className="fa fa-graduation-cap text-white"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">Education</h5>
                          <p className="text-sm text-gray-600">Academic qualifications</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="group bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border-2 border-orange-200 hover:border-orange-300 rounded-xl p-4 cursor-pointer transition-all duration-200 transform hover:scale-[1.02]"
                      onClick={() => setActiveModal('address')}
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                          <i className="fa fa-map-marker-alt text-white"></i>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-800 mb-1">Address</h5>
                          <p className="text-sm text-gray-600">Contact information</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div
                        className="group bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 border-2 border-gray-200 hover:border-gray-300 rounded-xl p-4 cursor-pointer transition-all duration-200"
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl flex items-center justify-center mr-4">
                              <i className="fa fa-plus text-white"></i>
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-800">Additional Sections</h5>
                            </div>
                          </div>
                          <i className={`fa fa-chevron-${showMoreOptions ? 'up' : 'down'} text-gray-500 transition-transform duration-200`}></i>
                        </div>
                      </div>
                      {showMoreOptions && (
                        <div className="mt-3 space-y-2 pl-6">
                          <div
                            className="group bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border border-cyan-200 hover:border-cyan-300 rounded-lg p-3 cursor-pointer transition-all duration-200"
                            onClick={() => setActiveModal('passport')}
                          >
                            <div className="flex items-center">
                              <i className="fa fa-passport text-cyan-600 mr-3"></i>
                              <span className="text-sm font-medium text-gray-700">Passport Details</span>
                            </div>
                          </div>
                          <div
                            className="group bg-gradient-to-r from-yellow-50 to-orange-50 hover:from-yellow-100 hover:to-orange-100 border border-yellow-200 hover:border-yellow-300 rounded-lg p-3 cursor-pointer transition-all duration-200"
                            onClick={() => setActiveModal('license')}
                          >
                            <div className="flex items-center">
                              <i className="fa fa-certificate text-yellow-600 mr-3"></i>
                              <span className="text-sm font-medium text-gray-700">Licenses & Certificates</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] hover:shadow-xl flex items-center justify-center"
                      onClick={downloadPDF}
                    >
                      <i className="fa fa-download mr-3"></i>
                      Download Resume PDF
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden" id="resume-content">
                  {/* Modern Header Section */}
                  <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <img
                          className="w-32 h-32 rounded-full border-4 border-white/20 shadow-xl object-cover"
                          src={userDetails?.photo || '/images/default-avatar.png'}
                          alt={`${userDetails?.name || 'Profile'} Photo`}
                        />
                      </div>
                      <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2 text-white">
                          {userDetails?.name || 'Your Name'}
                        </h1>
                        <h2 className="text-xl text-blue-200 mb-4">
                          {userDetails?.profileTitle || 'Professional Title'}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-100">
                          {userDetails?.contact && (
                            <div className="flex items-center">
                              <i className="fa fa-phone mr-3 text-blue-300"></i>
                              <span>+91 {userDetails.contact}</span>
                            </div>
                          )}
                          {userDetails?.email && (
                            <div className="flex items-center">
                              <i className="fa fa-envelope mr-3 text-blue-300"></i>
                              <span>{userDetails.email}</span>
                            </div>
                          )}
                          {(userDetails?.village || userDetails?.district || userDetails?.state) && (
                            <div className="flex items-center md:col-span-2">
                              <i className="fa fa-map-marker-alt mr-3 text-blue-300"></i>
                              <span>
                                {[userDetails?.village, userDetails?.district, userDetails?.state]
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Content Sections */}
                  <div className="p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Left Column */}
                      <div className="lg:col-span-1 space-y-8">
                        {/* Personal Information */}
                        {(userDetails?.dob || userDetails?.gender || userDetails?.maritalStatus) && (
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <i className="fa fa-user text-white text-sm"></i>
                              </div>
                              Personal Information
                            </h3>
                            <div className="space-y-3 text-gray-700">
                              {userDetails?.dob && (
                                <div className="flex justify-between">
                                  <span className="font-medium">Date of Birth:</span>
                                  <span>{userDetails.dob}</span>
                                </div>
                              )}
                              {userDetails?.gender && (
                                <div className="flex justify-between">
                                  <span className="font-medium">Gender:</span>
                                  <span>{userDetails.gender}</span>
                                </div>
                              )}
                              {userDetails?.maritalStatus && (
                                <div className="flex justify-between">
                                  <span className="font-medium">Marital Status:</span>
                                  <span>{userDetails.maritalStatus}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Languages */}
                        {(Array.isArray(userDetails?.languageKnown) && userDetails?.languageKnown.length > 0) && (
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                                <i className="fa fa-language text-white text-sm"></i>
                              </div>
                              Languages
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              {userDetails.languageKnown.map((lang, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1 bg-blue-100 text-green-800 rounded-full text-sm font-medium"
                                >
                                  {lang}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Education */}
                        {(userDetails?.highEdu || userDetails?.techEdu) && (
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                                <i className="fa fa-graduation-cap text-white text-sm"></i>
                              </div>
                              Education
                            </h3>
                            <div className="space-y-4">
                              {userDetails?.highEdu && (
                                <div className="border-l-4 border-indigo-200 pl-4">
                                  <h4 className="font-semibold text-gray-800">{userDetails.highEdu}</h4>
                                  {userDetails?.highEduYear && (
                                    <p className="text-sm text-gray-600 mt-1">{userDetails.highEduYear}</p>
                                  )}
                                </div>
                              )}
                              {userDetails?.techEdu && (
                                <div className="border-l-4 border-green-200 pl-4">
                                  <h4 className="font-semibold text-gray-800">{userDetails.techEdu}</h4>
                                  {userDetails?.techEduYear && (
                                    <p className="text-sm text-gray-600 mt-1">{userDetails.techEduYear}</p>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Licenses & Certifications */}
                        {licenses && licenses.length > 0 && (
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                              <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center mr-3">
                                <i className="fa fa-certificate text-white text-sm"></i>
                              </div>
                              Licenses & Certifications
                            </h3>
                            <div className="space-y-2">
                              {licenses.map((license, index) => (
                                <div key={index} className="flex items-center">
                                  <i className="fa fa-award text-yellow-600 mr-2 text-sm"></i>
                                  <span className="text-gray-700">{license.licenceName}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Column */}
                      <div className="lg:col-span-2 space-y-8">
                        {/* Professional Experience */}
                        {experiences && experiences.length > 0 && (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
                                <i className="fa fa-briefcase text-white"></i>
                              </div>
                              Professional Experience
                            </h3>
                            <div className="space-y-6">
                              {experiences.map((exp, index) => (
                                <div key={index} className="relative">
                                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-500">
                                    <div className="flex justify-between items-start mb-3">
                                      <div>
                                        <h4 className="text-xl font-bold text-gray-800">{exp.organisationName}</h4>
                                        <h5 className="text-lg font-semibold text-blue-600">{exp.designation}</h5>
                                      </div>
                                      <div className="text-right">
                                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                          {exp.type}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center text-gray-600 mb-2">
                                      <i className="fa fa-calendar mr-2 text-blue-500"></i>
                                      <span>
                                        {exp.joiningDate} - {exp.isWorking ? 'Present' : exp.leavingDate || 'N/A'}
                                        {exp.duration && ` (${exp.duration})`}
                                      </span>
                                    </div>
                                    <div className="flex items-center text-gray-600">
                                      <i className="fa fa-map-marker-alt mr-2 text-blue-500"></i>
                                      <span>{exp.country || exp.state || 'Location not specified'}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Passport Information */}
                        {passport && (
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                              <div className="w-10 h-10 bg-cyan-600 rounded-lg flex items-center justify-center mr-4">
                                <i className="fa fa-passport text-white"></i>
                              </div>
                              Passport Information
                            </h3>
                            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border-l-4 border-cyan-500">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="font-semibold text-gray-700">Passport Number:</span>
                                  <p className="text-gray-600 mt-1">{passport.passportNo}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Category:</span>
                                  <p className="text-gray-600 mt-1">
                                    <span className="inline-block px-2 py-1 bg-cyan-100 text-cyan-800 rounded text-sm">
                                      {passport.passportCategory}
                                    </span>
                                  </p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Issue Date:</span>
                                  <p className="text-gray-600 mt-1">{passport.issueDate}</p>
                                </div>
                                <div>
                                  <span className="font-semibold text-gray-700">Expiry Date:</span>
                                  <p className="text-gray-600 mt-1">{passport.expiryDate}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Render ResumeBuilderModals */}
        <ResumeBuilderModals
          activeModal={activeModal}
          setActiveModal={setActiveModal}
          userDetails={userDetails}
          setUserDetails={setUserDetails}
          experiences={experiences}
          setExperiences={setExperiences}
          passport={passport}
          setPassport={setPassport}
          licenses={licenses}
          setLicenses={setLicenses}
          experienceForm={experienceForm}
          setExperienceForm={setExperienceForm}
          passportForm={passportForm}
          setPassportForm={setPassportForm}
          licenseForm={licenseForm}
          setLicenseForm={setLicenseForm}
          languageOptions={languageOptions}
          languageKnown={languageKnown}
          setLanguageKnown={setLanguageKnow}
          EDUCATION_LEVELS={EDUCATION_LEVELS}
          TECHNICAL_EDUCATION={TECHNICAL_EDUCATION}
          isLoading={isLoading}
          sendOtp={() => {}} // No longer used - keeping for compatibility
          verifyOtp={() => {}} // No longer used - keeping for compatibility
          updateResume={updateResume}
          addResumeExperience={addResumeExperience}
          addResumeLicence={addResumeLicence}
          handleUpdatePassport={handleUpdatePassport}
        />
      </div>
    </>
  );
}
