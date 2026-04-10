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
    const verified = await verifyLeadOtp(q);
    return new NextResponse(verified ? "1" : "0", {
      headers: { "Content-Type": "text/plain" },
    });
  } catch {
    return new NextResponse("0", {
      headers: { "Content-Type": "text/plain" },
    });
  }
}
