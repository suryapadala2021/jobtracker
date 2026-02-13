import { verifyJwt } from "@/lib/auth/signJwt";
import { cookies } from "next/headers";

export default async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value
    if (!token) return null;
    try {
        const response = await verifyJwt(token)
        return response
    } catch (err) {
        return null;
    }
}