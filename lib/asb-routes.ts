export type AsbCourseKey =
  | "bba"
  | "bca"
  | "bcom"
  | "bsc"
  | "ba-psychology"
  | "ba-psychology-international"
  | "ba-psychology3"
  | "bcom-scholarship"
  | "bsc-scholarship"
  | "bca-scholarship"
  | "ba-psy-scholarship";

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
  hasScholarshipAsterisk?: boolean;
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
    heroImage: "/desktop2/bba.jpg",
    mobileHeroImage: "/mobile2/bba.jpg",
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
    heroImage: "/desktop2/bca.jpg",
    mobileHeroImage: "/mobile2/bca.jpg",
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
    heroImage: "/desktop2/bcom.jpg",
    mobileHeroImage: "/mobile2/bcom.jpg",
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
    heroImage: "/desktop2/bsc.jpg",
    mobileHeroImage: "/mobile2/bsc.jpg",
    courseValue: "BSc CS",
    queryLabel: "ASB BSC Admissions 2026 Landing",
    thankYouPath: "/thank-you-bsc.php",
  },
  "ba-psychology": {
    key: "ba-psychology",
    route: "/ba-psychology",
    label: "BA (Hons) Psychology",
    title: "Best BA (Hons) Psychology College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Asian School of Business offers a future-ready BA (Hons) Psychology program with industry-aligned certifications and a strong foundation in human behavior and mental processes.",
    heroImage: "/New Website banner ASB 1904x686 (3).jpg",
    mobileHeroImage: "/Mobile Banners ASB 2026 (1).jpg",
    courseValue: "BA Psychology",
    queryLabel: "ASB BA Psychology Admissions 2026 Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
    hasScholarshipAsterisk: true,
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
  "ba-psychology3": {
    key: "ba-psychology3",
    route: "/ba-psychology3",
    label: "BA (Hons) Psychology 3",
    title: "Best BA (Hons) Psychology College in Delhi NCR | Admissions Open 2026 - Asian School of Business",
    description:
      "Asian School of Business offers a future-ready BA (Hons) Psychology program with industry-aligned certifications and a strong foundation in human behavior and mental processes.",
    heroImage: "/New Website banner ASB 1904x686 (3).jpg",
    mobileHeroImage: "/Mobile Banners ASB 2026 (1).jpg",
    courseValue: "BA Psychology",
    queryLabel: "ASB BA Psychology Admissions 2026 Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
    hasScholarshipAsterisk: true,
  },
  "bcom-scholarship": {
    key: "bcom-scholarship",
    route: "/bcom-scholarship",
    label: "B.Com Scholarship",
    title: "Best B.Com College in Delhi NCR | Scholarship Admissions Open 2026 - Asian School of Business",
    description:
      "Top B.Com college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/desktop2/bcom.jpg",
    mobileHeroImage: "/mobile2/bcom.jpg",
    courseValue: "BCOM",
    queryLabel: "ASB BCOM Scholarship Admissions 2026 Landing",
    thankYouPath: "/thank-you-bcom.php",
  },
  "bsc-scholarship": {
    key: "bsc-scholarship",
    route: "/bsc-scholarship",
    label: "B.Sc. (CS) Scholarship",
    title: "Best B.Sc. (CS) College in Delhi NCR | Scholarship Admissions Open 2026 - Asian School of Business",
    description:
      "Top B.Sc. (CS) college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/desktop2/bsc.jpg",
    mobileHeroImage: "/mobile2/bsc.jpg",
    courseValue: "BSc CS",
    queryLabel: "ASB BSC Scholarship Admissions 2026 Landing",
    thankYouPath: "/thank-you-bsc.php",
  },
  "bca-scholarship": {
    key: "bca-scholarship",
    route: "/bca-scholarship",
    label: "BCA Scholarship",
    title: "Best BCA College in Delhi NCR | Scholarship Admissions Open 2026 - Asian School of Business",
    description:
      "Top BCA college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
    heroImage: "/desktop2/bca.jpg",
    mobileHeroImage: "/mobile2/bca.jpg",
    courseValue: "BCA",
    queryLabel: "ASB BCA Scholarship Admissions 2026 Landing",
    thankYouPath: "/thank-you-bca.php",
  },
  "ba-psy-scholarship": {
    key: "ba-psy-scholarship",
    route: "/ba-psy-scholarship",
    label: "BA Psychology Scholarship",
    title: "Best BA Psychology College in Delhi NCR | Scholarship Admissions Open 2026 - Asian School of Business",
    description:
      "Asian School of Business offers a future-ready BA (Hons) Psychology program with industry-aligned certifications and a strong foundation in human behavior and mental processes.",
    heroImage: "/desktop/BA.jpg",
    mobileHeroImage: "/mobile/BA.jpg",
    courseValue: "BA Psychology",
    queryLabel: "ASB BA Psychology Scholarship Admissions 2026 Landing",
    thankYouPath: "/thank-you-ba-psychology.php",
  },
};
