
import { jwtVerify, SignJWT } from "jose";
import { TextEncoder } from "util";

const JWT_SECRET = "REDACTED_JWT_SECRET";

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
}

type JwtPayload = {
    sub: string;   // user id
    email: string;
    role: string;
};

export async function signJwt(payload: JwtPayload) {
    const secret = new TextEncoder().encode(JWT_SECRET);

    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .setSubject(payload.sub)
        .sign(secret)

    return token;
}

export async function verifyJwt(token: string) {
    const secret = new TextEncoder().encode(JWT_SECRET);

    try {
        const { payload } = await jwtVerify(token, secret);
        return payload as JwtPayload;
    } catch (error) {
        console.error("JWT verification failed:", error);
        return null;
    }
}