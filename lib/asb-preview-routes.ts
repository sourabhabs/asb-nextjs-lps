export type PreviewCourseKey =
  | "bba"
  | "bca"
  | "bcom"
  | "bsc"
  | "ba-psychology"
  | "ba-psychology-international";

export type PreviewCourseConfig = {
  key: PreviewCourseKey;
  heroImage: string;
  mobileHeroImage?: string;
  queryLabel: string;
  thankYouPath: string;
};

export const PREVIEW_COURSES: Record<PreviewCourseKey, PreviewCourseConfig> = {
  bba: {
    key: "bba",
    heroImage: "/BBA.jpg",
    queryLabel: "ASB BBA2 Preview Landing",
    thankYouPath: "/thank-you-bba.php",
  },
  bca: {
    key: "bca",
    heroImage: "/BCA.jpg",
    queryLabel: "ASB BCA2 Preview Landing",
    thankYouPath: "/thank-you-bca.php",
  },
  bcom: {
    key: "bcom",
    heroImage: "/BCOM.jpg",
    queryLabel: "ASB BCOM2 Preview Landing",
    thankYouPath: "/thank-you-bcom.php",
  },
  bsc: {
    key: "bsc",
    heroImage: "/BSC.jpg",
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
};
