export type AsbCourseKey =
  | "bba"
  | "bca"
  | "bcom"
  | "bsc"
  | "ba-psychology"
  | "ba-psychology-international";

export interface AsbCourseRouteConfig {
  key: AsbCourseKey;
  route: string;
  label: string;
  title: string;
  description: string;
  heroImage: string;
  mobileHeroImage?: string;
  courseValue: string;
  queryLabel: string;
  thankYouPath: string;
}

export const ASB_MAIN_ROUTE = "/";

export const ASB_COURSE_ROUTES: Record<AsbCourseKey, AsbCourseRouteConfig> = {
  bba: {
    key: "bba",
    route: "/bba",
    label: "BBA",
    title: "Best BBA College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Top BBA college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/BBA.jpg",
    courseValue: "BBA",
    queryLabel: "ASB BBA Admissions 2026 Landing",
    thankYouPath: "/thank-you-bba.php",
  },
  bca: {
    key: "bca",
    route: "/bca",
    label: "BCA",
    title: "Best BCA College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Top BCA college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/BCA.jpg",
    courseValue: "BCA",
    queryLabel: "ASB BCA Admissions 2026 Landing",
    thankYouPath: "/thank-you-bca.php",
  },
  bcom: {
    key: "bcom",
    route: "/bcom",
    label: "B.Com",
    title: "Best B.Com College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Top B.Com college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/BCOM.jpg",
    courseValue: "BCOM",
    queryLabel: "ASB BCOM Admissions 2026 Landing",
    thankYouPath: "/thank-you-bcom.php",
  },
  bsc: {
    key: "bsc",
    route: "/bsc",
    label: "B.Sc. (CS)",
    title: "Best B.Sc. (CS) College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Top B.Sc. (CS) college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/BSC.jpg",
    courseValue: "BSc CS",
    queryLabel: "ASB BSC Admissions 2026 Landing",
    thankYouPath: "/thank-you-bsc.php",
  },
  "ba-psychology": {
    key: "ba-psychology",
    route: "/ba-psychology",
    label: "B.A. Psychology",
    title: "Best BA Psychology College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Asian School of Business offers a future-ready B.A. Psychology program with industry-aligned certifications and a strong foundation in human behavior and mental processes.",
    heroImage: "/BA-PSY.jpg",
    mobileHeroImage: "/Mobile ba-psyjpg.jpg",
    courseValue: "BA Psychology",
    queryLabel: "ASB BA Psychology Admissions 2026 Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
  "ba-psychology-international": {
    key: "ba-psychology-international",
    route: "/ba-psychology-international",
    label: "B.A. Psychology International",
    title:
      "Best BA Psychology International College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Asian School of Business offers a future-ready B.A. Psychology International program with international exposure, industry-aligned certifications, Oxford and London learning opportunities, and a strong foundation in human behavior and mental processes.",
    heroImage: "/BA-PSY.jpg",
    mobileHeroImage: "/Mobile ba-psyjpg.jpg",
    courseValue: "BA Psychology International",
    queryLabel: "ASB BA Psychology International Admissions 2026 Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
};
