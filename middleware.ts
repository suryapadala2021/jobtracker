import { verifyJwt } from "@/lib/auth/signJwt";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
    // Public routes
    const publicPaths = ["/login", "/register"];
    const path = req.nextUrl.pathname;
    const token = req.cookies.get("session")?.value
    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (publicPaths.includes(path) && !token) {
        return NextResponse.next();
    }
    const { role } = await verifyJwt(token) || {}
    if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
    }
    if (
        !(
            (role === "recruiter" && path.startsWith("/recruiter")) ||
            (role === "jobseeker" && path.startsWith("/jobs"))
        )
    ) {
        return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
    return NextResponse.next();
}
export const config = {
    matcher: [
        "/recruiter/:path*",
        "/jobs/:path*",
        "/api/applications",
        "/api/filters",
        "/api/jobs"
    ],
};
