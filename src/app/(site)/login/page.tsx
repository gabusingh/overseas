"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Head from "next/head";
import {
  loginUsingPassword,
  loginUsingOtp,
  verifyOtpForLogin,
} from "@/services/user.service";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateMobile = (mobile: string) => /^\d{10}$/.test(mobile);

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
    } catch {
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
        response = await verifyOtpForLogin({ empPhone: mobile, otp });
      } else {
        response = await loginUsingPassword({ empPhone: mobile, password });
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
    } catch {
      toast.error("Internal Server Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Overseas Jobs Log In: Access Global Opportunities</title>
        <meta
          name="description"
          content="Unlock your potential with overseas job listings. Log in to explore diverse career options."
        />
        <meta name="keywords" content="overseas jobs login" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="relative space-y-6 pb-8">
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-3 -right-3 bg-white/80 border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-500 hover:border-red-200 rounded-full w-8 h-8 shadow-lg transition-all"
                onClick={() => router.push("/")}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <img
                    src="https://backend.overseas.ai/frontend/logo/logo_en.gif"
                    alt="Overseas.ai Logo"
                    className="h-8 w-8 object-contain filter brightness-0 invert"
                  />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Sign in to access your overseas job opportunities
                </p>
              </div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </Label>
                  <div className="flex">
                    <div className="px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-600 rounded-l-lg flex items-center text-sm">
                      🇮🇳 +91
                    </div>
                    <Input
                      id="mobile"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="rounded-l-none flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Password or OTP Input */}
                {isOtpLogin ? (
                  <div className="space-y-2">
                    <Label
                      htmlFor="otp"
                      className="text-sm font-medium text-gray-700"
                    >
                      Enter OTP
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-center text-lg tracking-widest transition-colors"
                      maxLength={6}
                    />
                    <p className="text-xs text-gray-500">
                      We've sent a 6-digit code to your mobile number
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-sm font-medium text-gray-700"
                      >
                        Password
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 h-auto text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                    />
                  </div>
                )}

                {/* OTP Login Toggle */}
                {!isOtpSent && (
                  <div className="text-center">
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-[#17487f] hover:text-[#135a8a] font-medium transition-colors"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                    >
                      🔐 Login with OTP instead
                    </Button>
                  </div>
                )}

                {/* Resend OTP */}
                {isOtpSent && (
                  <div className="flex justify-between items-center bg-green-50 p-3 rounded-lg">
                    <span className="text-sm text-green-700">
                      OTP sent successfully!
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="text-green-600 hover:text-green-700 hover:bg-green-100"
                    >
                      Resend OTP
                    </Button>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#17487f] to-[#135a8a] hover:from-[#135a8a] hover:to-[#104a73] text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Please wait...
                    </div>
                  ) : isOtpLogin ? (
                    "🔓 Verify OTP"
                  ) : (
                    "🚀 Login"
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-4 text-gray-500">
                      New to Overseas?
                    </span>
                  </div>
                </div>

                {/* Registration Links */}
                <div className="grid grid-cols-1 gap-3">
                  <Link
                    href="/candidate-register"
                    className="flex items-center justify-center px-4 py-2 border border-blue-200 rounded-lg text-[#17487f] hover:bg-blue-50 hover:border-blue-300 font-medium transition-colors"
                  >
                    👤 Register as Job Seeker
                  </Link>
                  <Link
                    href="/employer-signup"
                    className="flex items-center justify-center px-4 py-2 border border-green-200 rounded-lg text-green-600 hover:bg-green-50 hover:border-green-300 font-medium transition-colors"
                  >
                    🏢 Register as Employer
                  </Link>
                  <Link
                    href="/institute-signup"
                    className="flex items-center justify-center px-4 py-2 border border-purple-200 rounded-lg text-purple-600 hover:bg-purple-50 hover:border-purple-300 font-medium transition-colors"
                  >
                    🎓 Register as Institute
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
