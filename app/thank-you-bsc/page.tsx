import type { Metadata } from "next";
import Script from "next/script";
import ThankYouPage from "@/app/components/ThankYouPage";
import ThankYouTracking from "@/app/components/ThankYouTracking";
import { getThankYouLeadCookieData } from "@/lib/asb-lead-flow";

export const metadata: Metadata = {
  title: "Thank You | Asian School of Business",
  description: "Thank you for your B.Sc. (CS) enquiry to Asian School of Business.",
};

export default async function BscThankYouPage() {
  const { applicantName, courseLabel } = await getThankYouLeadCookieData();

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=AW-18057960286"
        strategy="beforeInteractive"
      />
      <Script id="bsc-google-tag" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'AW-18057960286');`}
      </Script>
      <Script id="bsc-conversion-event" strategy="beforeInteractive">
        {`gtag('event', 'conversion', {'send_to': 'AW-18057960286/Jc0OCNbl9ZQcEN622qJD'});`}
      </Script>
      <ThankYouTracking conversionSendTo="AW-862684608/nckdCLfh1ZAcEMCLrpsD" />
      <ThankYouPage applicantName={applicantName} courseLabel={courseLabel || "B.Sc. (CS)"} />
    </>
  );
}
