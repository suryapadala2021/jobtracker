"use client";

import "./JobsFeed.css";
import { ClientJob } from "@/lib/mappers/convertClientJobs";
import { useRouter, useSearchParams } from "next/navigation";
import JobCard from "./JobCard";
import EmptyState from "./EmptyState";
import { ClientApplication } from "@/lib/mappers/convertClientApplication";
import ApplicationCard from "./[id]/apply/ApplicationCard";
import { useAppliedApplications } from "./AppliedApplicationsProvider";

type BaseProps = {
  page: number;
  totalPages: number;
};

type Props =
  | (BaseProps & { activeTab: "all"; list: ClientJob[] })
  | (BaseProps & { activeTab: "applied"; list: ClientApplication[] });


export default function JobsFeed({ list, page, totalPages, activeTab }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { applications, isLoading } = useAppliedApplications();

  function handleNavPage(page: number) {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    router.push(`/jobs?${params.toString()}`);
  }

  if (activeTab === "applied") {
    const appliedList = applications;

    return (
      <section className="jobsFeed">
        <div className="resultsArea">
          {isLoading && (
            <p className="pageInfo">Loading applied jobs...</p>
          )}
          {!isLoading && appliedList.length === 0 && <EmptyState content="applied" />}
          {!isLoading && appliedList.length > 0 && (
            <div className="list">
              {appliedList.map((application) => (
                <ApplicationCard key={application._id} application={application} />
              ))}
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="jobsFeed">
      <div className="resultsArea">
        {list.length === 0 && <EmptyState content="jobs" />}
        {list.length > 0 && (
          <div className="list">
            {list.map((job) => (
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
