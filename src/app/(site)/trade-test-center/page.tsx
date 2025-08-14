"use client";
import React from "react";

export default function TradeTestCenterPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Trade Test Centers</h1>
          <p className="text-lg text-gray-600 mb-8">
            Find authorized trade test centers near you for professional skill certification.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <div>
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="p-6">
                  <h5 className="textBlue mb-4 text-lg font-semibold">
                    <i className="fa fa-map-marker mr-2"></i>
                    Delhi Test Center
                  </h5>
                  <p className="text-gray-500 mb-3">
                    <strong>Address:</strong> Sector 15, Dwarka, New Delhi - 110075
                  </p>
                  <p className="text-gray-500 mb-3">
                    <strong>Phone:</strong> +91 11 2345 6789
                  </p>
                  <p className="text-gray-500 mb-4">
                    <strong>Available Tests:</strong> Welding, Electrical, Plumbing
                  </p>
                  <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="p-6">
                  <h5 className="textBlue mb-4 text-lg font-semibold">
                    <i className="fa fa-map-marker mr-2"></i>
                    Mumbai Test Center
                  </h5>
                  <p className="text-gray-500 mb-3">
                    <strong>Address:</strong> Andheri East, Mumbai - 400069
                  </p>
                  <p className="text-gray-500 mb-3">
                    <strong>Phone:</strong> +91 22 2345 6789
                  </p>
                  <p className="text-gray-500 mb-4">
                    <strong>Available Tests:</strong> Carpentry, Masonry, Painting
                  </p>
                  <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="p-6">
                  <h5 className="textBlue mb-4 text-lg font-semibold">
                    <i className="fa fa-map-marker mr-2"></i>
                    Bangalore Test Center
                  </h5>
                  <p className="text-gray-500 mb-3">
                    <strong>Address:</strong> Electronic City, Bangalore - 560100
                  </p>
                  <p className="text-gray-500 mb-3">
                    <strong>Phone:</strong> +91 80 2345 6789
                  </p>
                  <p className="text-gray-500 mb-4">
                    <strong>Available Tests:</strong> HVAC, Automotive, Tiling
                  </p>
                  <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-12 p-8 rounded-lg bg-blue-50">
            <h4 className="textBlue mb-6 text-xl font-semibold">How to Book a Test</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <ol className="space-y-4">
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">1</span>
                    <span>Select your nearest test center</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">2</span>
                    <span>Choose your trade skill</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">3</span>
                    <span>Book your preferred date</span>
                  </li>
                </ol>
              </div>
              <div>
                <ol className="space-y-4">
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">4</span>
                    <span>Pay the test fee</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">5</span>
                    <span>Receive confirmation</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bgBlue text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm font-semibold">6</span>
                    <span>Attend the test</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <button className="downloadButton mr-4">
              Find Test Center
            </button>
            <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-full hover:bg-blue-50 transition-colors">
              Book Test Online
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
