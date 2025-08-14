"use client";
import React from "react";
import { motion } from "framer-motion";
import { Video, Shield, Globe, Zap, Users, TrendingUp, Play, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

function WhyChooseSection() {
  const features = [
    {
      icon: Video,
      title: "Video Profiles",
      description: "Show your skills in action with video demonstrations. Let employers see what you can really do.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "Verified Skills",
      description: "Your abilities are verified through our smart video analysis system for authentic profiles.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Globe,
      title: "Global Opportunities",
      description: "Connect with employers worldwide. Access jobs in over 50 countries across different industries.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Quick Matching",
      description: "Get matched with suitable employers faster. Our AI connects the right skills with the right jobs.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Join thousands of successful workers. Get support from our community throughout your journey.",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: TrendingUp,
      title: "Success Tracking",
      description: "Track your progress and build your reputation with employer ratings and success metrics.",
      color: "from-teal-500 to-blue-500"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
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
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Overseas.ai?
            </span>
          </motion.h2>
          <motion.p
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            We believe your skills matter more than certificates. Our platform helps you showcase your real abilities to employers who value practical experience.
          </motion.p>
          
          {/* Key Value Proposition */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  We connect employers and job-seekers across borders through the power of{" "}
                  <span className="text-blue-600">Video</span>
                </h3>
                <p className="text-gray-600 mb-6">
                  We go beyond traditional resumes and cover letters and utilize authentic videos to establish the credentials of blue and grey-collar workers to prospective employers.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300">
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo Video
                </Button>
              </div>
              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-90" />
                  <h4 className="text-xl font-bold mb-2">Video-First Approach</h4>
                  <p className="text-blue-100">Authentic profiles that showcase real skills</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="bg-white rounded-2xl p-8 h-full shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="relative mb-6">
                    <motion.div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} p-4 mx-auto`}
                      whileHover={{ rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.div
                      className={`absolute inset-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} opacity-20 blur-xl mx-auto`}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* How It Works Section */}
        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We connect employers and job-seekers across borders through the power of authentic video profiles
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create Video Profile",
                description: "Record videos showcasing your skills and experience. No fancy equipment needed - just show what you can do.",
                icon: Video
              },
              {
                step: "02",
                title: "Get Verified",
                description: "Our AI system verifies your skills through video analysis, creating an authentic and trustworthy profile.",
                icon: Shield
              },
              {
                step: "03",
                title: "Get Matched",
                description: "Connect with employers worldwide who value your skills. Get matched faster with our smart AI system.",
                icon: Users
              }
            ].map((step, index) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.step}
                  className="text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="relative mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                      {step.step}
                    </div>
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-white rounded-full p-2 shadow-lg">
                        <StepIcon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h4>
                  <p className="text-gray-600">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default WhyChooseSection;
