"use client";

import Link from "next/link";
import { useAppliedApplications } from "../AppliedApplicationsProvider";

export default function JobApplyPanel({ jobId }: { jobId: string }) {
  const { isLoading, isJobApplied, getAppliedJobId } = useAppliedApplications();

  if (isLoading) {
    return (
      <span className="jd-apply-button jd-apply-button-disabled">
        Checking application...
      </span>
    );
  }

  if (isJobApplied(jobId)) {
    return (
      <>
        <span className="jd-applied-label">Already applied</span>
        <p className="jd-applied-id">Applied Job ID: {getAppliedJobId(jobId)}</p>
        <span className="jd-apply-button jd-apply-button-disabled">
          Application submitted
        </span>
      </>
    );
  }

  return (
    <Link href={`/jobs/${jobId}/apply`} className="jd-apply-button">
      Apply now
    </Link>
  );
}
