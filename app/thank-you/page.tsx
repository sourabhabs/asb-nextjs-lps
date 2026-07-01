import type { Metadata } from "next";
import ThankYouPage from "@/app/components/ThankYouPage";
import ThankYouTracking from "@/app/components/ThankYouTracking";
import { getThankYouLeadCookieData } from "@/lib/asb-lead-flow";

export const metadata: Metadata = {
  title: "Thank You | Asian School of Business",
  description: "Thank you for your enquiry to Asian School of Business.",
};

export default async function MainThankYouPage() {
  const { applicantName, courseLabel } = await getThankYouLeadCookieData();

  return (
    <>
      <ThankYouTracking
        googleTagId="AW-18057910395"
        conversionSendTo="AW-18057910395/y5BLCI7qipUcEPuw16JD"
      />
      <ThankYouTracking conversionSendTo="AW-862684608/nckdCLfh1ZAcEMCLrpsD" />
      <ThankYouPage
        applicantName={applicantName}
        courseLabel={courseLabel || "Undergraduate"}
      />
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
