import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";
import type { Types } from "mongoose";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import getCurrentUser from "@/app/commonFunction/getCurrentUser";
import "./jobDetails.css";
type SalaryFormatType = "full" | "compact";

const formatINR = (amount: number, type: SalaryFormatType = "full") => {
  if (type === "compact") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatYears = (min?: number | null, max?: number | null) => {
  if (typeof min === "number" && typeof max === "number") {
    return `${min}-${max} yrs`;
  }
  if (typeof min === "number") return `${min}+ yrs`;
  if (typeof max === "number") return `Up to ${max} yrs`;
  return null;
};

const formatSalary = (min?: number | null, max?: number | null) => {
  if (typeof min === "number" && typeof max === "number") {
    return `${formatINR(min, "compact")} - ${formatINR(max, "compact")}`;
  }
  if (typeof min === "number") return `${formatINR(min, "compact")}+`;
  if (typeof max === "number") return `Up to ${formatINR(max, "compact")}`;
  return null;
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "JB";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

/* =======================
   Types
======================= */

type JobLean = {
  _id: Types.ObjectId;
  title?: string;
  description?: string;
  skills?: string[];
  location?: string;
  recruiterId?: Types.ObjectId;
  createdAt?: Date;
  experienceMin?: number;
  experienceMax?: number;
  salaryMin?: number;
  salaryMax?: number;
  companyName?: string;
  companyLogo?: string;
};

type JobDTO = {
  _id: string;
  title: string;
  description: string;
  skills: string[];
  location: string;
  recruiterId?: string;
  createdAt: string | null;
  experienceMin?: number | null;
  experienceMax?: number | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  companyName?: string;
  companyLogo?: string;
};

type JobInfoPageProps = {
  params: {
    id: string;
  };
};

/* =======================
   ISR Cache (HTML)
======================= */
export const revalidate = 300;

/* =======================
   Cached Data Fetcher
   (Avoids double DB calls)
======================= */
const getJobById = cache(async (id: string): Promise<JobDTO | null> => {

  await connectDB();

  const job = await Job.findById(id)
    .select({
      title: 1,
      description: 1,
      skills: 1,
      location: 1,
      recruiterId: 1,
      createdAt: 1,
      experienceMin: 1,
      experienceMax: 1,
      salaryMin: 1,
      salaryMax: 1,
      companyName: 1,
      companyLogo: 1,
    })
    .lean<JobLean>()
    .exec();

  if (!job) return null;

  // Normalize to DTO (JSON-safe)
  return {
    _id: job._id.toString(),
    title: String(job.title ?? ""),
    description: String(job.description ?? ""),
    skills: Array.isArray(job.skills) ? job.skills : [],
    location: String(job.location ?? ""),
    recruiterId: job.recruiterId
      ? job.recruiterId.toString()
      : undefined,
    createdAt: job.createdAt
      ? new Date(job.createdAt).toISOString()
      : null,
    experienceMin: typeof job.experienceMin === "number" ? job.experienceMin : null,
    experienceMax: typeof job.experienceMax === "number" ? job.experienceMax : null,
    salaryMin: typeof job.salaryMin === "number" ? job.salaryMin : null,
    salaryMax: typeof job.salaryMax === "number" ? job.salaryMax : null,
    companyName: String(job.companyName ?? ""),
    companyLogo: String(job.companyLogo ?? ""),
  };
});

/* =======================
   SEO Metadata
======================= */
export async function generateMetadata({ params }: JobInfoPageProps) {
  const { id } = await params;
  const job = await getJobById(id);

  if (!job) {
    return { title: "Job not found | Job Portal" };
  }
  console.log("Generating metadata for job:", job.title);
  return {
    title: `${job.title} in ${job.location} | Job Portal`,
    description: job.description.slice(0, 160),
    alternates: {
      canonical: `/jobs/${id}`,
    },
  };
}

/* =======================
   Page Component
======================= */
export default async function JobInfoPage({ params }: JobInfoPageProps) {
  const { email, role } = await getCurrentUser() || {}
  if (!email) {
    redirect("/login");
  }
  if (role && role !== "jobseeker") {
    redirect("/unauthorized")
  }
  const { id } = await params;

  const job = await getJobById(id);

  // Proper 404 semantics
  if (!job) {
    notFound();
  }

  const postedLabel = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "Recently";
  const experienceLabel = formatYears(job.experienceMin, job.experienceMax);
  const salaryLabel = formatSalary(job.salaryMin, job.salaryMax);

  return (
    <div className="jd-page">
      <div className="jd-container">
        <div className="jd-top-row">
          <Link
            href="/jobs"
            className="jd-back-link"
          >
            <span className="jd-back-icon">
              ←
            </span>
            Back to jobs
          </Link>
          <span className="jd-page-tag">
            Job details
          </span>
        </div>

        <div className="jd-grid">
          <div className="jd-main-card">
            <div className="jd-main-header">
              <div>
                <div className="jd-open-tag">
                  OPEN ROLE
                </div>

                <h1 className="jd-job-title">
                  {job.title}
                </h1>

                <div className="jd-meta-row">
                  {job.companyName ? (
                    <span className="jd-meta-pill">
                      {job.companyName}
                    </span>
                  ) : null}
                  <span className="jd-meta-pill">
                    <span className="jd-meta-dot" />
                    {job.location}
                  </span>
                  <span className="jd-meta-pill">
                    Posted {postedLabel}
                  </span>
                </div>
              </div>

              <div className="jd-logo-badge">
                {job.companyLogo ? (
                  <img
                    src={job.companyLogo}
                    alt={job.companyName || "Company logo"}
                    className="jd-logo-image"
                  />
                ) : (
                  getInitials(job.companyName || job.title)
                )}
              </div>
            </div>

            <div className="jd-info-grid">
              <div className="jd-info-card">
                <p className="jd-info-label">
                  Focus
                </p>
                <p className="jd-info-value">
                  Impactful delivery
                </p>
              </div>
              <div className="jd-info-card">
                <p className="jd-info-label">
                  Interview
                </p>
                <p className="jd-info-value">
                  Portfolio walkthrough
                </p>
              </div>
              <div className="jd-info-card">
                <p className="jd-info-label">
                  Action
                </p>
                <p className="jd-info-value">Apply this week</p>
              </div>
            </div>

            {(experienceLabel || salaryLabel || job.companyName) ? (
              <div className="jd-detail-grid">
                <div className="jd-detail-card">
                  <p className="jd-info-label">
                    Experience
                  </p>
                  <p className="jd-info-value">
                    {experienceLabel || "Not specified"}
                  </p>
                </div>
                <div className="jd-detail-card">
                  <p className="jd-info-label">
                    Salary
                  </p>
                  <p className="jd-info-value">
                    {salaryLabel || "Not specified"}
                  </p>
                </div>
                <div className="jd-detail-card">
                  <p className="jd-info-label">
                    Company
                  </p>
                  <p className="jd-info-value">
                    {job.companyName || "Not specified"}
                  </p>
                </div>
              </div>
            ) : null}

            <div className="jd-summary-card">
              <h2 className="jd-summary-title">Role summary</h2>
              <p className="jd-summary-text">{job.description}</p>
            </div>

            <div className="jd-skills-section">
              <h3 className="jd-skills-title">
                Key skills to highlight
              </h3>
              {job.skills.length > 0 ? (
                <div className="jd-skills-list">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="jd-skill-tag"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="jd-skills-empty">
                  Add core skills for this role to personalize your application.
                </p>
              )}
            </div>
          </div>

          <div className="jd-side-column">
            <div className="jd-side-card">
              <h3 className="jd-side-title">
                Ready to apply?
              </h3>
              <p className="jd-side-text">
                Capture the application now and keep your follow-ups on track.
              </p>
              <Link
                href={`/jobs/${job._id}/apply`}
                className="jd-apply-button"
              >
                Apply now
              </Link>
              <Link
                href="/jobs"
                className="jd-secondary-button"
              >
                Save and return later
              </Link>
            </div>

            <div className="jd-side-card jd-side-card-alt">
              <h3 className="jd-side-title">
                Interview prep
              </h3>
              <ul className="jd-prep-list">
                <li className="jd-prep-item">
                  Highlight two achievements that match the role summary.
                </li>
                <li className="jd-prep-item">
                  Bring metrics for impact (time saved, revenue, adoption).
                </li>
                <li className="jd-prep-item">
                  Prepare a short story for collaboration and conflict resolution.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
