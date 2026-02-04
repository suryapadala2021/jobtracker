import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "session";

export async function setSessionCookie(token: string) {
    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,                           
        secure: false,
        sameSite: "lax",                          // 🔐 CSRF protection
        path: "/",                                // available to whole site
        maxAge: 60 * 60 * 24 * 7,                 // 7 days (match JWT)
    });
}
