"use server";
import getCurrentUser from "@/lib/auth/getCurrentUser";
import { connectDB } from "@/lib/mongoose";
import Job from "@/models/Job";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

type CreateRoleState = {
    error?: string;
    success?: string
};

function normalizeText(str: string) {
    return str
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, c => c.toUpperCase());
}

function searchNormalizeText(str: string) {
    return str
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase();
}
const requiredNumber = (label: string, minMessage: string) =>
    z.preprocess((val) => {
        if (val === null || val === undefined) return undefined;
        if (typeof val === "string") {
            const trimmed = val.trim();
            if (trimmed === "") return undefined;
            const num = Number(trimmed);
            return Number.isFinite(num) ? num : NaN;
        }
        if (typeof val === "number") return val;
        return undefined;
    }, z.number().min(0, minMessage));

const createRoleSchema = z.object({
    title: z.string().min(2, "Name must be at least 2 characters"),
    location: z.string().min(2, "Location must be at least 2 characters"),
    description: z.string().min(30, "Job Description at least 30 characters"),
    skills: z
        .string()
        .min(2, "Skills required")
        .refine(
            (val) => val.split(",").map(s => s.trim()).filter(Boolean).length > 0,
            "Invalid skills format"
        ),
    experienceMin: requiredNumber("Min Experience", "Min Experience ≥ 0"),
    experienceMax: requiredNumber("Max Experience", "Max Experience ≥ 0"),
    salaryMin: requiredNumber("Minimum Salary", "Minimum Salary ≥ 0"),
    salaryMax: requiredNumber("Maximum Salary", "Maximum Salary ≥ 0"),
    companyName: z.string().min(2, "Company Name must be at least 2 characters"),
    companyLogo: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
})
    .refine(d => d.experienceMax >= d.experienceMin, {
        message: "Max experience must be ≥ Min experience",
        path: ["experienceMax"],
    })
    .refine(d => d.salaryMax >= d.salaryMin, {
        message: "Max salary must be ≥ Min salary",
        path: ["salaryMax"],
    });

type CreateRoleInput = z.infer<typeof createRoleSchema>;

export async function createRoleAction(
    prevState: CreateRoleState,
    formData: FormData
): Promise<CreateRoleState> {
    try {
        await connectDB()
        const { sub, role } = await getCurrentUser() || {}
        if (role !== "recruiter") {
            redirect("/jobs")
        }
        const roleData = {
            title: String(formData.get("title") || "").trim(),
            location: String(formData.get("location") || "").trim(),
            description: String(formData.get("description") || "").trim(),
            skills: String(formData.get("skills") || "").trim(),
            experienceMin: formData.get("experienceMin"),
            experienceMax: formData.get("experienceMax"),
            salaryMin: formData.get("salaryMin"),
            salaryMax: formData.get("salaryMax"),
            companyName: String(formData.get("companyName") || "").trim(),
            companyLogo: String(formData.get("companyLogo") || "").trim(),
        };

        const parsed = createRoleSchema.safeParse(roleData);
        if (!parsed.success) {
            return { error: parsed.error.issues[0]?.message ?? "Invalid Login Data" };
        }
        const newJob = {
            title: normalizeText(parsed.data.title),
            titleNormalized: searchNormalizeText(parsed.data.title),
            location: normalizeText(parsed.data.location),
            locationNormalized: searchNormalizeText(parsed.data.location),
            description: parsed.data.description.trim().replace(/\s+/g, " "),
            descriptionNormalized: searchNormalizeText(parsed.data.description),
            skills: parsed.data.skills.split(",").map((each) => normalizeText(each)),
            skillsNormalized: parsed.data.skills.split(",").map((each) => searchNormalizeText(each)),
            status: "open",
            createdAt: new Date(),
            companyName: normalizeText(parsed.data.companyName),
            companyNormalized: searchNormalizeText(parsed.data.companyName),
            companyLogo: parsed.data.companyLogo,
            experienceMin: parsed.data.experienceMin,
            experienceMax: parsed.data.experienceMax,
            salaryMin: parsed.data.salaryMin,
            salaryMax: parsed.data.salaryMax,
            recruiterId: new mongoose.Types.ObjectId(sub)
        }
        await Job.create(newJob)
        revalidatePath("/jobs");
        return { success: "Opening Successfully Created" }
    } catch (err) {
        console.log(err)
        throw new Error("Failed to create a role");
    }
}
