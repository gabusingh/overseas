"use client";
import React from "react";
import { TrendingUp } from "lucide-react";

function CleanStatsSection() {
  const stats = [
    {
      number: "10,000+",
      label: "Active Workers",
      description: "Successfully placed in international positions"
    },
    {
      number: "5,000+",
      label: "Satisfied Job Seekers",
      description: "Community members who found opportunities worldwide"
    },
    {
      number: "50+",
      label: "Countries",
      description: "Global opportunities across continents"
    },
    {
      number: "612+",
      label: "App Downloads",
      description: "Users actively searching for jobs on mobile"
    }
  ];

  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <TrendingUp className="w-12 h-12 text-blue-200" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Our Success in Numbers
          </h2>
          <p className="text-lg text-blue-100 max-w-3xl mx-auto">
            Join thousands of professionals who have already transformed their careers with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-xl font-semibold text-blue-100 mb-2">
                {stat.label}
              </div>
              <p className="text-sm text-blue-200">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 pt-8 border-t border-blue-500">
          <h3 className="text-xl font-semibold mb-4">
            Ready to join our success stories?
          </h3>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Start Your Job Search
          </button>
        </div>
      </div>
    </section>
  );
}

export default CleanStatsSection;
