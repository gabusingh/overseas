"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../../../components/ui/card";
import { getJobById } from "../../../../../../services/job.service";

export default function JobDetailsPage() {
  const params = useParams<{ id: string; title: string; location: string }>();
  const [job, setJob] = useState<null | { title?: string; job_title?: string; location?: string; country?: string; description?: string }>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (params?.id) {
          const res = await getJobById(params.id as string | number);
          if (mounted) setJob(res?.data ?? res);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [params?.id]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">{decodeURIComponent((params?.title as string) || "Job")}</h1>
      {loading && <p>Loading...</p>}
      {job && (
        <Card>
          <CardHeader>
            <CardTitle>{job?.title ?? job?.job_title ?? "Job Details"}</CardTitle>
          </CardHeader>
          <CardContent className="prose max-w-none">
            <p><strong>Location:</strong> {job?.location ?? job?.country ?? ""}</p>
            {job?.description && <div dangerouslySetInnerHTML={{ __html: job.description }} />}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
