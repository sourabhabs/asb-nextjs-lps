import type { Metadata } from "next";
import ThankYouPage from "@/app/components/ThankYouPage";
import ThankYouTracking from "@/app/components/ThankYouTracking";
import { getThankYouLeadCookieData } from "@/lib/asb-lead-flow";

export const metadata: Metadata = {
  title: "Thank You | Asian School of Business",
  description: "Thank you for your BBA enquiry to Asian School of Business.",
};

export default async function BbaThankYouPage() {
  const { applicantName, courseLabel } = await getThankYouLeadCookieData();

  return (
    <>
      <ThankYouTracking conversionSendTo="AW-862684608/nckdCLfh1ZAcEMCLrpsD" />
      <ThankYouPage applicantName={applicantName} courseLabel={courseLabel || "BBA"} />
      {/* Partner MRN Digital Tracking Pixel */}
      <img
        src="https://trk.mrndigital.in/pixel?av=6a421702efcf607d560a3202"
        width="1"
        height="1"
        style={{ display: "none" }}
        alt=""
      />
    </>
  );
}
