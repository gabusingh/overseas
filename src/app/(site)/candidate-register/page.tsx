"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Eye, EyeOff, User, Phone, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Head from "next/head";
import { setStoredUser } from "@/lib/auth";
import { useGlobalState } from "@/contexts/GlobalProvider";

export default function CandidateRegisterPage() {
  const router = useRouter();
  const { setUserData } = useGlobalState();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    otp: ""
  });

  const validateForm = () => {
    const newErrors = {
      name: "",
      mobile: "",
      password: "",
      confirmPassword: "",
      otp: ""
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters long";
    }

    // Mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^\\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be 10 digits";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    
    // Reset user already exists state when mobile number changes
    if (field === 'mobile') {
      setUserAlreadyExists(false);
    }
  };

  const handleSendOtp = async () => {
    // Validate only required fields for OTP
    if (!formData.name.trim() || !formData.mobile || !formData.password || !formData.confirmPassword) {
      toast.error("Please fill all required fields before sending OTP");
      return;
    }

    if (!validateForm()) {
      toast.error("Please correct the errors before sending OTP");
      return;
    }

    setIsLoading(true);
    setUserAlreadyExists(false); // Reset user already exists state
    try {
      const response = await fetch("/api/auth/send-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empPhone: formData.mobile,
          empName: formData.name
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setIsOtpSent(true);
        toast.success("OTP sent successfully to your mobile number");
      } else {
        const serverMessage = data.message || "Failed to send OTP";
        const isAlreadyRegistered = /already\s*registered|exists?/i.test(serverMessage);

        if (isAlreadyRegistered) {
          console.log('Number appears registered; trying login OTP as fallback...');
          try {
            const { loginUsingOtp } = await import('@/services/user.service');
            const loginResponse = await loginUsingOtp({ empPhone: formData.mobile });
            if (loginResponse?.data?.success || loginResponse?.data?.status === 'success') {
              setIsOtpSent(true);
              setUserAlreadyExists(true);
              toast.warning("This mobile number is already registered. OTP sent for login. Please use the login page instead of registration.");
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
      const response = await fetch("/api/auth/register-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          empName: formData.name,
          empPhone: formData.mobile,
          password: formData.password,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        // Store user data using the proper auth library
        setStoredUser(data.user, data.access_token);
        
        // Update global state
        await setUserData();
        
        toast.success("Registration successful! Welcome to Overseas.ai");
        
        setTimeout(() => {
          router.push("/my-profile");
        }, 1000);
      } else {
        const errorMessage = data.error || "Registration failed";
        // Check if it's an "already registered" error
        const isAlreadyRegistered = /already\s*registered/i.test(errorMessage.toLowerCase());
        
        if (isAlreadyRegistered) {
          toast.error(errorMessage);
          // Redirect to login page after showing the error
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        } else {
          toast.error(errorMessage);
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Register as Job Seeker - Find Overseas Jobs | Overseas.ai</title>
        <meta name="description" content="Create your account to access thousands of overseas job opportunities. Register as a job seeker and start your international career journey." />
        <meta name="keywords" content="register job seeker, overseas jobs registration, international jobs signup" />
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
                    src="https://cdn-icons-png.flaticon.com/256/8662/8662443.png"
                    className="max-h-80 w-auto"
                    alt="Job Seeker Registration"
                  />
                </div>

                {/* Right side - Form */}
                <div className="flex items-center justify-center">
                  <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-6">
                      <h3 className="text-2xl font-bold text-[#17487f] mb-6 text-center">
                        <i className="fa fa-user mr-2"></i>
                        Job Seeker Register
                      </h3>
                      
                      {/* Full Name */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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
                          {userAlreadyExists && (
                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                              <div className="flex items-center">
                                <i className="fa fa-exclamation-triangle text-yellow-600 mr-2"></i>
                                <div className="text-sm text-yellow-800">
                                  <p className="font-medium">Account Already Exists</p>
                                  <p>This mobile number is already registered. You can verify the OTP to proceed, but we recommend using the <button type="button" onClick={() => router.push("/login")} className="text-blue-600 hover:text-blue-800 underline">login page</button> instead.</p>
                                </div>
                              </div>
                            </div>
                          )}
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
                                  Creating Account...
                                </div>
                              ) : (
                                "Create Account"
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
