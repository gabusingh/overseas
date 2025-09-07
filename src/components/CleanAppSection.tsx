"use client";
import React from "react";
import Image from "next/image";
import { Smartphone, Download, Star } from "lucide-react";

function CleanAppSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="flex items-center mb-4">
              <Smartphone className="w-8 h-8 text-blue-600 mr-3" />
              <span className="text-blue-600 font-semibold">Mobile App</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Take your job search on the go
            </h2>
            
            <p className="text-lg text-gray-600 mb-8">
              Download our mobile app to search and apply for jobs anytime, anywhere. 
              Get instant notifications for new opportunities that match your preferences.
            </p>

            {/* Features */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Search jobs on the go</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Apply with one click</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Get instant notifications</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                <span className="text-gray-700">Track your applications</span>
              </div>
            </div>

            {/* App Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">4.5/5 based on 1000+ reviews</span>
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="https://play.google.com/store/apps/details?id=ai.overseas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Download className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </a>
              
              <a
                href="#"
                className="flex items-center justify-center bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors opacity-50 cursor-not-allowed"
              >
                <Download className="w-5 h-5 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </a>
            </div>
            
            <p className="text-sm text-gray-500 mt-3">
              * iOS app coming soon
            </p>
          </div>

          {/* Right Content - Phone Image */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone mockup placeholder */}
              <div className="w-64 h-96 bg-gray-900 rounded-3xl p-2 shadow-2xl">
                <div className="w-full h-full bg-white rounded-2xl overflow-hidden">
                  <div className="bg-blue-600 h-20 flex items-center justify-center">
                    <span className="text-white font-semibold">Overseas.ai</span>
                  </div>
                  <div className="p-4">
                    <div className="h-10 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-16 bg-gray-100 rounded-lg"></div>
                      <div className="h-16 bg-gray-100 rounded-lg"></div>
                      <div className="h-16 bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                New Jobs!
              </div>
              <div className="absolute -bottom-4 -left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                4.5★ Rated
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CleanAppSection;
