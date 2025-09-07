"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, MapPin, Briefcase, Users, TrendingUp } from "lucide-react";
import Image from "next/image";

function CommunityTestimonialsSection() {
  const testimonials = [
    {
      name: "Hasan Abdul",
      location: "Dubai, UAE",
      occupation: "Construction Worker",
      rating: 5,
      review: "Overseas.ai changed my life! I found my dream job in Dubai within 2 weeks. The video profile feature helped me showcase my construction skills perfectly.",
      image: "/images/testimonial-1.jpg",
      salary: "$2,800/month",
      verified: true
    },
    {
      name: "Pradip Mondal",
      location: "Singapore",
      occupation: "Manufacturing Technician",
      rating: 5,
      review: "Amazing platform! The AI matching system connected me with the right employers. Now I'm working in Singapore and supporting my family back home.",
      image: "/images/testimonial-2.jpg",
      salary: "$3,200/month",
      verified: true
    },
    {
      name: "Bhagyadhar Mondal",
      location: "Canada",
      occupation: "Warehouse Supervisor",
      rating: 5,
      review: "The community support is incredible. I got help from other successful workers and landed a great job in Canada. Skills matter more than papers here!",
      image: "/images/testimonial-3.jpg",
      salary: "$4,100/month",
      verified: true
    },
    {
      name: "Md. Rahman",
      location: "Australia",
      occupation: "Chef",
      rating: 5,
      review: "Video profiles made all the difference. Employers could see my cooking skills in action. Now I'm working in Melbourne's best restaurant!",
      image: "/images/testimonial-4.jpg",
      salary: "$3,500/month",
      verified: true
    },
    {
      name: "Sarah Ahmed",
      location: "Qatar",
      occupation: "Hospitality Manager",
      rating: 5,
      review: "From job search to landing my dream role in Doha - Overseas.ai supported me throughout. The community here is like a big family!",
      image: "/images/testimonial-5.jpg",
      salary: "$4,000/month",
      verified: true
    },
    {
      name: "Kumar Singh",
      location: "Germany",
      occupation: "Automotive Technician",
      rating: 5,
      review: "I never thought I could work in Germany! The platform's verification system gave employers confidence in my technical skills.",
      image: "/images/testimonial-6.jpg",
      salary: "$3,800/month",
      verified: true
    }
  ];

  const communityStats = [
    { label: "Success Stories", value: "5,000+", icon: Users, color: "text-green-500" },
    { label: "Countries Reached", value: "50+", icon: MapPin, color: "text-blue-500" },
    { label: "Job Placements", value: "15,000+", icon: Briefcase, color: "text-purple-500" },
    { label: "Community Growth", value: "25%", icon: TrendingUp, color: "text-orange-500" }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Join the community of{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              5k satisfied job seekers
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Real people, real success stories. See how our community members found their dream jobs overseas and transformed their careers.
          </motion.p>
        </motion.div>

        {/* Community Statistics */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          {communityStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                className="bg-white rounded-2xl p-6 text-center shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
              >
                <IconComponent className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 h-full relative overflow-hidden"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-6 opacity-10">
                  <Quote className="w-16 h-16 text-blue-600" />
                </div>

                {/* Profile Section */}
                <div className="flex items-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {testimonial.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {testimonial.location}
                    </p>
                    <p className="text-sm text-blue-600 font-semibold">{testimonial.occupation}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">({testimonial.rating}.0)</span>
                </div>

                {/* Review */}
                <p className="text-gray-700 leading-relaxed mb-6 italic">
                  "{testimonial.review}"
                </p>

                {/* Salary Badge */}
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full">
                    <span className="text-sm font-bold text-green-700">
                      Now Earning: {testimonial.salary}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    ✓ Verified Success
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold mb-4">Ready to Join Our Success Community?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Start your journey today and become the next success story. Thousands of employers are waiting to discover your skills.
            </p>
            <motion.button
              className="bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your Free Profile Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CommunityTestimonialsSection;
