"use server";

import { hashPassword } from "@/lib/auth/password";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { z } from "zod";

type RegisterInput = {
  name: string;
  email: string;
  password: string;
  role: "jobseeker" | "recruiter";
};

type RegisterFormState = {
  error?: string;
};

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["jobseeker", "recruiter"]),
});

export async function registerAction(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const input: RegisterInput = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").toLowerCase().trim(),
    password: String(formData.get("password") || ""),
    role: (formData.get("role") as RegisterInput["role"]) || "jobseeker",
  };

  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Invalid registration details" };
  }

  const { name, email, password, role } = parsed.data;

  try {
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return { error: "User with this email already exists" };
    }

    const passwordHash = await hashPassword(password);

    await User.create({
      name,
      email,
      passwordHash,
      role,
    });

  } catch (err) {
    console.error("Register error:", err);
    throw new Error("Failed to register user");
  }

  redirect("/login");
}
