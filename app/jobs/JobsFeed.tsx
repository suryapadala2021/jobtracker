"use client";

import "./JobsFeed.css";
import { ClientJob } from "../commonFunction/convertClientJobs";
import { useRouter, useSearchParams } from "next/navigation";
import JobCard from "./JobCard";
import EmptyState from "./EmptyState";

type Props = {
  initialJobs: ClientJob[];
  page: number;
  totalPages: number;
};


export default function JobsFeed({ initialJobs, page, totalPages }: Props) {
  const jobs = initialJobs;
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleNavPage(page: number) {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <section className="jobsFeed">
      <div className="resultsArea">
        {jobs.length === 0 && <EmptyState />}
        {jobs.length > 0 && (
          <div className="list">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>

      <div className="pagination">
        <button
          className="pageBtn"
          disabled={page <= 1}
          onClick={() => handleNavPage(page - 1)}
        >
          ← Prev
        </button>

        <span className="pageInfo">
          Page <strong>{page}</strong> of {totalPages}
        </span>

        <button
          className="pageBtn"
          disabled={page === totalPages}
          onClick={() => handleNavPage(page + 1)}
        >
          Next →
        </button>
      </div>

    </section >
  );
}
