"use server";

import { comparePassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { signJwt } from "@/lib/auth/signJwt";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { z } from "zod";

type LoginFormState = {
  error?: string;
};

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["jobseeker", "recruiter"]),
});

export async function loginAction(
  prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const input = {
    email: String(formData.get("email") || "").toLowerCase().trim(),
    password: String(formData.get("password") || ""),
    role: formData.get("role") as "jobseeker" | "recruiter",
  };

  const parsed = loginSchema.safeParse(input);

  if (!parsed.success) {
    return { error: "Invalid email or password format" };
  }

  await connectDB();

  const user = await User.findOne({
    email: parsed.data.email,
    role: parsed.data.role,
  });

  if (!user) {
    return { error: "Invalid email, password, or role" };
  }

  const isValidPassword = await comparePassword(
    parsed.data.password,
    user.passwordHash
  );

  if (!isValidPassword) {
    return { error: "Invalid email, password, or role" };
  }

  const token = await signJwt({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  await setSessionCookie(token);

  // SUCCESS → redirect (never return)
  if (user.role === "jobseeker") {
    redirect("/jobs");
  } else {
    redirect("/recruiter");
  }
}
