"use client";
import React from "react";

export default function JobsLastWeekPage() {
  const recentJobs = [
    {
      title: "Software Engineer",
      company: "TechCorp Singapore",
      location: "Singapore",
      salary: "$60,000 - $80,000",
      postedDate: "2 days ago",
      type: "Full-time"
    },
    {
      title: "Registered Nurse",
      company: "Dubai Health Authority",
      location: "Dubai, UAE",
      salary: "$35,000 - $45,000",
      postedDate: "3 days ago",
      type: "Full-time"
    },
    {
      title: "Project Manager",
      company: "Canadian Tech Solutions",
      location: "Toronto, Canada",
      salary: "$70,000 - $90,000",
      postedDate: "4 days ago",
      type: "Full-time"
    },
    {
      title: "Electrical Technician",
      company: "Australian Infrastructure",
      location: "Sydney, Australia",
      salary: "$55,000 - $65,000",
      postedDate: "5 days ago",
      type: "Contract"
    },
    {
      title: "Marketing Specialist",
      company: "Global Marketing Ltd",
      location: "London, UK",
      salary: "$45,000 - $55,000",
      postedDate: "6 days ago",
      type: "Full-time"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="w-full">
        <div className="w-full">
          <h1 className="heading textBlue mb-6">Jobs of the Week</h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover the latest job opportunities posted in the last 7 days.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <p className="text-gray-500 m-0">
                  Showing {recentJobs.length} jobs posted in the last week
                </p>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" style={{width: "200px"}}>
                  <option>Sort by: Most Recent</option>
                  <option>Sort by: Salary High to Low</option>
                  <option>Sort by: Salary Low to High</option>
                  <option>Sort by: Company Name</option>
                </select>
              </div>
              
              {recentJobs.map((job, index) => (
                <div key={index} className="bg-white border-0 shadow-sm rounded-lg mb-6">
                  <div className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-grow w-full">
                        <h5 className="textBlue mb-3 text-xl font-semibold">{job.title}</h5>
                        <p className="text-gray-500 mb-2 flex items-center">
                          <i className="fa fa-building mr-2"></i>
                          {job.company}
                        </p>
                        <p className="text-gray-500 mb-2 flex items-center">
                          <i className="fa fa-map-marker mr-2"></i>
                          {job.location}
                        </p>
                        <p className="text-green-600 mb-3 flex items-center">
                          <i className="fa fa-money mr-2"></i>
                          {job.salary}
                        </p>
                        <div className="flex flex-wrap gap-3 items-center">
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">{job.type}</span>
                          <small className="text-gray-500">Posted {job.postedDate}</small>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full lg:w-auto">
                        <button className="bgBlue text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors flex-1 lg:flex-none">
                          Apply Now
                        </button>
                        <button className="border border-gray-300 text-gray-600 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          <i className="fa fa-heart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center mt-8">
                <button className="downloadButton">
                  Load More Jobs
                </button>
              </div>
            </div>
            
            <div className="lg:col-span-4">
              <div className="bg-white border-0 shadow-sm rounded-lg">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg">
                  <h6 className="m-0 font-semibold">Job Alert</h6>
                </div>
                <div className="p-6">
                  <p className="text-gray-500 text-sm mb-4">
                    Get notified about new jobs matching your criteria.
                  </p>
                  <div className="mb-4">
                    <input type="email" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Your email address" />
                  </div>
                  <button className="w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                    Subscribe to Alerts
                  </button>
                </div>
              </div>
              
              <div className="bg-white border-0 shadow-sm rounded-lg mt-6">
                <div className="bgBlue text-white px-6 py-4 rounded-t-lg">
                  <h6 className="m-0 font-semibold">Popular Categories</h6>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 m-0 list-none">
                    <li>
                      <a href="#" className="textBlue hover:text-blue-800 no-underline transition-colors">
                        IT & Software (245)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="textBlue hover:text-blue-800 no-underline transition-colors">
                        Healthcare (189)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="textBlue hover:text-blue-800 no-underline transition-colors">
                        Engineering (156)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="textBlue hover:text-blue-800 no-underline transition-colors">
                        Construction (134)
                      </a>
                    </li>
                    <li>
                      <a href="#" className="textBlue hover:text-blue-800 no-underline transition-colors">
                        Finance (98)
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
