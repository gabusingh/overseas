"use client";

import React from "react";
import SelectUserType from "@/components/SelectUserType";
import Head from "next/head";

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Register - Join Overseas.ai | Find International Jobs</title>
        <meta name="description" content="Create your account with Overseas.ai. Choose from job seeker, employer, training institute, or business partner registration options." />
        <meta name="keywords" content="register overseas jobs, international job registration, overseas employment signup" />
      </Head>
      
      <div 
        className="min-h-screen bg-cover bg-center bg-no-repeat py-16"
        style={{ backgroundImage: "url(/images/logoBg.jpg)" }}
      >
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-12">            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Join Overseas.ai Today
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Your gateway to international career opportunities. Choose your account type below to get started.
            </p>
          </div>

          {/* SelectUserType Component */}
          <div className="flex justify-center">
            <div className="w-full max-w-6xl">
              <SelectUserType showTitle={false} />
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-16 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">
                Why Choose Overseas.ai?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-globe text-2xl text-blue-300"></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Global Opportunities</h3>
                  <p className="text-white/80">Access thousands of international job opportunities across various industries and countries.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-shield text-2xl text-green-300"></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Trusted Platform</h3>
                  <p className="text-white/80">Verified employers and secure processes to ensure your safety and success abroad.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-users text-2xl text-purple-300"></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Expert Support</h3>
                  <p className="text-white/80">Get guidance from our team of international recruitment and career experts.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-white">
              <div>
                <div className="text-3xl font-bold text-blue-300">50K+</div>
                <div className="text-white/80">Active Jobs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-300">100K+</div>
                <div className="text-white/80">Registered Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-300">500+</div>
                <div className="text-white/80">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-300">50+</div>
                <div className="text-white/80">Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
