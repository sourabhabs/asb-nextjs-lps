import { NextRequest, NextResponse } from "next/server";
import { resendLeadOtp, verifyLeadOtp } from "@/lib/asb-lead-flow";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") ?? "";

  if (q === "resend") {
    try {
      await resendLeadOtp();
      return new NextResponse(
        "<span style='color:#009900'>OTP resent successfully</span>",
        { headers: { "Content-Type": "text/html" } }
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to resend OTP. Try again!";

      return new NextResponse(
        `<span style='color:#990000'>${message}</span>`,
        { headers: { "Content-Type": "text/html" } }
      );
    }
  }

  try {
    const { cookies: getCookies } = await import("next/headers");
    const cookieStore = await getCookies();
    const leadDocId = cookieStore.get("asb_lead_doc_id")?.value ?? "";

    const verified = await verifyLeadOtp(q);
    const returnId = req.nextUrl.searchParams.get("returnId") === "1";

    if (verified && returnId) {
      return new NextResponse(`1|${leadDocId}`, {
        headers: { "Content-Type": "text/plain" },
      });
    }

    return new NextResponse(verified ? "1" : "0", {
      headers: { "Content-Type": "text/plain" },
    });
  } catch {
    return new NextResponse("0", {
      headers: { "Content-Type": "text/plain" },
    });
  }
}
