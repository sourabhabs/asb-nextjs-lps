import { NextRequest, NextResponse } from "next/server";
import {
  normalizeLeadPayload,
  startPmaxLeadCapture,
  validateLeadPayload,
} from "@/lib/asb-lead-flow";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const payload = normalizeLeadPayload(formData);
    const validationError = validateLeadPayload(payload);

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 }
      );
    }

    const leadDocId = await startPmaxLeadCapture(payload, req.headers.get("x-forwarded-for"));

    return NextResponse.json({ success: true, leadDocId, message: "Lead captured successfully" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to start Pmax lead flow";

    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
