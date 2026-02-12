// app/jobs/page.tsx
import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";
import JobsFeed from "./JobsFeed";
import { Types } from "mongoose";
import type { SortOrder } from "mongoose";
import { mapRawJobToClientJob } from "../commonFunction/convertClientJobs";
import getCurrentUser from "../commonFunction/getCurrentUser";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

type RawJob = {
    _id: Types.ObjectId,
    title: string,
    location: string,
    description: string,
    skills: string[],
    status: string,
    createdAt: Date,
    experienceMin?: number,
    experienceMax?: number,
    salaryMin?: number,
    salaryMax?: number,
    companyName: string,
    companyLogo: string,
    score?: number
}

export default async function JobsPage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }): Promise<React.ReactElement> {
    const { email, role, sub } = await getCurrentUser() || {}
    if (!email || !role || !sub || !Types.ObjectId.isValid(sub)) {
        redirect("/login");
    }
    if (role && role !== "jobseeker") {
        redirect("/unauthorized")
    }
    const params = await searchParams;
    const { page, search, minSalary, status, exp, tab } = params || {};

    const currentPage = Math.max(1, Number(page) || 1);
    const limit = 20;
    const skip = (currentPage - 1) * limit
    const activeTab = tab === "applied" ? "applied" : "all";

    if (activeTab === "applied") {
        return <JobsFeed list={[]} page={0} totalPages={0} activeTab={activeTab} />;
    }

    await connectDB();

    const filters: Record<string, unknown> = {}
    const projection = {
        _id: 1,
        title: 1,
        location: 1,
        description: 1,
        createdAt: 1,
        skills: 1,
        status: 1,
        experienceMin: 1,
        experienceMax: 1,
        salaryMin: 1,
        salaryMax: 1,
        companyName: 1,
        companyLogo: 1,
    }

    const isSearchMode = Boolean(search?.trim());
    const normalizedSearch = search?.trim();
    if (normalizedSearch) {
        filters.$text = { $search: normalizedSearch };
    }
    if (minSalary) {
        const minSal = Number(minSalary)
        if (Number.isFinite(minSal)) {
            filters.salaryMin = { $gte: minSal }
        }
    }
    if (status && (status === "open" || status === "closed")) {
        filters.status = status
    } else {
        filters.status = "open"
    }
    if (exp) {
        const [minStr, maxStr] = exp.split("-");
        const minExp = Number(minStr);
        const maxExp = maxStr === "+" ? Infinity : Number(maxStr);
        if (Number.isFinite(minExp)) {
            filters.$and = []
            if (Number.isFinite(maxExp)) {
                (filters.$and as Array<Record<string, { $lte?: number, $gte?: number }>>).push(
                    { experienceMin: { $lte: maxExp } },
                    { experienceMax: { $gte: minExp } }
                );
            } else {
                filters.experienceMax = { $gte: minExp };
            }
        }
    }

    const sort: Record<string, SortOrder | { $meta: "textScore" }> = isSearchMode
        ? { score: { $meta: "textScore" }, createdAt: -1 as SortOrder }
        : { createdAt: -1 as SortOrder };

    const jobs = await Job.find(filters)
        .select(projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<RawJob[]>()
        .exec();

    const totalDocuments = await Job.countDocuments(filters)
    const totalPages = Math.ceil(totalDocuments / limit)
    const initialList = jobs.map(mapRawJobToClientJob)

    return <JobsFeed list={initialList} page={totalPages > 0 ? currentPage : 0} totalPages={totalPages} activeTab={activeTab} />;
}
