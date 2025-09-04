"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import Link from "next/link";

export default function InstituteSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    instituteName: "",
    directorName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    establishedYear: "",
    registrationNumber: "",
    affiliations: "",
    description: "",
    otp: ""
  });

  const [errors, setErrors] = useState({
    instituteName: "",
    directorName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    website: "",
    address: "",
    city: "",
    state: "",
    establishedYear: "",
    registrationNumber: "",
    affiliations: "",
    description: "",
    otp: ""
  });

  const validateForm = () => {
    const newErrors = { ...errors };
    
    // Reset all errors
    Object.keys(newErrors).forEach(key => {
      newErrors[key as keyof typeof newErrors] = "";
    });

    // Institute name validation
    if (!formData.instituteName.trim()) {
      newErrors.instituteName = "Institute name is required";
    } else if (formData.instituteName.trim().length < 3) {
      newErrors.instituteName = "Institute name must be at least 3 characters long";
    }

    // Director name validation
    if (!formData.directorName.trim()) {
      newErrors.directorName = "Director/Principal name is required";
    } else if (formData.directorName.trim().length < 2) {
      newErrors.directorName = "Director name must be at least 2 characters long";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Website validation (optional but format check)
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://";
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    // State validation
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }

    // Established year validation
    if (!formData.establishedYear) {
      newErrors.establishedYear = "Established year is required";
    } else {
      const year = parseInt(formData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.establishedYear = "Please enter a valid year";
      }
    }

    // Registration number validation
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration number is required";
    }

    // Affiliations validation
    if (!formData.affiliations.trim()) {
      newErrors.affiliations = "Affiliations/Certifications are required";
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Institute description is required";
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Institute description must be at least 50 characters long";
    }

    // OTP validation (if OTP is sent)
    if (isOtpSent && !formData.otp) {
      newErrors.otp = "OTP is required";
    } else if (isOtpSent && formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSendOtp = async () => {
    // Validate required fields for OTP
    const requiredFields = ['instituteName', 'directorName', 'email', 'mobile', 'password', 'confirmPassword', 'address', 'city', 'state', 'establishedYear', 'registrationNumber', 'affiliations', 'description'];
    const hasRequiredFields = requiredFields.every(field => formData[field as keyof typeof formData].toString().trim() !== '');
    
    if (!hasRequiredFields) {
      toast.error("Please fill all required fields before sending OTP");
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the errors before sending OTP");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/send-institute-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instituteName: formData.instituteName,
          contactPhone: formData.mobile,
          email: formData.email
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsOtpSent(true);
        toast.success("OTP sent successfully to your mobile number");
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    if (!isOtpSent) {
      toast.error("Please verify your mobile number with OTP first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/register-institute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instituteName: formData.instituteName,
          directorName: formData.directorName,
          email: formData.email,
          phone: formData.mobile,
          password: formData.password,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          establishedYear: formData.establishedYear,
          registrationNumber: formData.registrationNumber,
          affiliations: formData.affiliations,
          description: formData.description,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("loggedUser", JSON.stringify(data));
        localStorage.setItem("access_token", data.access_token);
        toast.success("Institute registration successful! Welcome to Overseas.ai");
        
        setTimeout(() => {
          router.push("/institute-dashboard");
        }, 1000);
      } else {
        toast.error(data.error || "Registration failed");
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register Your Training Institute - Overseas Skills Training | Overseas.ai</title>
        <meta name="description" content="Register your training institute to offer overseas skill development courses and connect with aspiring overseas workers." />
        <meta name="keywords" content="institute registration, training institute signup, overseas skills training, vocational training" />
      </Head>
      
      <div
        className="min-h-screen"
        style={{
          background: "url(https://www.bacancytechnology.com/main/img/job-recruitment-portal-development/banner.jpg?v-1)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="pt-20 pb-10">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center min-h-screen py-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-6xl">
                
                {/* Left side - Image */}
                <div className="hidden lg:flex items-center justify-center">
                  <img
                    src="https://cdn-icons-png.flaticon.com/256/3330/3330380.png"
                    className="max-h-80 w-auto"
                    alt="Institute Registration"
                  />
                </div>

                {/* Right side - Form */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-lg">
                    <div className="bg-white shadow-xl rounded-lg border border-gray-100">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-[#17487f] to-[#1e5fa3] px-6 py-4 rounded-t-lg">
                        <h3 className="text-xl font-bold text-white text-center">
                          <i className="fa fa-graduation-cap mr-2"></i>
                          Training Institute Register
                        </h3>
                        <p className="text-blue-100 text-center text-xs mt-1">
                          Join our network of certified training providers
                        </p>
                      </div>
                      
                      {/* Scrollable Form Content */}
                      <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                        <form onSubmit={handleSubmit} className="p-6 space-y-3">
                          {/* Institute Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institute Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter institute name"
                          value={formData.instituteName}
                          onChange={(e) => handleInputChange("instituteName", e.target.value)}
                        />
                        {errors.instituteName && <p className="text-red-500 text-sm mt-1">{errors.instituteName}</p>}
                      </div>

                      {/* Director Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Director/Principal Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter director name"
                          value={formData.directorName}
                          onChange={(e) => handleInputChange("directorName", e.target.value)}
                        />
                        {errors.directorName && <p className="text-red-500 text-sm mt-1">{errors.directorName}</p>}
                      </div>

                      {/* Email */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>

                      {/* Phone Number */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="flex">
                          <select
                            className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                          >
                            <option value="+91">+91 India</option>
                          </select>
                          <input
                            type="tel"
                            className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter phone number"
                            value={formData.mobile}
                            onChange={(e) => handleInputChange("mobile", e.target.value)}
                            maxLength={10}
                          />
                        </div>
                        {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                      </div>

                      {/* Password */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                      </div>

                      {/* Confirm Password */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                      </div>

                      {/* Website (Optional) */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Website (Optional)
                        </label>
                        <input
                          type="url"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://www.institute.com"
                          value={formData.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                        {errors.website && <p className="text-red-500 text-sm mt-1">{errors.website}</p>}
                      </div>

                      {/* Address */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter complete address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          rows={2}
                        />
                        {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                      </div>

                      {/* City and State */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="City"
                            value={formData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                          />
                          {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="State"
                            value={formData.state}
                            onChange={(e) => handleInputChange("state", e.target.value)}
                          />
                          {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                        </div>
                      </div>

                      {/* Established Year and Registration Number */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Established Year
                          </label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 2010"
                            min="1900"
                            max={new Date().getFullYear()}
                            value={formData.establishedYear}
                            onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                          />
                          {errors.establishedYear && <p className="text-red-500 text-sm mt-1">{errors.establishedYear}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Registration number"
                            value={formData.registrationNumber}
                            onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                          />
                          {errors.registrationNumber && <p className="text-red-500 text-sm mt-1">{errors.registrationNumber}</p>}
                        </div>
                      </div>

                      {/* Affiliations */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Affiliations/Certifications
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="List affiliations and certifications"
                          value={formData.affiliations}
                          onChange={(e) => handleInputChange("affiliations", e.target.value)}
                          rows={2}
                        />
                        {errors.affiliations && <p className="text-red-500 text-sm mt-1">{errors.affiliations}</p>}
                      </div>

                      {/* Description */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Institute Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Describe your institute (minimum 50 characters)"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={3}
                        />
                        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                      </div>

                      {/* Send OTP Button */}
                      {!isOtpSent && (
                        <button
                          type="button"
                          className="w-full bgBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          onClick={handleSendOtp}
                          disabled={isLoading}
                        >
                          {isLoading ? "Sending OTP..." : "Send OTP"}
                        </button>
                      )}

                      {/* OTP Input */}
                      {isOtpSent && (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Enter OTP
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-lg tracking-widest"
                              placeholder="Enter 6-digit OTP"
                              value={formData.otp}
                              onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                              maxLength={6}
                            />
                            {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}
                          </div>

                          <div className="flex gap-2 mb-4">
                            <button
                              type="submit"
                              className="flex-1 bgBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <div className="flex items-center justify-center">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Registering...
                                </div>
                              ) : (
                                "Register Institute"
                              )}
                            </button>
                            <button
                              type="button"
                              className="text-blue-600 hover:text-blue-800 font-medium"
                              onClick={handleSendOtp}
                              disabled={isLoading}
                            >
                              Resend OTP
                            </button>
                          </div>
                        </>
                      )}

                      {/* Login Link */}
                      <p className="mt-4 text-center text-sm text-gray-600">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={() => router.push("/login")}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Login
                        </button>
                      </p>

                      {/* Other Registration Types */}
                      <div className="mt-4 text-center text-sm text-gray-600">
                        <p>Register as:</p>
                        <div className="mt-2 space-y-1">
                          <Link href="/candidate-register" className="block text-blue-600 hover:text-blue-800 font-medium">
                            Job Seeker
                          </Link>
                          <Link href="/employer-signup" className="block text-blue-600 hover:text-blue-800 font-medium">
                            Employer/Company
                          </Link>
                          <Link href="/partner-signup" className="block text-blue-600 hover:text-blue-800 font-medium">
                            Business Partner
                          </Link>
                        </div>
                      </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </>
  );
}
