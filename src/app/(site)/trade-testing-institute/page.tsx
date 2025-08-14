"use client";
import React from "react";

export default function TradeTestingInstitutePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Trade Testing Institute</h1>
          <p className="text-lg text-gray-600 mb-8">
            Professional trade testing and certification services to validate your skills for overseas employment.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            <div>
              <h3 className="textBlue mb-4 text-xl font-semibold">Available Trade Tests</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <ul className="space-y-3 list-none">
                    <li className="mb-3">• Welding</li>
                    <li className="mb-3">• Plumbing</li>
                    <li className="mb-3">• Electrical</li>
                    <li className="mb-3">• Carpentry</li>
                    <li className="mb-3">• Masonry</li>
                  </ul>
                </div>
                <div>
                  <ul className="space-y-3 list-none">
                    <li className="mb-3">• Painting</li>
                    <li className="mb-3">• Tiling</li>
                    <li className="mb-3">• HVAC</li>
                    <li className="mb-3">• Heavy Machinery</li>
                    <li className="mb-3">• Automotive</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="textBlue mb-4 text-xl font-semibold">Certification Benefits</h3>
              <ul className="space-y-4 list-none">
                <li className="mb-4 flex items-center">
                  <i className="fa fa-certificate textBlue mr-3"></i>
                  Internationally recognized certification
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-globe textBlue mr-3"></i>
                  Valid in multiple countries
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-briefcase textBlue mr-3"></i>
                  Higher job placement rates
                </li>
                <li className="mb-4 flex items-center">
                  <i className="fa fa-money textBlue mr-3"></i>
                  Better salary packages
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 p-8 rounded-lg bg-blue-50">
            <h4 className="textBlue mb-6 text-xl font-semibold">How It Works</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center mb-4">
                <div className="gola mx-auto mb-3">
                  <span className="textBlue font-bold">1</span>
                </div>
                <p className="text-sm">Register for Test</p>
              </div>
              <div className="text-center mb-4">
                <div className="gola mx-auto mb-3">
                  <span className="textBlue font-bold">2</span>
                </div>
                <p className="text-sm">Prepare & Practice</p>
              </div>
              <div className="text-center mb-4">
                <div className="gola mx-auto mb-3">
                  <span className="textBlue font-bold">3</span>
                </div>
                <p className="text-sm">Take the Test</p>
              </div>
              <div className="text-center mb-4">
                <div className="gola mx-auto mb-3">
                  <span className="textBlue font-bold">4</span>
                </div>
                <p className="text-sm">Get Certified</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="downloadButton mr-4">
              Schedule Trade Test
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors">
              View Test Centers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
