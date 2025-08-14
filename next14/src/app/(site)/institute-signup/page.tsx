"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { X, Eye, EyeOff, GraduationCap, Phone, Lock, Mail, MapPin, Globe, FileText } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Head from "next/head";

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
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat py-8"
        style={{ backgroundImage: "url(/images/logoBg.jpg)" }}
      >
        <Card className="w-full max-w-2xl shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-2 -right-2 bg-white border border-red-500 text-red-500 hover:bg-red-50 rounded-full"
              onClick={() => router.push("/")}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="text-center mb-4">
              <img
                src="https://backend.overseas.ai/frontend/logo/logo_en.gif"
                alt="Overseas.ai Logo"
                className="mx-auto h-12"
              />
            </div>
            
            <CardTitle className="text-center text-xl font-semibold text-gray-800">
              Register Your Institute
            </CardTitle>
            <p className="text-center text-sm text-gray-600 mt-2">
              Offer overseas skill development courses and training programs
            </p>
          </CardHeader>
          
          <CardContent className="max-h-[70vh] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Institute Details Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Institute Information</h3>
                
                {/* Institute Name */}
                <div>
                  <Label htmlFor="instituteName">Institute Name *</Label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="instituteName"
                      type="text"
                      placeholder="Enter your institute name"
                      value={formData.instituteName}
                      onChange={(e) => handleInputChange("instituteName", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.instituteName && <p className="text-red-500 text-xs mt-1">{errors.instituteName}</p>}
                </div>

                {/* Director Name */}
                <div>
                  <Label htmlFor="directorName">Director/Principal Name *</Label>
                  <Input
                    id="directorName"
                    type="text"
                    placeholder="Enter director or principal name"
                    value={formData.directorName}
                    onChange={(e) => handleInputChange("directorName", e.target.value)}
                  />
                  {errors.directorName && <p className="text-red-500 text-xs mt-1">{errors.directorName}</p>}
                </div>

                {/* Email and Mobile Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="institute@example.com"
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
                </div>

                {/* Website */}
                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://www.institute.com"
                      value={formData.website}
                      onChange={(e) => handleInputChange("website", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  {errors.website && <p className="text-red-500 text-xs mt-1">{errors.website}</p>}
                </div>

                {/* Established Year and Registration Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="establishedYear">Established Year *</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      placeholder="e.g., 2010"
                      min="1900"
                      max={new Date().getFullYear()}
                      value={formData.establishedYear}
                      onChange={(e) => handleInputChange("establishedYear", e.target.value)}
                    />
                    {errors.establishedYear && <p className="text-red-500 text-xs mt-1">{errors.establishedYear}</p>}
                  </div>

                  <div>
                    <Label htmlFor="registrationNumber">Registration Number *</Label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="registrationNumber"
                        type="text"
                        placeholder="Enter registration number"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange("registrationNumber", e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    {errors.registrationNumber && <p className="text-red-500 text-xs mt-1">{errors.registrationNumber}</p>}
                  </div>
                </div>

                {/* Affiliations */}
                <div>
                  <Label htmlFor="affiliations">Affiliations/Certifications *</Label>
                  <Textarea
                    id="affiliations"
                    placeholder="List your affiliations, certifications, and recognitions (e.g., NSDC, NCVT, State Board)"
                    value={formData.affiliations}
                    onChange={(e) => handleInputChange("affiliations", e.target.value)}
                    rows={3}
                  />
                  {errors.affiliations && <p className="text-red-500 text-xs mt-1">{errors.affiliations}</p>}
                </div>
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Institute Address</h3>
                
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Textarea
                      id="address"
                      placeholder="Enter complete institute address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="pl-10"
                      rows={3}
                    />
                  </div>
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      type="text"
                      placeholder="Enter city"
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
                      placeholder="Enter state"
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
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Institute Description */}
              <div>
                <Label htmlFor="description">Institute Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your institute, courses offered, facilities, and what makes you unique (minimum 50 characters)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={4}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Security</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
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

                  {/* Confirm Password */}
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
                  {isLoading ? "Sending OTP..." : "Send OTP for Verification"}
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
                {isLoading ? "Registering Institute..." : "Register Institute"}
              </Button>

              <Separator className="my-4" />

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>
                  Already have an account?{" "}
                  <Link href="/login" className="text-[#17487f] hover:underline font-medium">
                    Sign In
                  </Link>
                </p>
                
                <div className="space-y-1">
                  <p>Register as:</p>
                  <Link href="/candidate-register" className="block text-[#17487f] hover:underline font-medium">
                    Job Seeker
                  </Link>
                  <Link href="/employer-signup" className="block text-[#17487f] hover:underline font-medium">
                    Employer/Company
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
