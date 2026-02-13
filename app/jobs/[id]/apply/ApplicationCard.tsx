"use client";

import { useRouter } from "next/navigation";
import { ClientApplication } from "@/lib/mappers/convertClientApplication";
import "./ApplicationCard.css";

type ApplicationLevel = {
    label: string;
    level: number;
    activeSteps: number;
    toneClass: string;
    progressClass: string;
};

function getApplicationLevel(status: ClientApplication["status"]): ApplicationLevel {
    if (status === "shortlisted") {
        return {
            label: "Shortlisted",
            level: 2,
            activeSteps: 2,
            toneClass: "applicationToneShortlisted",
            progressClass: "applicationProgressShortlisted"
        };
    }

    if (status === "rejected") {
        return {
            label: "Rejected",
            level: 0,
            activeSteps: 1,
            toneClass: "applicationToneRejected",
            progressClass: "applicationProgressRejected"
        };
    }

    return {
        label: "Applied",
        level: 1,
        activeSteps: 1,
        toneClass: "applicationToneApplied",
        progressClass: "applicationProgressApplied"
    };
}

export default function ApplicationCard({ application }: { application: ClientApplication }) {
    const router = useRouter();
    const canOpenJob = Boolean(application.jobId);
    const companyInitial = application.companyName?.slice(0, 1).toUpperCase() || "J";
    const title = application.jobTitle || "Job title unavailable";
    const company = application.companyName || "Company unavailable";
    const location = application.location || "Location unavailable";
    const levelInfo = getApplicationLevel(application.status);

    return (
        <article className="applicationCard">
            <div className="applicationHeader">
                <div className="applicationCompanyRow">
                    <div className="applicationLogo">{companyInitial}</div>
                    <div>
                        <div className="applicationTitle">{title}</div>
                        <div className="applicationMeta">
                            {company}
                            <span className="applicationDot">•</span>
                            {location}
                        </div>
                    </div>
                </div>
                <div className={`applicationLevelBadge ${levelInfo.toneClass}`}>
                    <span className="applicationLevelText">Level {levelInfo.level}</span>
                    <span className="applicationLevelState">{levelInfo.label}</span>
                </div>
            </div>

            <p className="applicationDescription">
                Applied on {application.appliedAt || "Unknown date"}
            </p>

            <div className={`applicationLevelWrap ${levelInfo.progressClass}`} aria-label={`Application level ${levelInfo.level}`}>
                <div className="applicationLevelTrack" aria-hidden>
                    <span className={`applicationLevelNode ${levelInfo.activeSteps >= 1 ? "isActive" : ""}`}>1</span>
                    <span className={`applicationLevelLine ${levelInfo.activeSteps >= 2 ? "isActive" : ""}`} />
                    <span className={`applicationLevelNode ${levelInfo.activeSteps >= 2 ? "isActive" : ""}`}>2</span>
                    <span className={`applicationLevelLine ${levelInfo.activeSteps >= 3 ? "isActive" : ""}`} />
                    <span className={`applicationLevelNode ${levelInfo.activeSteps >= 3 ? "isActive" : ""}`}>3</span>
                </div>
                <div className="applicationLevelLabels" aria-hidden>
                    <span>Applied</span>
                    <span>Shortlisted</span>
                    <span>Offer</span>
                </div>
            </div>

            <div className="applicationTags">
                <span className="applicationTag">Application ID: {application._id.slice(-6)}</span>
                <span className="applicationTag">Job ID: {application.jobId.slice(-6)}</span>
                <span className="applicationTag">Job status: {application.jobStatus}</span>
            </div>

            <div className="applicationFooter">
                <span className="applicationType">Application</span>
                <button
                    disabled={!canOpenJob}
                    className={`applicationActionBtn ${!canOpenJob ? "applicationActionDisabled" : ""}`}
                    onClick={() => router.push(`/jobs/${application.jobId}`)}
                >
                    View job
                </button>
            </div>
        </article>
    );
}
