import { NextRequest, NextResponse } from "next/server";
import {
  authenticateAdminLogin,
  clearAdminSessionCookie,
  setAdminSessionCookie,
} from "@/lib/asb-admin-auth";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const isValid = await authenticateAdminLogin(username, password);
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: "Invalid username or password." },
      { status: 401 }
    );
  }

  await setAdminSessionCookie();
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  await clearAdminSessionCookie();
  return NextResponse.json({ success: true });
}
