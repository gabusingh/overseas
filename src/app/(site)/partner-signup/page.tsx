"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { X, Eye, EyeOff, UserPlus, Phone, Lock, Mail, MapPin, Globe, Building, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Head from "next/head";

export default function PartnerSignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    businessName: "",
    contactPerson: "",
    designation: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    businessType: "",
    serviceAreas: "",
    experience: "",
    description: "",
    otp: ""
  });

  const [errors, setErrors] = useState({
    businessName: "",
    contactPerson: "",
    designation: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    website: "",
    address: "",
    city: "",
    state: "",
    businessType: "",
    serviceAreas: "",
    experience: "",
    description: "",
    otp: ""
  });

  const validateForm = () => {
    const newErrors = { ...errors };
    
    // Reset all errors
    Object.keys(newErrors).forEach(key => {
      newErrors[key as keyof typeof newErrors] = "";
    });

    // Business name validation
    if (!formData.businessName.trim()) {
      newErrors.businessName = "Business name is required";
    } else if (formData.businessName.trim().length < 3) {
      newErrors.businessName = "Business name must be at least 3 characters long";
    }

    // Contact person validation
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person name is required";
    } else if (formData.contactPerson.trim().length < 2) {
      newErrors.contactPerson = "Contact person name must be at least 2 characters long";
    }

    // Designation validation
    if (!formData.designation.trim()) {
      newErrors.designation = "Designation is required";
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

    // Business type validation
    if (!formData.businessType.trim()) {
      newErrors.businessType = "Business type is required";
    }

    // Service areas validation
    if (!formData.serviceAreas.trim()) {
      newErrors.serviceAreas = "Service areas are required";
    }

    // Experience validation
    if (!formData.experience.trim()) {
      newErrors.experience = "Years of experience is required";
    } else {
      const exp = parseInt(formData.experience);
      if (isNaN(exp) || exp < 0 || exp > 100) {
        newErrors.experience = "Please enter valid years of experience (0-100)";
      }
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Business description is required";
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Business description must be at least 50 characters long";
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
    const requiredFields = ['businessName', 'contactPerson', 'designation', 'email', 'mobile', 'password', 'confirmPassword', 'address', 'city', 'state', 'businessType', 'serviceAreas', 'experience', 'description'];
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
      const response = await fetch("/api/auth/send-partner-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
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
      const response = await fetch("/api/auth/register-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: formData.businessName,
          contactPerson: formData.contactPerson,
          designation: formData.designation,
          email: formData.email,
          mobile: formData.mobile,
          password: formData.password,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          businessType: formData.businessType,
          serviceAreas: formData.serviceAreas,
          experience: parseInt(formData.experience),
          description: formData.description,
          otp: formData.otp,
        }),
      });

      const data = await response.json();

      if (data.access_token) {
        localStorage.setItem("loggedUser", JSON.stringify(data));
        localStorage.setItem("access_token", data.access_token);
        toast.success("Registration successful! Welcome to Overseas.ai Partners");
        
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
        <title>Register as Business Partner - Overseas Expansion | Overseas.ai</title>
        <meta name="description" content="Become a business partner with Overseas.ai to expand your services internationally. Register to collaborate and grow together." />
        <meta name="keywords" content="business partner registration, overseas expansion partnership, international business collaboration" />
      </Head>
      
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-8"
        style={{ backgroundImage: "url(/images/logoBg.jpg)" }}
      >
        <Card className="w-full max-w-2xl shadow-2xl bg-white/95 backdrop-blur-sm mx-4">
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
              Partner Registration
            </CardTitle>
            <p className="text-center text-sm text-gray-600 mt-2">
              Join as a Business Partner to expand overseas opportunities
            </p>
          </CardHeader>
          
          <CardContent className="max-h-[80vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Business Name */}
              <div>
                <Label htmlFor="businessName">Business Name *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Enter your business name"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange("businessName", e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.businessName && <p className="text-red-500 text-xs mt-1">{errors.businessName}</p>}
              </div>

              {/* Contact Person & Designation Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">Contact Person *</Label>
                  <div className="relative">
                    <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="contactPerson"
                      type="text"
                      placeholder="Full name"
                      value={formData.contactPerson}
                      onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.contactPerson && <p className="text-red-500 text-xs mt-1">{errors.contactPerson}</p>}
                </div>

                <div>
                  <Label htmlFor="designation">Designation *</Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="designation"
                      type="text"
                      placeholder="Your role/designation"
                      value={formData.designation}
                      onChange={(e) => handleInputChange("designation", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.designation && <p className="text-red-500 text-xs mt-1">{errors.designation}</p>}
                </div>
              </div>

              {/* Email & Mobile Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <div className="flex">
                    <select className="px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 rounded-l-md focus:outline-none">
                      <option value="">+91</option>
                    </select>
                    <div className="relative flex-1">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="10-digit mobile number"
                        value={formData.mobile}
                        onChange={(e) => handleInputChange("mobile", e.target.value)}
                        className="rounded-l-none pl-10"
                        maxLength={10}
                      />
                    </div>
                  </div>
                  {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
                </div>
              </div>

              {/* Password Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password">Password *</Label>
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

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
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
              </div>

              {/* Website */}
              <div>
                <Label htmlFor="website">Website (Optional)</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.yourwebsite.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    className="pl-10"
                  />
                </div>
                {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address">Business Address *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Textarea
                    id="address"
                    placeholder="Enter complete business address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="pl-10 min-h-[80px] resize-none"
                  />
                </div>
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>

              {/* City, State, Country Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    type="text"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>

                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    type="text"
                    value={formData.country}
                    onChange={(e) => handleInputChange("country", e.target.value)}
                  />
                </div>
              </div>

              {/* Business Type & Service Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="businessType">Business Type *</Label>
                  <Input
                    id="businessType"
                    type="text"
                    placeholder="e.g., Recruitment, Training, Consulting"
                    value={formData.businessType}
                    onChange={(e) => handleInputChange("businessType", e.target.value)}
                  />
                  {errors.businessType && <p className="text-red-500 text-xs mt-1">{errors.businessType}</p>}
                </div>

                <div>
                  <Label htmlFor="experience">Years of Experience *</Label>
                  <Input
                    id="experience"
                    type="number"
                    placeholder="Years in business"
                    value={formData.experience}
                    onChange={(e) => handleInputChange("experience", e.target.value)}
                    min="0"
                    max="100"
                  />
                  {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
                </div>
              </div>

              {/* Service Areas */}
              <div>
                <Label htmlFor="serviceAreas">Service Areas *</Label>
                <Textarea
                  id="serviceAreas"
                  placeholder="Describe the services you offer and regions you serve"
                  value={formData.serviceAreas}
                  onChange={(e) => handleInputChange("serviceAreas", e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                {errors.serviceAreas && <p className="text-red-500 text-xs mt-1">{errors.serviceAreas}</p>}
              </div>

              {/* Business Description */}
              <div>
                <Label htmlFor="description">Business Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your business, mission, and how you can contribute as a partner (minimum 50 characters)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/50 minimum characters
                </p>
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
                  <Label htmlFor="otp">OTP *</Label>
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
                {isLoading ? "Creating Account..." : "Register as Partner"}
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                  <Link href="/candidate-register" className="text-[#17487f] hover:underline font-medium">
                    Job Seeker
                  </Link>
                  <Link href="/employer-signup" className="text-[#17487f] hover:underline font-medium">
                    Employer/Company
                  </Link>
                  <Link href="/institute-signup" className="text-[#17487f] hover:underline font-medium">
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
