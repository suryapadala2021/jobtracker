"use client"
import { useRouter } from "next/navigation";
import { useAppliedApplications } from "./AppliedApplicationsProvider";
import "./JobCard.css"
function formatRange(min: number | null, max: number | null, suffix: string) {
    if (min === null && max === null) return null;
    if (min !== null && max !== null) return `${min}-${max}${suffix}`;
    if (min !== null) return `${min}+${suffix}`;
    return `Up to ${max}${suffix}`;
}

interface Job {
    _id: string;
    title: string;
    companyName: string;
    location: string;
    postedLabel?: string;
    status: string;
    description?: string;
    experienceMin: number | null;
    experienceMax: number | null;
    salaryLabel?: string;
    skills: string[];
}

export default function JobCard({ job }: { job: Job }) {
    const router = useRouter()
    const { isJobApplied, getAppliedJobId } = useAppliedApplications();
    const experience = formatRange(job.experienceMin, job.experienceMax, " yrs");
    const salary = job.salaryLabel;
    const statusClass = job.status === "closed" ? "statusClosed" : "statusOpen";
    const applied = isJobApplied(job._id);
    const appliedJobId = getAppliedJobId(job._id);

    return (
        <article
            key={job._id}
            className={`jobCard ${job.status === "closed" ? "closed" : ""}`}
        >
            <div className="jobHeader">
                <div className="companyRow">
                    <div className="logo">
                        {
                            job.companyName.slice(0, 1).toUpperCase()
                        }
                    </div>
                    <div>
                        <div className="jobTitle">{job.title}</div>
                        <div className="meta">
                            {job.companyName}
                            <span className="dot">•</span>
                            {job.location}
                            {job.postedLabel ? (
                                <>
                                    <span className="dot">•</span>
                                    <span className="posted">Posted {job.postedLabel}</span>
                                </>
                            ) : null}
                        </div>
                    </div>
                </div>
                <span className={`status ${statusClass}`}>{job.status}</span>
            </div>

            <p className="description">{job.description || "No description provided."}</p>

            <div className="tags">
                {experience ? <span className="tag">{experience}</span> : null}
                {salary ? <span className="tag">{salary}</span> : null}
                
                {job.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="tag">
                        {skill}
                    </span>
                ))}

                {job.skills.length > 3 && (
                    <span className="moreSkills">
                        +{job.skills.length - 3}
                        <div className="skillsTooltip">
                            {job.skills.slice(3).map(skill => (
                                <span key={skill} className="tag">{skill}</span>
                            ))}
                        </div>
                    </span>
                )}
            </div>

            <div className="footer" >
                <span className="type">Full-time</span>
                <button disabled ={job.status === "closed"} className={`applyBtn ${job.status === "closed" ? "applyDisabled" : ""}`} onClick={() => (router.push(`/jobs/${job._id}`))}>
                    View details
                </button>
            </div>
        </article>
    );
}
