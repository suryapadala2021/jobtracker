import getCurrentUser from "@/app/commonFunction/getCurrentUser";
import { mapRawApplicationToClient } from "@/app/commonFunction/convertClientApplication";
import { connectDB } from "@/lib/mongoose";
import Application from "@/models/Application";
import { Types } from "mongoose";

type RawApplication = {
    _id: Types.ObjectId,
    jobId: Types.ObjectId | {
        _id: Types.ObjectId,
        title?: string,
        companyName?: string,
        location?: string,
        status?: "open" | "closed"
    },
    userId: Types.ObjectId,
    recruiterId: Types.ObjectId,
    status: "applied" | "shortlisted" | "rejected",
    appliedAt: Date,
    fullName?: string,
    email?: string,
    resumeLink?: string,
    note?: string
}

export async function GET() {
    const currentUser = await getCurrentUser();
    if (!currentUser?.sub || !Types.ObjectId.isValid(currentUser.sub)) {
        return Response.json(
            { appliedJobIds: [], applications: [] },
            { headers: { "Cache-Control": "no-store" } }
        );
    }

    await connectDB();
    const userId = new Types.ObjectId(currentUser.sub);

    const applications = await Application.find({ userId })
        .select({
            _id: 1,
            jobId: 1,
            userId: 1,
            recruiterId: 1,
            status: 1,
            appliedAt: 1,
            fullName: 1,
            email: 1,
            resumeLink: 1,
            note: 1
        })
        .populate({
            path: "jobId",
            select: "title companyName location status",
        })
        .sort({ appliedAt: -1 })
        .lean<RawApplication[]>()
        .exec();

    const mappedApplications = applications.map(mapRawApplicationToClient);
    const appliedJobIds = mappedApplications.map((application) => application.jobId);

    return Response.json(
        { appliedJobIds, applications: mappedApplications },
        { headers: { "Cache-Control": "no-store" } }
    );
}
