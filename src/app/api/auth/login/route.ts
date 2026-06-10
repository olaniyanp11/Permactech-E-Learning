import { NextRequest, NextResponse } from "next/server";
import { verifyAdminCredentials, createSession, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const session = await verifyAdminCredentials(email, password);
    if (!session) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await createSession(session);
    await setSessionCookie(token);

    return NextResponse.json({ success: true, admin: session });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
