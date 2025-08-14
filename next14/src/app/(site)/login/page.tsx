"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Eye, EyeOff, Phone } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Head from "next/head";
import { loginUsingPassword, loginUsingOtp, verifyOtpForLogin } from "@/services/user.service";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateMobile = (mobile: string) => {
    return /^\d{10}$/.test(mobile);
  };

  const handleSendOtp = async () => {
    if (!validateMobile(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUsingOtp({ empPhone: mobile });
      
      if (response?.data?.msg === "Otp Sent Succefully.") {
        setIsOtpSent(true);
        setIsOtpLogin(true);
        toast.success("OTP sent successfully");
      } else if (response?.data?.error === "Mobile number is not registered !") {
        toast.error("Mobile number is not registered!");
      } else {
        toast.error("Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateMobile(mobile)) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }

    if (!isOtpLogin && !password) {
      toast.error("Password is required");
      return;
    }

    if (isOtpLogin && !otp) {
      toast.error("OTP is required");
      return;
    }

    setIsLoading(true);
    try {
      let response;
      
      if (isOtpLogin) {
        response = await verifyOtpForLogin({
          empPhone: mobile,
          otp: otp,
        });
      } else {
        response = await loginUsingPassword({
          empPhone: mobile,
          password: password,
        });
      }

      if (response?.data?.access_token) {
        localStorage.setItem("loggedUser", JSON.stringify(response.data));
        localStorage.setItem("access_token", response.data.access_token);
        toast.success("User logged in successfully");
        
        setTimeout(() => {
          switch (response?.data?.user?.type) {
            case "person":
              router.push("/my-profile");
              break;
            case "company":
              router.push("/hra-dashboard");
              break;
            case "institute":
              router.push("/institute-dashboard");
              break;
            default:
              router.push("/");
              break;
          }
        }, 1000);
      } else {
        toast.error(response?.data?.error || "Invalid credentials");
      }
    } catch (error) {
      toast.error("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Overseas Jobs Log In: Access Global Opportunities</title>
        <meta name="description" content="Unlock your potential with overseas job listings. Log in to explore diverse career options." />
        <meta name="keywords" content="overseas jobs login" />
      </Head>
      
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/logoBg.jpg)" }}
      >
        <Card className="w-full max-w-md shadow-2xl bg-white/95 backdrop-blur-sm">
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
              Welcome Back
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone Number */}
              <div>
                <Label htmlFor="mobile">Phone Number</Label>
                <div className="flex mt-1">
                  <select className="px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 rounded-l-md focus:outline-none">
                    <option value="">+91</option>
                  </select>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="rounded-l-none flex-1"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Password or OTP Input */}
              {isOtpLogin ? (
                <div>
                  <Label htmlFor="otp">OTP</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-0 h-auto"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}

              {/* OTP Login Toggle */}
              {!isOtpSent && (
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-[#17487f] underline font-bold"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  Login Via OTP Verification
                </Button>
              )}

              {/* Resend OTP */}
              {isOtpSent && (
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSendOtp}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold"
                >
                  Resend OTP
                </Button>
              )}

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full bg-[#17487f] hover:bg-[#135a8a]" 
                disabled={isLoading}
              >
                {isLoading ? "Please wait..." : (isOtpLogin ? "Verify OTP" : "Login")}
              </Button>

              <Separator className="my-4" />

              {/* Registration Links */}
              <div className="text-center text-sm text-gray-600 space-y-2">
                <p>
                  Don't have an account?
                </p>
                <div className="space-y-1">
                  <Link href="/candidate-register" className="block text-[#17487f] hover:underline font-medium">
                    Register as Job Seeker
                  </Link>
                  <Link href="/employer-signup" className="block text-[#17487f] hover:underline font-medium">
                    Register as Employer
                  </Link>
                  <Link href="/institute-signup" className="block text-[#17487f] hover:underline font-medium">
                    Register as Institute
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
