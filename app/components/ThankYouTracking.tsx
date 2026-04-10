import Script from "next/script";

interface ThankYouTrackingProps {
  googleTagId?: string;
  conversionSendTo?: string;
}

export default function ThankYouTracking({
  googleTagId,
  conversionSendTo,
}: ThankYouTrackingProps) {
  if (!googleTagId && !conversionSendTo) {
    return null;
  }

  return (
    <>
      {googleTagId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleTagId}`}
            strategy="afterInteractive"
          />
          <Script id={`gtag-init-${googleTagId}`} strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${googleTagId}');`}
          </Script>
        </>
      ) : null}
      {conversionSendTo ? (
        <Script id={`gtag-conversion-${conversionSendTo}`} strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('event','conversion',{'send_to':'${conversionSendTo}','value':1.0,'currency':'INR'});`}
        </Script>
      ) : null}
    </>
  );
}
