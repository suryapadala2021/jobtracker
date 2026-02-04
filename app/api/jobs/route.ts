import { mapRawJobToClientJob } from "@/app/commonFunction/convertClientJobs";
import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET(req: Request) {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const search = searchParams.get("search");

    const limit = 20;

    const filters: any = {};
    if (cursor) {
        filters.createdAt = { $lt: new Date(cursor) };
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
    let sort: any = { createdAt: -1 };
    if (search?.trim()) {
        projection.score = { $meta: "textScore" };
        sort = {
            score: { $meta: "textScore" },
            createdAt: -1,
        };
    }
    const jobs = (await Job.find(filters)
        .select(projection)
        .sort(sort)
        .limit(limit)
        .lean()).map(mapRawJobToClientJob);

    const nextCursor =
        jobs.length === limit ? jobs[jobs.length - 1].createdAt
            : null;

    return Response.json({
        jobs,
        nextCursor,
    });
}
