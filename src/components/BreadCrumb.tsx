"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Briefcase } from "lucide-react";

export default function BreadCrumb() {
  const router = useRouter();

  return (
    <div className="flex mt-5 pt-5 cursor-pointer">
      <div className="flex items-center justify-start border border-[#17487f] rounded-l-lg overflow-hidden">
        {/* Home */}
        <div
          className="p-2 px-3 md:px-4 hover:bg-gray-50 transition-colors flex items-center"
          onClick={() => {
            router.push("/");
          }}
        >
          <Home className="w-5 h-5 text-[#17487f]" />
        </div>

        {/* All Jobs */}
        <div
          className="p-2 px-3 md:px-4 border-l border-[#17487f] hover:bg-gray-50 transition-colors flex items-center"
          onClick={() => {
            router.push("/jobs");
          }}
        >
          <Briefcase className="w-5 h-5 text-[#17487f] mr-2" />
          <span className="text-[#17487f] font-medium">ALL JOBS</span>
        </div>

        {/* Job Details */}
        <div className="p-2 px-3 md:px-4 bg-[#17487f] rounded-r-lg flex items-center">
          <Briefcase className="w-5 h-5 text-white mr-2" />
          <span className="text-white font-medium">JOB DETAILS</span>
        </div>
      </div>
    </div>
  );
}
