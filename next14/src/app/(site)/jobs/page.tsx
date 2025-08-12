"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import Link from "next/link";
import { getJobListForSearch } from "../../../..//legacy/services/job.service";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Array<{ id?: string | number; title?: string; job_title?: string; location?: string; country?: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getJobListForSearch({});
        if (mounted) setJobs(data?.jobs ?? data ?? []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Jobs</h1>
      {loading && <p>Loading...</p>}
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Card key={job?.id}>
            <CardHeader>
              <CardTitle className="text-base">{job?.title ?? job?.job_title ?? "Job"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm flex items-center justify-between">
              <span>{job?.location ?? job?.country ?? ""}</span>
              {job?.id && (
                <Link
                  className="text-blue-600 underline"
                  href={`/job/${encodeURIComponent(job?.location ?? "")}/${encodeURIComponent(job?.title ?? job?.job_title ?? "")}/${job?.id}`}
                >
                  View
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
