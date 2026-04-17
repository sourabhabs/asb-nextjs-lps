import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

const CRITICAL_STYLESHEETS = [
  "/assets/css/bootstrap.4.5.2.min.css",
  "/assets/css/default.css",
  "/assets/css/style2w2.css",
  "/assets/css/style.css",
];

const DEFERRED_STYLESHEETS = [
  "/assets/css/magnific-popup.css",
  "/assets/css/slick.css",
  "/assets/css/LineIcons.2.0.css",
  "/assets/css/whm-sections.css",
];

export const metadata: Metadata = {
  title: "Asian School of Business | Admissions Open 2026",
  description:
    "Top BBA/BCA/B.Com/B.Sc college in Greater Noida — Asian School of Business offers future-ready undergraduate programs with global exposure and 100% placement assistance.",
  icons: {
    icon: "/assets/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="no-js">
      <head>
        <link rel="icon" href="/assets/images/favicon.ico" />
        {/* Original CSS files — preserved as-is for pixel-perfect fidelity */}
        {CRITICAL_STYLESHEETS.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* GTM head snippet */}
        <Script id="gtm-head" strategy="beforeInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PS7TRZ6');`}</Script>
        <Script id="deferred-css" strategy="afterInteractive">{`(function(){var hrefs=${JSON.stringify(DEFERRED_STYLESHEETS)};hrefs.forEach(function(href){if(document.querySelector('link[href="'+href+'"]'))return;var link=document.createElement('link');link.rel='stylesheet';link.href=href;document.head.appendChild(link);});})();`}</Script>
        {/* GA4 */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-FHFHVX2FMD" strategy="afterInteractive" />
        <Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-FHFHVX2FMD');`}</Script>
        {/* Meta Pixel */}
        <Script id="meta-pixel" strategy="afterInteractive">{`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','101540563527553');fbq('track','PageView');`}</Script>
        <noscript>
          {DEFERRED_STYLESHEETS.map((href) => (
            <link key={href} rel="stylesheet" href={href} />
          ))}
        </noscript>
      </head>
      <body>
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PS7TRZ6" height="0" width="0" style={{ display: "none", visibility: "hidden" }} />
        </noscript>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=101540563527553&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}
