"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import { motion } from "framer-motion";

interface Institute {
  id: number;
  name: string;
  location?: string;
  description?: string;
  courses?: string[];
}

export default function TrainingInstitutesPage() {
  const [institutes, setInstitutes] = useState<Institute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setInstitutes([
        {
          id: 1,
          name: "Skills Development Center",
          location: "Mumbai, India",
          description: "Professional skills training institute",
          courses: ["Welding", "Electrical", "Plumbing"]
        },
        {
          id: 2,
          name: "Technical Training Institute",
          location: "Delhi, India",
          description: "Advanced technical education",
          courses: ["HVAC", "Carpentry", "Masonry"]
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center"
      >
        Training Institutes
      </motion.h1>
      
      {loading && <p className="text-center">Loading institutes...</p>}
      
      <div className="grid gap-6 md:grid-cols-2">
        {institutes.map((institute, index) => (
          <motion.div
            key={institute.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{institute.name}</CardTitle>
                {institute.location && (
                  <p className="text-sm text-gray-600">{institute.location}</p>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {institute.description && (
                  <p className="text-gray-700">{institute.description}</p>
                )}
                
                {institute.courses && institute.courses.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">Courses Offered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {institute.courses.map((course, idx) => (
                        <Badge key={idx} variant="secondary">
                          {course}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <Link
                  href={`/institute-details/${institute.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Details →
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
