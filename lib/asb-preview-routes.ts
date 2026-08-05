export type PreviewCourseKey =
  | "bba"
  | "bca"
  | "bcom"
  | "bsc"
  | "ba-psychology"
  | "ba-psychology-international"
  | "ba-psychology3"
  | "bba3";

export type PreviewCourseConfig = {
  key: PreviewCourseKey;
  heroImage: string;
  mobileHeroImage?: string;
  queryLabel: string;
  thankYouPath: string;
};

export const PREVIEW_COURSES: Record<PreviewCourseKey, PreviewCourseConfig> = {
  bba3: {
    key: "bba3",
    heroImage: "/desktop-images/common.jpg",
    queryLabel: "ASB BBA3 Preview Landing",
    thankYouPath: "/thank-you-bba.php",
  },
  bba: {
    key: "bba",
    heroImage: "/desktop-images/common.jpg",
    mobileHeroImage: "/mobile/BBA.jpg",
    queryLabel: "ASB BBA2 Preview Landing",
    thankYouPath: "/thank-you-bba.php",
  },
  bca: {
    key: "bca",
    heroImage: "/desktop-images/bca.jpg",
    mobileHeroImage: "/mobile/BCA.jpg",
    queryLabel: "ASB BCA2 Preview Landing",
    thankYouPath: "/thank-you-bca.php",
  },
  bcom: {
    key: "bcom",
    heroImage: "/desktop-images/bcom.jpg",
    mobileHeroImage: "/mobile/BCOM.jpg",
    queryLabel: "ASB BCOM2 Preview Landing",
    thankYouPath: "/thank-you-bcom.php",
  },
  bsc: {
    key: "bsc",
    heroImage: "/desktop-images/bsc.jpg",
    mobileHeroImage: "/mobile/BSC.jpg",
    queryLabel: "ASB BSC2 Preview Landing",
    thankYouPath: "/thank-you-bsc.php",
  },
  "ba-psychology": {
    key: "ba-psychology",
    heroImage: "/desktop-images/common.jpg",
    mobileHeroImage: "/Mobile Banners ASB 2026 (1).jpg",
    queryLabel: "ASB BA Psychology Preview Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
  "ba-psychology-international": {
    key: "ba-psychology-international",
    heroImage: "/desktop-images/common.jpg",
    mobileHeroImage: "/main-mobile.jpg",
    queryLabel: "ASB BA Psychology International Preview Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
  "ba-psychology3": {
    key: "ba-psychology3",
    heroImage: "/desktop-images/common.jpg",
    mobileHeroImage: "/main-mobile.jpg",
    queryLabel: "ASB BA Psychology Preview Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
};
