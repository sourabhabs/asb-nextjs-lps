import type { Metadata } from "next";
import ThankYouPage from "@/app/components/ThankYouPage";
import ThankYouTracking from "@/app/components/ThankYouTracking";
import { getThankYouLeadCookieData } from "@/lib/asb-lead-flow";

export const metadata: Metadata = {
  title: "Thank You | Asian School of Business",
  description: "Thank you for your B.Com enquiry to Asian School of Business.",
};

export default async function BcomThankYouPage() {
  const { applicantName } = await getThankYouLeadCookieData();

  return (
    <>
      <ThankYouTracking
        googleTagId="AW-18057855257"
        conversionSendTo="AW-18057855257/xEwwClHA9ZQcEJmC1KJD"
      />
      <ThankYouTracking conversionSendTo="AW-862684608/nckdCLfh1ZAcEMCLrpsD" />
      <ThankYouPage applicantName={applicantName} courseLabel="B.Com" />
    </>
  );
}
