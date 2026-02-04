export type ClientJob = {
    _id: string;
    title: string;
    location: string;
    description: string;
    status: string;
    skills: string[];
    experienceMin: number | null;
    experienceMax: number | null;
    salaryMin: number | null;
    salaryMax: number | null;
    createdAt: string | null;
    postedLabel: string;
    salaryLabel: string;
    companyName: string;
    companyLogo: string;
    textScore: string | undefined;
};

function salaryFormate(min: any, max: any) {
    min = typeof min === "number" ? min : null;
    max = typeof max === "number" ? max : null;
    const fmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 1 });
    const toLpa = (value: number) => fmt.format(value / 100000);
    if (min === null && max === null) return "";
    if (min !== null && max !== null) return `${toLpa(min)}-${toLpa(max)} LPA`;
    if (min !== null) return `${toLpa(min)}+ LPA`;
    return `Up to ${toLpa(max as number)} LPA`;
}


export function mapRawJobToClientJob(job: any): ClientJob {
    const createdDate = job.createdAt
        ? new Date(job.createdAt as string | number | Date)
        : null;

    return {
        _id: String(job._id),
        title: String(job.title ?? ""),
        location: String(job.location ?? ""),
        description: String(job.description ?? ""),
        status: String(job.status ?? "open"),
        skills: Array.isArray(job.skills)
            ? job.skills.map((skill: any) => String(skill))
            : [],
        experienceMin:
            typeof job.experienceMin === "number" ? job.experienceMin : null,
        experienceMax:
            typeof job.experienceMax === "number" ? job.experienceMax : null,
        salaryMin:
            typeof job.salaryMin === "number" ? job.salaryMin : null,
        salaryMax:
            typeof job.salaryMax === "number" ? job.salaryMax : null,
        createdAt: createdDate ? createdDate.toISOString() : null,
        postedLabel: createdDate
            ? new Intl.DateTimeFormat("en-IN", {
                month: "short",
                day: "2-digit",
                year: "numeric",
                timeZone: "UTC",
            }).format(createdDate)
            : "",
        salaryLabel: salaryFormate(job.salaryMin, job.salaryMax),
        companyName: String(job.companyName ?? ""),
        companyLogo: String(job.companyLogo ?? ""),
        textScore: job.textScore
    };
}
