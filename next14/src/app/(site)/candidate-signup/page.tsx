"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Head from "next/head";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

interface CountryCode {
  countryCode: string;
  name: string;
}

interface SignUpFormData {
  empName: string;
  empPhone: string;
  countryCode: string;
  empEmail: string;
  password: string;
  confirmPassword: string;
}

export default function CandidateSignUpPage() {
  const router = useRouter();
  const [countryCodeArr, setCountryCodeArr] = useState<CountryCode[]>([]);
  const [showEmail, setShowEmail] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    empName: Yup.string().required("Full Name is required"),
    empPhone: Yup.string().required("Phone Number is required"),
    empEmail: Yup.string().when('countryCode', {
      is: (val: string) => val !== "+91",
      then: (schema) => schema.email("Invalid email").required("Email is required when country code is not +91"),
      otherwise: (schema) => schema.email("Invalid email")
    }),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const initialValues: SignUpFormData = {
    empName: "",
    empPhone: "",
    countryCode: "+91",
    empEmail: "",
    password: "",
    confirmPassword: "",
  };

  useEffect(() => {
    fetchCountryCodes();
  }, []);

  const fetchCountryCodes = async () => {
    try {
      // Mock data - replace with actual API call
      const mockCountryCodes: CountryCode[] = [
        { countryCode: "1", name: "USA" },
        { countryCode: "44", name: "UK" },
        { countryCode: "971", name: "UAE" },
        { countryCode: "966", name: "Saudi Arabia" },
        { countryCode: "974", name: "Qatar" },
        { countryCode: "973", name: "Bahrain" },
        { countryCode: "968", name: "Oman" },
        { countryCode: "965", name: "Kuwait" },
      ];
      setCountryCodeArr(mockCountryCodes);
    } catch (error) {
      console.error("Error fetching country codes:", error);
      toast.error("Failed to load country codes");
    }
  };

  const onSubmit = async (values: SignUpFormData) => {
    if (values.countryCode !== "+91" && !values.empEmail) {
      toast.error("Email is required when your country code is not +91");
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual service
      const response = await mockSignUp(values);
      
      if (response.success) {
        toast.success("OTP sent successfully!");
        localStorage.setItem("tempUser", JSON.stringify(values));
        setTimeout(() => {
          router.push("/otp-verification");
        }, 1500);
      } else {
        toast.warning("User already registered.");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("Internal server error");
    } finally {
      setLoading(false);
    }
  };

  // Mock function - replace with actual API call
  const mockSignUp = async (values: SignUpFormData) => {
    return new Promise<{success: boolean}>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  const handleCountryCodeChange = (event: React.ChangeEvent<HTMLSelectElement>, setFieldValue: any) => {
    const selectedValue = event.target.value;
    setFieldValue("countryCode", selectedValue);
    setShowEmail(selectedValue !== "+91");
  };

  return (
    <>
      <Head>
        <title>Candidate Registration - Step 1 | Overseas.ai</title>
        <meta name="description" content="Register as a candidate to find overseas job opportunities and start your international career journey." />
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
                    alt="Candidate Registration"
                  />
                </div>

                {/* Right side - Form */}
                <div className="flex items-center justify-center">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                  >
                    {({ setFieldValue, values }) => (
                      <Form className="w-full max-w-md">
                        <div className="bg-white shadow-lg rounded-lg p-6">
                          <h3 className="text-2xl font-bold textBlue mb-6 text-center">
                            <i className="fa fa-user mr-2"></i>
                            Candidate Register
                          </h3>

                          {/* Full Name */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <Field 
                              name="empName" 
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter your full name"
                            />
                            <ErrorMessage
                              name="empName"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>

                          {/* Phone Number */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <div className="flex">
                              <Field
                                as="select"
                                name="countryCode"
                                className="px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-32"
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                  handleCountryCodeChange(e, setFieldValue);
                                }}
                              >
                                <option value="+91">+91 India</option>
                                {countryCodeArr.map((country, index) => (
                                  <option
                                    key={index}
                                    value={`+${country.countryCode}`}
                                  >
                                    +{country.countryCode} {country.name}
                                  </option>
                                ))}
                              </Field>
                              <Field
                                name="empPhone"
                                className="flex-1 px-3 py-2 border border-l-0 border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter phone number"
                              />
                            </div>
                            <ErrorMessage
                              name="empPhone"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>

                          {/* Email (conditional) */}
                          {showEmail && (
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                              </label>
                              <Field 
                                name="empEmail" 
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter your email"
                              />
                              <ErrorMessage
                                name="empEmail"
                                component="div"
                                className="text-red-500 text-sm mt-1"
                              />
                            </div>
                          )}

                          {/* Password */}
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Password
                            </label>
                            <Field
                              name="password"
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Enter password"
                            />
                            <ErrorMessage
                              name="password"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>

                          {/* Confirm Password */}
                          <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Confirm Password
                            </label>
                            <Field
                              name="confirmPassword"
                              type="password"
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Confirm password"
                            />
                            <ErrorMessage
                              name="confirmPassword"
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>

                          {/* Submit Button */}
                          <button 
                            type="submit" 
                            className="w-full bgBlue text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            disabled={loading}
                          >
                            {loading ? (
                              <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Signing Up...
                              </div>
                            ) : (
                              "Sign Up"
                            )}
                          </button>

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
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
