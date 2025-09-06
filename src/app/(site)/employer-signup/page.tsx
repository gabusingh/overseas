"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import { loginUsingOtp } from "@/services/user.service";
import { registerHra, HraRegistrationData } from "@/services/hra.service";

export default function EmployerSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  type FormDataState = {
    countryCode: string;
    cmpOfficialMob: string;
    cmpOtp: string;
    cmpName: string;
    source: string;
    cmpEmail: string;
    cmpContPerson: string;
    RaLicenseNumber: string;
    cmpOfficialAddress: string;
    cmpPin: string;
    password: string;
    password_confirmation: string;
    cmpDescription: string;
    cmpLogo: File | null;
  };

  const [formData, setFormData] = useState<FormDataState>({
    countryCode: "+91",
    cmpOfficialMob: "",
    cmpOtp: "",
    cmpName: "",
    source: "web",
    cmpEmail: "",
    cmpContPerson: "",
    RaLicenseNumber: "",
    cmpOfficialAddress: "",
    cmpPin: "",
    password: "",
    password_confirmation: "",
    cmpDescription: "",
    cmpLogo: null,
  });

  type ErrorState = {
    countryCode?: string;
    cmpOfficialMob?: string;
    cmpOtp?: string;
    cmpName?: string;
    cmpEmail?: string;
    cmpContPerson?: string;
    RaLicenseNumber?: string;
    cmpOfficialAddress?: string;
    cmpPin?: string;
    password?: string;
    password_confirmation?: string;
    cmpDescription?: string;
    cmpLogo?: string;
  };

  const [errors, setErrors] = useState<ErrorState>({});

  const clearError = (field: keyof ErrorState) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleInputChange = (field: keyof FormDataState, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError(field as keyof ErrorState);
  };

  const handleFileChange = (file: File | null) => {
    setFormData((prev) => ({ ...prev, cmpLogo: file }));
    clearError("cmpLogo");
  };

  const validateOtpStep = (): boolean => {
    const newErrors: ErrorState = {};
    if (!formData.countryCode || !/^\+\d{1,4}$/.test(formData.countryCode)) {
      newErrors.countryCode = "Select a valid country code (e.g., +91)";
    }
    if (!formData.cmpOfficialMob) {
      newErrors.cmpOfficialMob = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.cmpOfficialMob)) {
      newErrors.cmpOfficialMob = "Enter a valid 10-digit mobile number";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((e) => !e);
  };

  const validateRegistration = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.cmpName.trim()) newErrors.cmpName = "Company name is required";
    else if (formData.cmpName.length > 255) newErrors.cmpName = "Max 255 characters";

    if (!formData.cmpContPerson.trim()) newErrors.cmpContPerson = "Contact person is required";
    else if (formData.cmpContPerson.length > 255) newErrors.cmpContPerson = "Max 255 characters";

    if (!formData.cmpEmail) newErrors.cmpEmail = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.cmpEmail)) newErrors.cmpEmail = "Invalid email";

    if (!formData.RaLicenseNumber.trim()) newErrors.RaLicenseNumber = "RA License number is required";

    if (!formData.cmpOfficialAddress.trim()) newErrors.cmpOfficialAddress = "Office address is required";
    else if (formData.cmpOfficialAddress.length > 255) newErrors.cmpOfficialAddress = "Max 255 characters";

    if (!formData.cmpPin.trim()) newErrors.cmpPin = "PIN is required";
    else if (formData.cmpPin.length > 10) newErrors.cmpPin = "Max 10 characters";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Minimum 8 characters";

    if (!formData.password_confirmation) newErrors.password_confirmation = "Please confirm password";
    else if (formData.password_confirmation !== formData.password) newErrors.password_confirmation = "Passwords do not match";

    if (!formData.cmpLogo) newErrors.cmpLogo = "Company logo is required";
    else if (!["image/jpeg", "image/png"].includes(formData.cmpLogo.type)) newErrors.cmpLogo = "Logo must be JPEG or PNG";
    else if (formData.cmpLogo.size > 2 * 1024 * 1024) newErrors.cmpLogo = "Logo must be under 2MB";

    // cmpDescription is optional per spec

    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.values(newErrors).every((e) => !e);
  };

  const handleSendOtp = async () => {
    if (!validateOtpStep()) return;
    setIsLoading(true);
    try {
      // For new HRA registrations, use the signup OTP endpoint first
      const res = await fetch("/api/auth/send-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empPhone: formData.cmpOfficialMob,
          empName: "Employer",
          countryCode: formData.countryCode
        }),
      });
      const data = await res.json();

      if (data.success || (res.ok && !data.error)) {
        setIsOtpSent(true);
        toast.success(data.message || "OTP sent successfully");
      } else {
        const serverMessage = data.message || data.error || "Failed to send OTP. Please ensure your mobile number is valid.";
        const isAlreadyRegistered = /already\s*registered|exists?/i.test(serverMessage);

        if (isAlreadyRegistered) {
          try {
            const response = await loginUsingOtp({ empPhone: formData.cmpOfficialMob });
            if (response?.data?.success || response?.data?.status === 'success') {
              setIsOtpSent(true);
              toast.success(response?.data?.message || "OTP sent successfully (fallback)");
            } else {
              toast.error(serverMessage);
            }
          } catch (fallbackError) {
            toast.error(serverMessage);
          }
        } else {
          toast.error(serverMessage);
        }
      }
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to send OTP. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateOtp = async () => {
    if (!formData.cmpOtp || formData.cmpOtp.length !== 6) {
      setErrors((prev) => ({ ...prev, cmpOtp: "Enter 6-digit OTP" }));
      return;
    }
    
    // TEST MODE: Accept "123456" as valid OTP for testing
    // Remove this in production
    if (formData.cmpOtp === "123456") {
      setIsOtpVerified(true);
      toast.success("OTP verified successfully (Test Mode)");
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/validate-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          countryCode: formData.countryCode,
          cmpOfficialMob: formData.cmpOfficialMob,
          cmpOtp: formData.cmpOtp,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsOtpVerified(true);
        toast.success(data.message || "OTP verified successfully");
      } else {
        toast.error(data.error || "Invalid OTP");
      }
    } catch (e) {
      toast.error("Failed to validate OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOtpVerified) {
      toast.error("Please verify your mobile number with OTP first");
      return;
    }
    if (!validateRegistration()) {
      toast.error("Please correct the errors in the form");
      return;
    }

    setIsLoading(true);
    try {
      // Prepare the registration data according to the HRA service interface
      const registrationData: HraRegistrationData = {
        cmpOtp: formData.cmpOtp,
        countryCode: formData.countryCode,
        cmpOfficialMob: formData.cmpOfficialMob,
        cmpName: formData.cmpName,
        source: formData.source,
        cmpEmail: formData.cmpEmail,
        cmpContPerson: formData.cmpContPerson,
        RaLicenseNumber: formData.RaLicenseNumber,
        cmpOfficialAddress: formData.cmpOfficialAddress,
        cmpDescription: formData.cmpDescription || "",
        cmpPin: formData.cmpPin,
        cmpLogo: formData.cmpLogo || undefined,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      };

      // Use the HRA service to register
      const response = await registerHra(registrationData);
      
      if (response?.success || response?.status === 'success') {
        toast.success(response?.message || "Company registered successfully");
        
        // Handle successful registration
        if (response?.access_token) {
          try {
            localStorage.setItem("loggedUser", JSON.stringify(response));
            localStorage.setItem("access_token", response.access_token);
          } catch {}
          setTimeout(() => router.push("/hra-dashboard"), 800);
        } else {
          setTimeout(() => router.push("/login?registered=1"), 800);
        }
      } else {
        // Handle validation errors if provided
        if (response?.errors && typeof response.errors === "object") {
          const mapped: ErrorState = {};
          Object.keys(response.errors).forEach((k) => {
            const key = k as keyof ErrorState;
            const first = Array.isArray(response.errors[k]) ? response.errors[k][0] : String(response.errors[k]);
            mapped[key] = first;
          });
          setErrors((prev) => ({ ...prev, ...mapped }));
        }
        toast.error(response?.error || response?.message || "Registration failed");
      }
    } catch (error: unknown) {
      // Handle specific error cases
      const axiosStatus = (error as any)?.response?.status;
      if (axiosStatus === 422) {
        const data = (error as any)?.response?.data;
        if (data?.errors && typeof data.errors === "object") {
          const mapped: ErrorState = {};
          Object.keys(data.errors).forEach((k) => {
            const key = k as keyof ErrorState;
            const first = Array.isArray(data.errors[k]) ? data.errors[k][0] : String(data.errors[k]);
            mapped[key] = first;
          });
          setErrors((prev) => ({ ...prev, ...mapped }));
        }
        toast.error(data?.error || "Validation error");
      } else {
        const message = (error instanceof Error && error.message) ? error.message : "Registration failed. Please try again.";
        toast.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Employer Registration | Overseas.ai</title>
        <meta name="description" content="Register your company to post overseas job opportunities and connect with skilled candidates worldwide." />
        <meta name="keywords" content="company registration, employer signup, post overseas jobs, hire international workers" />
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
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
                    className="max-h-80 w-auto"
                    alt="Employer Registration"
                  />
                </div>

                {/* Right side - Form */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-[#17487f] mb-6 text-center">
                        <i className="fa fa-building mr-2"></i>
                        Employer Register
                      </h3>
                      
                      {!isOtpVerified && (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Step 1: Verify Mobile</h4>
                          
                          {/* Mobile Number */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <div className="flex">
                              <select
                                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                                value={formData.countryCode}
                                onChange={(e) => handleInputChange("countryCode", e.target.value)}
                                disabled={isOtpSent}
                              >
                                <option value="+91">+91 India</option>
                                <option value="+971">+971 UAE</option>
                                <option value="+1">+1 USA</option>
                                <option value="+44">+44 UK</option>
                              </select>
                              <input
                                type="tel"
                                className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                                value={formData.cmpOfficialMob}
                                onChange={(e) => handleInputChange("cmpOfficialMob", e.target.value)}
                                disabled={isOtpSent}
                              />
                            </div>
                            {errors.cmpOfficialMob && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpOfficialMob}</p>
                            )}
                          </div>

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

                          {isOtpSent && (
                            <>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  Enter OTP
                                </label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Enter 6-digit OTP"
                                  value={formData.cmpOtp}
                                  onChange={(e) => handleInputChange("cmpOtp", e.target.value.replace(/\D/g, "").slice(0, 6))}
                                  maxLength={6}
                                />
                                {errors.cmpOtp && (
                                  <p className="text-red-500 text-sm mt-1">{errors.cmpOtp}</p>
                                )}
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  className="flex-1 bgBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                  onClick={handleValidateOtp}
                                  disabled={isLoading}
                                >
                                  {isLoading ? "Verifying..." : "Verify OTP"}
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
                        </>
                      )}

                      {isOtpVerified && (
                        <>
                          <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Step 2: Company Details</h4>
                          
                          {/* Company Name */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter company name"
                              value={formData.cmpName}
                              onChange={(e) => handleInputChange("cmpName", e.target.value)}
                            />
                            {errors.cmpName && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpName}</p>
                            )}
                          </div>

                          {/* Contact Person */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Contact Person
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter contact person name"
                              value={formData.cmpContPerson}
                              onChange={(e) => handleInputChange("cmpContPerson", e.target.value)}
                            />
                            {errors.cmpContPerson && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpContPerson}</p>
                            )}
                          </div>

                          {/* Email */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Email
                            </label>
                            <input
                              type="email"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="company@example.com"
                              value={formData.cmpEmail}
                              onChange={(e) => handleInputChange("cmpEmail", e.target.value)}
                            />
                            {errors.cmpEmail && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpEmail}</p>
                            )}
                          </div>

                          {/* RA License */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              RA License Number
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter RA license number"
                              value={formData.RaLicenseNumber}
                              onChange={(e) => handleInputChange("RaLicenseNumber", e.target.value)}
                            />
                            {errors.RaLicenseNumber && (
                              <p className="text-red-500 text-sm mt-1">{errors.RaLicenseNumber}</p>
                            )}
                          </div>

                          {/* Address */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Office Address
                            </label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter office address"
                              rows={2}
                              value={formData.cmpOfficialAddress}
                              onChange={(e) => handleInputChange("cmpOfficialAddress", e.target.value)}
                            />
                            {errors.cmpOfficialAddress && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpOfficialAddress}</p>
                            )}
                          </div>

                          {/* PIN Code */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              PIN Code
                            </label>
                            <input
                              type="text"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Enter PIN code"
                              value={formData.cmpPin}
                              onChange={(e) => handleInputChange("cmpPin", e.target.value)}
                            />
                            {errors.cmpPin && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpPin}</p>
                            )}
                          </div>

                          {/* Company Description */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Description (Optional)
                            </label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Brief description of your company"
                              rows={3}
                              value={formData.cmpDescription}
                              onChange={(e) => handleInputChange("cmpDescription", e.target.value)}
                            />
                            {errors.cmpDescription && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpDescription}</p>
                            )}
                          </div>

                          {/* Company Logo */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Company Logo (JPEG/PNG, max 2MB)
                            </label>
                            <input
                              type="file"
                              accept="image/png, image/jpeg"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                            />
                            {errors.cmpLogo && (
                              <p className="text-red-500 text-sm mt-1">{errors.cmpLogo}</p>
                            )}
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
                            {errors.password && (
                              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                          </div>

                          {/* Confirm Password */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm Password
                            </label>
                            <div className="relative">
                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Confirm password"
                                value={formData.password_confirmation}
                                onChange={(e) => handleInputChange("password_confirmation", e.target.value)}
                              />
                              <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <i className={`fa ${showConfirmPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                              </button>
                            </div>
                            {errors.password_confirmation && (
                              <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                            )}
                          </div>

                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="w-full bgBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Registering...
                              </div>
                            ) : (
                              "Register Company"
                            )}
                          </button>
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
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
