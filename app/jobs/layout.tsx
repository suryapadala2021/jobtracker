"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";
import JobsHeader from "./JobsHeader";
import "./JobsLayout.css";

type JobsLayoutProps = {
  children: ReactNode;
};

export default function JobsLayout({ children }: JobsLayoutProps) {
  const segment = useSelectedLayoutSegment();
  const showHeader = segment === null;

  return (
    <>
      {showHeader ? (
        <div className="jobsHeaderSticky">
          <JobsHeader />
        </div>
      ) : null}
      {children}
    </>
  );
}
