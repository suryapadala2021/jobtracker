export type ClientApplication = {
    _id: string,
    jobId: string,
    userId: string,
    recruiterId: string,
    status: "applied" | "shortlisted" | "rejected",
    appliedAt: string,
    jobTitle: string,
    companyName: string,
    location: string,
    jobStatus: "open" | "closed" | "unknown"
};

type RawPopulatedJob = {
    _id: string | { toString(): string },
    title?: string,
    companyName?: string,
    location?: string,
    status?: "open" | "closed"
}

type RawApplication = {
    _id: string | { toString(): string },
    jobId: string | { toString(): string } | RawPopulatedJob,
    userId: string | { toString(): string },
    recruiterId: string | { toString(): string },
    status: "applied" | "shortlisted" | "rejected",
    appliedAt: Date | string
}

function isRawPopulatedJob(job: RawApplication["jobId"]): job is RawPopulatedJob {
    return typeof job === "object" && job !== null && "_id" in job;
}

function getJobId(job: RawApplication["jobId"]): string {
    if (typeof job === "string") return job;
    if (isRawPopulatedJob(job)) {
        return String(job._id);
    }
    return String(job);
}

function getJobField(job: RawApplication["jobId"], field: keyof Omit<RawPopulatedJob, "_id">): string {
    if (isRawPopulatedJob(job)) {
        const value = job[field];
        return value ? String(value) : "";
    }
    return "";
}

function getJobStatus(job: RawApplication["jobId"]): "open" | "closed" | "unknown" {
    if (isRawPopulatedJob(job)) {
        if (job.status === "open" || job.status === "closed") {
            return job.status;
        }
    }
    return "unknown";
}

export function mapRawApplicationToClient(application: RawApplication): ClientApplication {
    const appliedDate = application.appliedAt instanceof Date
        ? application.appliedAt
        : new Date(application.appliedAt);

    return {
        _id: String(application._id),
        jobId: getJobId(application.jobId),
        userId: String(application.userId),
        recruiterId: String(application.recruiterId),
        status: application.status,
        appliedAt: Number.isNaN(appliedDate.getTime()) ? "" : appliedDate.toDateString(),
        jobTitle: getJobField(application.jobId, "title"),
        companyName: getJobField(application.jobId, "companyName"),
        location: getJobField(application.jobId, "location"),
        jobStatus: getJobStatus(application.jobId)
    }
}
