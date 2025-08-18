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

export default function CandidateRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
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
        localStorage.setItem("loggedUser", JSON.stringify(data));
        localStorage.setItem("access_token", data.access_token);
        toast.success("Registration successful! Welcome to Overseas.ai");
        
        setTimeout(() => {
          router.push("/my-profile");
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
        <title>Register as Job Seeker - Find Overseas Jobs | Overseas.ai</title>
        <meta name="description" content="Create your account to access thousands of overseas job opportunities. Register as a job seeker and start your international career journey." />
        <meta name="keywords" content="register job seeker, overseas jobs registration, international jobs signup" />
      </Head>
      
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-8"
        style={{ backgroundImage: "url(/images/logoBg.jpg)" }}
      >
        <Card className="w-full max-w-lg shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-full"
              onClick={() => router.push("/")}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <CardTitle className="text-center text-xl font-semibold text-gray-800">
              Create Your Account
            </CardTitle>
            <p className="text-center text-sm text-gray-600 mt-2">
              Register as Job Seeker to find overseas opportunities
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex">
                  <select className="px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 rounded-l-md focus:outline-none">
                    <option value="">+91</option>
                  </select>
                  <div className="relative flex-1">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange("mobile", e.target.value)}
                      className="rounded-l-none pl-10"
                      maxLength={10}
                    />
                  </div>
                </div>
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 h-auto"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0 h-auto"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Send OTP Button */}
              {!isOtpSent && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-[#17487f] text-[#17487f] hover:bg-[#17487f] hover:text-white"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading ? "Sending OTP..." : "Send OTP to Mobile"}
                </Button>
              )}

              {/* OTP Input */}
              {isOtpSent && (
                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={formData.otp}
                    onChange={(e) => handleInputChange("otp", e.target.value)}
                    maxLength={6}
                  />
                  {errors.otp && <p className="text-red-500 text-xs mt-1">{errors.otp}</p>}
                  
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-sm p-0 h-auto mt-2 text-[#17487f]"
                  >
                    Resend OTP
                  </Button>
                </div>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-[#17487f] hover:bg-[#135a8a]" 
                disabled={isLoading || !isOtpSent}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>

              <Separator className="my-4" />

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#17487f] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Other Registration Types */}
              <div className="text-center text-sm text-gray-600 space-y-1">
                <p>Register as:</p>
                <div className="space-y-1">
                  <Link href="/employer-signup" className="block text-[#17487f] hover:underline font-medium">
                    Employer/Company
                  </Link>
                  <Link href="/institute-signup" className="block text-[#17487f] hover:underline font-medium">
                    Training Institute
                  </Link>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
