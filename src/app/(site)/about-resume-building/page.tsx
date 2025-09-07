"use client";
import React from "react";
import Link from "next/link";

export default function AboutResumeBuildingPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-4">Resume Building Services</h1>
          <p className="text-base text-gray-600 mb-6">
            Professional resume building services to help you land your dream job overseas.
          </p>
          
          {/* Hero CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 border border-blue-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Build Your Professional Resume Now
              </h2>
              <p className="text-base text-gray-600 mb-4 max-w-xl mx-auto">
                Use our free resume builder tool to create a professional, ATS-optimized resume.
              </p>
              <Link 
                href="/resume-building"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
              >
                <i className="fa fa-rocket mr-2 text-sm"></i>
                Get Started Now - It's Free!
              </Link>
              <p className="text-xs text-gray-500 mt-2">
                No credit card required • Professional templates • Download as PDF
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            <div>
              <h3 className="textBlue mb-3 text-lg font-semibold">Our Resume Services</h3>
              <ul className="space-y-2 list-none">
                <li className="mb-2 flex items-center">
                  <i className="fa fa-check textBlue mr-3 text-sm"></i>
                  Professional CV Writing
                </li>
                <li className="mb-2 flex items-center">
                  <i className="fa fa-check textBlue mr-3 text-sm"></i>
                  ATS-Optimized Resumes
                </li>
                <li className="mb-2 flex items-center">
                  <i className="fa fa-check textBlue mr-3 text-sm"></i>
                  Cover Letter Writing
                </li>
                <li className="mb-2 flex items-center">
                  <i className="fa fa-check textBlue mr-3 text-sm"></i>
                  LinkedIn Profile Optimization
                </li>
                <li className="mb-2 flex items-center">
                  <i className="fa fa-check textBlue mr-3 text-sm"></i>
                  Interview Preparation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="textBlue mb-3 text-lg font-semibold">Why Choose Our Service?</h3>
              <p className="text-gray-500 mb-3 text-sm">
                Our expert team has helped thousands of professionals secure jobs overseas. 
                We understand what international employers look for and tailor your resume accordingly.
              </p>
              <p className="text-gray-500 mb-4 text-sm">
                Get personalized resume writing services that highlight your skills and experience 
                in the best possible way.
              </p>
              <Link 
                href="/resume-building"
                className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-all duration-200"
              >
                <i className="fa fa-play mr-2 text-xs"></i>
                Start Building Resume
              </Link>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-10">
            <h2 className="text-xl font-bold text-center text-gray-800 mb-8">
              Why Use Our Resume Builder?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa fa-magic text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Easy to Use</h3>
                <p className="text-gray-600 text-sm">
                  Simple step-by-step process to create your resume in minutes.
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa fa-search text-green-600 text-lg"></i>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">ATS Optimized</h3>
                <p className="text-gray-600 text-sm">
                  Designed to pass Applicant Tracking Systems used by companies.
                </p>
              </div>
              <div className="text-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <i className="fa fa-download text-purple-600 text-lg"></i>
                </div>
                <h3 className="text-base font-semibold text-gray-800 mb-2">Instant Download</h3>
                <p className="text-gray-600 text-sm">
                  Download your professional resume as PDF immediately.
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-10 text-center bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              Ready to Build Your Resume?
            </h2>
            <p className="text-gray-600 mb-4 max-w-lg mx-auto text-sm">
              Join thousands of professionals who have successfully landed overseas jobs with our resume builder.
            </p>
            <Link 
              href="/resume-building"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg"
            >
              <i className="fa fa-arrow-right mr-2 text-sm"></i>
              Start Building Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
