"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const trainingPartners = [
  {
    id: 1,
    name: "Netaji Private Limited",
    image: "https://overseasdata.s3.ap-south-1.amazonaws.com/InstituteData/profileImage/TI13556/profileImage.jpg?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWDCXZNCOULZNVOK6%2F20240704%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20240704T055853Z&X-Amz-SignedHeaders=host&X-Amz-Expires=604800&X-Amz-Signature=f6483f4015b4b4f949b63819e69d5b1b96c2b5ea42f4a31f18798a140833e4ae"
  },
  {
    id: 2,
    name: "Training Institute A",
    image: "/images/institute.png"
  },
  {
    id: 3,
    name: "Training Institute B", 
    image: "/images/institute.png"
  },
  {
    id: 4,
    name: "Training Institute C",
    image: "/images/institute.png"
  },
  {
    id: 5,
    name: "Training Institute D",
    image: "/images/institute.png"
  }
];

function RegionList() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Heading Section */}
          <div className="lg:col-span-1">
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-3xl lg:text-4xl font-bold text-center text-blue-600 mb-8"
            >
              " Meet Our Training Partners... "
            </motion.h1>
          </div>

          {/* Partners Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {trainingPartners.map((partner, index) => (
                <motion.div
                  key={partner.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <img
                          src={partner.image}
                          alt={partner.name}
                          className="w-full h-48 object-cover rounded-lg"
                          style={{ maxHeight: "200px" }}
                          onError={(e) => {
                            e.currentTarget.src = "/images/institute.png";
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-600">
                        {partner.name}
                      </h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <Button 
            size="lg"
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            View All Partners
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

export default RegionList;
