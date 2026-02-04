"use client"

import  "./EmptyState.css"

function EmptyState() {
  return (
    <div className="emptyState">
      <h3>No jobs found</h3>
      <p>Try adjusting your search or filters.</p>
    </div>
  );
}
export default EmptyState