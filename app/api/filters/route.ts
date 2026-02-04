import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";

export async function GET() {
    await connectDB();
    const [salaryStats] = await Promise.all([
        Job.aggregate([
            {
                $group: {
                    _id: null,
                    maxSalary: { $max: "$salaryMax"},
                },
            },
        ]),
    ]);
    const { maxSalary } = salaryStats[0] || {
        maxSalary: 0,
    };

    return Response.json({
        maxSalary
    });
}
