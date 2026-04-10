import Script from "next/script";

interface LandingPageTrackingProps {
  googleTagId: string;
}

export default function LandingPageTracking({
  googleTagId,
}: LandingPageTrackingProps) {
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
        strategy="afterInteractive"
      />
      <Script id={`landing-gtag-init-${googleTagId}`} strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleTagId}');`}
      </Script>
    </>
  );
}
