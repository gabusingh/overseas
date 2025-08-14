"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Link from "next/link";
import { motion } from "framer-motion";

interface Company {
  id: number;
  name: string;
  location?: string;
  description?: string;
  logo?: string;
}

export default function RecruitingCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data - replace with actual API call
    setTimeout(() => {
      setCompanies([
        { id: 1, name: "Global Tech Solutions", location: "Dubai, UAE", description: "Leading technology company" },
        { id: 2, name: "Construction Corp", location: "Saudi Arabia", description: "Infrastructure development" },
        { id: 3, name: "Healthcare International", location: "Qatar", description: "Medical services provider" },
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
        Recruiting Companies
      </motion.h1>
      
      {loading && <p className="text-center">Loading companies...</p>}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{company.name}</CardTitle>
                {company.location && (
                  <p className="text-sm text-gray-600">{company.location}</p>
                )}
              </CardHeader>
              <CardContent>
                {company.description && (
                  <p className="text-gray-700 mb-4">{company.description}</p>
                )}
                <Link
                  href={`/company/${company.id}`}
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
