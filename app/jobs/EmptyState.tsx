"use client"

import "./EmptyState.css"

type Props = {
  content: string
}
function EmptyState({ content }: Props) {
  return (
    <div className="emptyState">
      <h3>{content === "applied" ? "No Applied Jobs" : "No jobs found"}</h3>
      <p>{content === "applied" ? "Please go and apply for available jobs" : "Try adjusting your search or filters."}</p>
    </div>
  );
}
export default EmptyState