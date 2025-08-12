"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { motion } from "framer-motion";
import { getHomeData } from "../../services/info.service";

type Country = { name?: string } | string;
interface HomeData {
  videos?: unknown[];
  countries?: Country[];
  occupations?: { title?: string; name?: string }[];
  topProfile?: unknown[];
}

export default function HomePage() {
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getHomeData();
        if (mounted) setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-semibold mb-6"
      >
        Discover Overseas Opportunities
      </motion.h1>

      {loading && <p>Loading...</p>}

      {!loading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm list-disc pl-5">
                {data?.countries?.slice(0, 6).map((c: Country, i: number) => (
                  <li key={i}>{typeof c === "string" ? c : c?.name ?? ""}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Popular Occupations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm list-disc pl-5">
                {data?.occupations?.slice(0, 6).map((o: { title?: string; name?: string }, i: number) => (
                  <li key={i}>{o?.title ?? o?.name ?? ""}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                {data?.topProfile?.length ?? 0} featured profiles
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
