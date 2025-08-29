"use client";
import React from "react";
import Link from "next/link";

export default function AboutResumeBuildingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Resume Building Services</h1>
          <p className="text-lg text-gray-600 mb-8">
            Professional resume building services to help you land your dream job overseas.
          </p>
          
          {/* Hero CTA Section */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-12 border border-blue-100">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Build Your Professional Resume Now
              </h2>
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Use our free resume builder tool to create a professional, ATS-optimized resume that gets you noticed by international employers.
              </p>
              <Link 
                href="/resume-building"
                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <i className="fa fa-rocket mr-3"></i>
                Get Started Now - It's Free!
              </Link>
              <p className="text-sm text-gray-500 mt-3">
                No credit card required • Professional templates • Download as PDF
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="textBlue mb-4 text-xl font-semibold">Our Resume Services</h3>
              <ul className="space-y-4 list-none">
                <li className="mb-4 flex items-center">
                  <i className="fa fa-check textBlue mr-3"></i>
                  Professional CV Writing
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-check textBlue mr-3"></i>
                  ATS-Optimized Resumes
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-check textBlue mr-3"></i>
                  Cover Letter Writing
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-check textBlue mr-3"></i>
                  LinkedIn Profile Optimization
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-check textBlue mr-3"></i>
                  Interview Preparation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="textBlue mb-4 text-xl font-semibold">Why Choose Our Service?</h3>
              <p className="text-gray-500 mb-4">
                Our expert team has helped thousands of professionals secure jobs overseas. 
                We understand what international employers look for and tailor your resume accordingly.
              </p>
              <p className="text-gray-500 mb-6">
                Get personalized resume writing services that highlight your skills and experience 
                in the best possible way.
              </p>
              <Link 
                href="/resume-building"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <i className="fa fa-play mr-2"></i>
                Start Building Resume
              </Link>
            </div>
          </div>
          
          {/* Features Section */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-12">
              Why Use Our Resume Builder?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-magic text-blue-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Easy to Use</h3>
                <p className="text-gray-600">
                  Simple step-by-step process to create your resume in minutes, not hours.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-search text-green-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">ATS Optimized</h3>
                <p className="text-gray-600">
                  Designed to pass Applicant Tracking Systems used by international companies.
                </p>
              </div>
              <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-download text-purple-600 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Instant Download</h3>
                <p className="text-gray-600">
                  Download your professional resume as PDF immediately after completion.
                </p>
              </div>
            </div>
          </div>
          
          {/* Bottom CTA */}
          <div className="mt-16 text-center bg-gray-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Ready to Build Your Resume?
            </h2>
            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
              Join thousands of professionals who have successfully landed overseas jobs with our resume builder.
            </p>
            <Link 
              href="/resume-building"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <i className="fa fa-arrow-right mr-3"></i>
              Start Building Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
