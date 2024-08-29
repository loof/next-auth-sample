// library imports
import { NextResponse, NextRequest } from "next/server";

// internal imports
import { signIn } from "@/auth";

export async function POST(req: NextRequest, res: NextResponse) {
    const data = await req.json();
    const { email: email, password, type } = data;

    try {
        const result =
            type === "credentials"
                ? await signIn("credentials", { redirect: false, email: email, password })
                : await signIn("social", { redirect: false, authCode: email });

        // handle the result of the sign-in attempt
        if (!result || result.error) {
            return NextResponse.json({ error: "Invalid credentials" });
        } else {
            return NextResponse.json({ success: true });
        }
    } catch (error) {
        console.error("Error during sign-in", error);
        return NextResponse.error();
    }
}