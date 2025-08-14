"use client";
import React from "react";

export default function AboutResumeBuildingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Resume Building Services</h1>
          <p className="text-lg text-gray-600 mb-8">
            Professional resume building services to help you land your dream job overseas.
          </p>
          
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
              <button className="downloadButton">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
