"use client";
import React from "react";

export default function SkillTrainingInstitutePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Skill Training Institute</h1>
          <p className="text-lg text-gray-600 mb-8">
            Professional skill training programs to enhance your capabilities for overseas employment.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            <div className="mb-6">
              <div className="bg-white border-0 shadow-sm rounded-lg h-full">
                <div className="p-6">
                  <h4 className="textBlue mb-4 text-xl font-semibold">Technical Skills</h4>
                  <ul className="space-y-3 list-none">
                    <li className="mb-3">• IT & Software Development</li>
                    <li className="mb-3">• Engineering Skills</li>
                    <li className="mb-3">• Healthcare Training</li>
                    <li className="mb-3">• Construction & Trades</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="bg-white border-0 shadow-sm rounded-lg h-full">
                <div className="p-6">
                  <h4 className="textBlue mb-4 text-xl font-semibold">Language Training</h4>
                  <ul className="space-y-3 list-none">
                    <li className="mb-3">• English Proficiency</li>
                    <li className="mb-3">• IELTS Preparation</li>
                    <li className="mb-3">• Business Communication</li>
                    <li className="mb-3">• Interview Skills</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mb-6">
              <div className="bg-white border-0 shadow-sm rounded-lg h-full">
                <div className="p-6">
                  <h4 className="textBlue mb-4 text-xl font-semibold">Soft Skills</h4>
                  <ul className="space-y-3 list-none">
                    <li className="mb-3">• Leadership Development</li>
                    <li className="mb-3">• Team Management</li>
                    <li className="mb-3">• Cultural Adaptation</li>
                    <li className="mb-3">• Professional Etiquette</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="downloadButton mr-4">
              Browse Training Programs
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors">
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
