"use server";

import { connectDB } from "@/lib/mongoose";
import Application from "@/models/Application";
import Job from "@/models/Job";
import getCurrentUser from "@/app/commonFunction/getCurrentUser";
import { Types } from "mongoose";
import { z } from "zod";

export type JobApplyFormState = {
  error?: string;
  success?: string;
};

const applySchema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().toLowerCase().email("Valid email is required"),
  resumeLink: z.string().trim().url("Resume URL must be valid"),
  note: z.string().trim().max(1000, "Message is too long").optional(),
});

export async function applyJobAction(
  prevState: JobApplyFormState,
  formData: FormData
): Promise<JobApplyFormState> {
  const input = {
    jobId: String(formData.get("jobId") || "").trim(),
    fullName: String(formData.get("fullName") || "").trim(),
    email: String(formData.get("email") || "").toLowerCase().trim(),
    resumeLink: String(formData.get("resumeLink") || "").trim(),
    note: String(formData.get("note") || "").trim(),
  };
  console.log(input)
  const parsed = applySchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Please fill all fields with valid values." };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser?.sub || !currentUser?.email) {
    return { error: "Please login to apply." };
  }

  if (currentUser.role !== "jobseeker") {
    return { error: "Only job seekers can apply." };
  }

  if (!Types.ObjectId.isValid(parsed.data.jobId)) {
    return { error: "Invalid job id." };
  }

  if (!Types.ObjectId.isValid(currentUser.sub)) {
    return { error: "Invalid user session." };
  }

  if (currentUser.email.toLowerCase() !== parsed.data.email.toLowerCase()) {
    return { error: "Use your logged-in email to apply." };
  }

  try {
    await connectDB();

    const job = await Job.findById(parsed.data.jobId)
      .select({ _id: 1, recruiterId: 1, status: 1 })
      .lean<{ _id: Types.ObjectId; recruiterId: Types.ObjectId; status: "open" | "closed" } | null>()
      .exec();
    if (!job) {
      return { error: "Job not found." };
    }

    if (job.status !== "open") {
      return { error: "This job is closed for applications." };
    }

    const userObjectId = new Types.ObjectId(currentUser.sub);

    const existing = await Application.findOne({
      jobId: job._id,
      userId: userObjectId,
    })
      .select({ _id: 1 })
      .lean()
      .exec();

    if (existing) {
      return { error: "You have already applied for this job." };
    }

    await Application.create({
      jobId: job._id,
      userId: userObjectId,
      recruiterId: job.recruiterId,
      status: "applied",
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      resumeLink: parsed.data.resumeLink,
      note: parsed.data.note || undefined,
    });

    return { success: "Application submitted successfully." };
  } catch (err) {
    console.error("Apply job error:", err);
    return { error: "Failed to submit application." };
  }
}
