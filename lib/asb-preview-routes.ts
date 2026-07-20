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
    heroImage: "/ASB-BG-D.webp",
    queryLabel: "ASB BBA3 Preview Landing",
    thankYouPath: "/thank-you-bba.php",
  },
  bba: {
    key: "bba",
    heroImage: "/bba2timer2.jpg",
    mobileHeroImage: "/mobile/BBA.jpg",
    queryLabel: "ASB BBA2 Preview Landing",
    thankYouPath: "/thank-you-bba.php",
  },
  bca: {
    key: "bca",
    heroImage: "/desktop/BCA_updated.jpg",
    mobileHeroImage: "/mobile/BCA.jpg",
    queryLabel: "ASB BCA2 Preview Landing",
    thankYouPath: "/thank-you-bca.php",
  },
  bcom: {
    key: "bcom",
    heroImage: "/desktop/BCOM_updated.jpg",
    mobileHeroImage: "/mobile/BCOM.jpg",
    queryLabel: "ASB BCOM2 Preview Landing",
    thankYouPath: "/thank-you-bcom.php",
  },
  bsc: {
    key: "bsc",
    heroImage: "/desktop/BSC_updated.jpg",
    mobileHeroImage: "/mobile/BSC.jpg",
    queryLabel: "ASB BSC2 Preview Landing",
    thankYouPath: "/thank-you-bsc.php",
  },
  "ba-psychology": {
    key: "ba-psychology",
    heroImage: "/BA-PSY.jpg",
    mobileHeroImage: "/Mobile ba-psyjpg.jpg",
    queryLabel: "ASB BA Psychology Preview Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
  "ba-psychology-international": {
    key: "ba-psychology-international",
    heroImage: "/BA-PSY.jpg",
    mobileHeroImage: "/Mobile ba-psyjpg.jpg",
    queryLabel: "ASB BA Psychology International Preview Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
  "ba-psychology3": {
    key: "ba-psychology3",
    heroImage: "/New Website banner ASB 1904x686 (3).jpg",
    mobileHeroImage: "/Mobile Banners ASB 2026 (1).jpg",
    queryLabel: "ASB BA Psychology Preview Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
};
