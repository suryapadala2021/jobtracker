"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useActionState } from "react";
import "./apply.css";
import { applyJobAction, type JobApplyFormState } from "./action";

const initialState: JobApplyFormState = {};

export default function JobApplyComponent() {
  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const [state, formAction, isPending] = useActionState<
    JobApplyFormState,
    FormData
  >(applyJobAction, initialState);

  return (
    <main className="applyPage">
      <section className="applyCard">
        <h1 className="applyTitle">Apply for this role</h1>
        <p className="applySubtitle">Fill in basic details and submit your application.</p>

        <form className="applyForm" action={formAction}>
          <input type="hidden" name="jobId" value={jobId} />

          <label className="applyField">
            Full name
            <input
              className="applyInput"
              type="text"
              placeholder="Your name"
              disabled={isPending}
              name="fullName"
              required
            />
          </label>

          <label className="applyField">
            Email
            <input
              className="applyInput"
              type="email"
              placeholder="you@example.com"
              disabled={isPending}
              name="email"
              required
            />
          </label>

          <label className="applyField">
            Resume URL
            <input
              className="applyInput"
              type="url"
              placeholder="https://..."
              disabled={isPending}
              name="resumeLink"
              required
            />
          </label>

          <label className="applyField">
            Message
            <textarea
              className="applyTextarea"
              placeholder="Short note to recruiter"
              rows={4}
              disabled={isPending}
              name="note"
            />
          </label>

          <div
            className={`applyStatusMessage ${
              state?.error ? "applyErrorMessage" : state?.success ? "applySuccessMessage" : ""
            }`}
            role="status"
            aria-live="polite"
          >
            {state?.error || state?.success || " "}
          </div>

          <div className="applyActions">
            <button type="submit" className="applyPrimaryButton" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit application"}
            </button>
            <Link href={jobId ? `/jobs/${jobId}` : "/jobs"} className="applySecondaryButton">
              Back to job details
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}
