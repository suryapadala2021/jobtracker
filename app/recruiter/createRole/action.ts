"use server";

import { hashPassword } from "@/lib/auth/password";
import { connectDB } from "@/lib/mongoose";
import { User } from "@/models/User";
import { redirect } from "next/navigation";
import { z } from "zod";

type CreateRoleInput = {
    title: string;
};

type CreateRoleState = {
    error?: string;
    success?: string
};

const createRoleSchema = z.object({
        title: z.string().min(2, "Name must be at least 2 characters"),
})

export async function createRoleAction(
    prevState: CreateRoleState,
    formData: FormData
): Promise<CreateRoleState> {
    try {
        const roleData: CreateRoleInput = {
            title: String(formData.get("title") || "").trim()
            location: String(formData.get("location"))
        }
        
    } catch(err) {
        throw new Error("Failed to create a role");
    }
}