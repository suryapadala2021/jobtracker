// app/jobs/page.tsx
import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";
import JobsFeed from "./JobsFeed";
import { Types } from "mongoose";
import { mapRawJobToClientJob } from "../commonFunction/convertClientJobs";
import getCurrentUser from "../commonFunction/getCurrentUser";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function JobsPage({ searchParams }: { searchParams?: { [key: string]: string | undefined } }): Promise<React.ReactElement> {
    const { email, role } = await getCurrentUser() || {}
    if (!email) {
        redirect("/login");
    }
    if(role && role !=="jobseeker") {
        redirect("/unauthorized")
    }
    const params = await searchParams;
    const {
        page,
        search,
        minSalary,
        status,
        exp
    } = params || {};
    await connectDB();
    const currentPage = Math.max(1, Number(page) || 1);
    const limit = 20;
    const skip = (currentPage - 1) * limit
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
        companyLogo: String
        score: any
    };
    const isSearchMode = Boolean(search?.trim());
    const filters: any = {}
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
            filters["$and"] = []
            if (Number.isFinite(maxExp)) {
                filters["$and"].push(
                    { experienceMin: { $lte: maxExp } },
                    { experienceMax: { $gte: minExp } }
                );
            } else {
                filters.experienceMax = { $gte: minExp };
            }
        }
    }
    const projection: any = {
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
    };
    let sort: any;

    if (isSearchMode) {
        sort = {
            score: { $meta: "textScore" },
            createdAt: -1,
        };
    } else {
        sort = { createdAt: -1 };
    }

    const rawJobs = await Job.find(filters)
        .select(projection)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<RawJob[]>()
        .exec();
    const totalDocuments = await Job.countDocuments(filters)
    const initialJobs = rawJobs.map(mapRawJobToClientJob)
    const totalPages = Math.ceil(totalDocuments / limit)
    return <JobsFeed initialJobs={initialJobs} page={totalPages > 0 ? currentPage : 0} totalPages={totalPages} />;
}
