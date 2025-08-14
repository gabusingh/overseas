"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Download, Users, Award, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";

function AppPromationSection() {
  const appStats = [
    { label: "Play Store Ratings", value: "4.5", icon: Star },
    { label: "Reviews", value: "612+", icon: Users },
    { label: "Downloads", value: "10K+", icon: Download },
    { label: "Rated for", value: "18+", icon: Award }
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="text-white"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Get the Overseas Jobs App
            </motion.h2>
            
            <motion.p 
              className="text-xl text-blue-100 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Join the community of 5k satisfied job seekers. Take your job search on the go with instant notifications, easy applications, and direct recruiter communication.
            </motion.p>
            
            {/* App Statistics */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              {appStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20"
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1, type: "spring" }}
                    viewport={{ once: true }}
                  >
                    <IconComponent className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                    <div className="text-xs text-blue-200">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>
            
            {/* Features List */}
            <motion.ul 
              className="mb-8 space-y-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {[
                "Video profile creation on mobile",
                "Instant job match notifications",
                "Easy one-tap applications",
                "Direct chat with employers",
                "Track application progress"
              ].map((feature, index) => (
                <motion.li 
                  key={feature}
                  className="flex items-center text-blue-100"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <CheckCircle className="w-5 h-5 mr-3 text-green-400 flex-shrink-0" />
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
            
            {/* Download Button */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-4 rounded-2xl shadow-xl border-0 text-lg"
                >
                  <a
                    href="https://play.google.com/store/apps/details?id=ai.overseas"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center"
                  >
                    <Download className="w-6 h-6 mr-3" />
                    Download App
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* App Image Section */}
          <motion.div 
            className="text-center lg:text-right relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {/* Floating Rating Badge */}
            <motion.div
              className="absolute top-10 left-10 bg-yellow-400 text-black px-4 py-2 rounded-2xl font-bold shadow-2xl z-20"
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 2, 0]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-black">4.5</span>
              </div>
              <div className="text-xs font-semibold">612+ Reviews</div>
            </motion.div>
            
            {/* Download Badge */}
            <motion.div
              className="absolute bottom-20 right-0 bg-green-500 text-white px-4 py-2 rounded-2xl font-bold shadow-2xl z-20"
              animate={{ 
                y: [0, 10, 0],
                rotate: [0, -2, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 1.5 }}
            >
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span className="text-lg font-black">10K+</span>
              </div>
              <div className="text-xs font-semibold">Downloads</div>
            </motion.div>
            
            {/* Phone Image */}
            <motion.div
              className="relative"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              whileHover={{
                scale: 1.05,
                rotateY: 10,
                rotateX: 5,
              }}
            >
              <div className="relative z-10">
                <Image
                  src="/images/mobile-app.svg"
                  alt="Overseas.ai Mobile App - 4.5 Star Rating"
                  width={400}
                  height={600}
                  className="max-h-96 w-auto mx-auto drop-shadow-2xl"
                />
              </div>
              
              {/* Glowing Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-transparent via-yellow-400/20 to-transparent rounded-3xl blur-2xl"
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default AppPromationSection;
