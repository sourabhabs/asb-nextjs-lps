export type AsbCourseKey = "bba" | "bca" | "bcom" | "bsc";

export interface AsbCourseRouteConfig {
  key: AsbCourseKey;
  route: string;
  label: string;
  title: string;
  description: string;
  heroImage: string;
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
    thankYouPath: "/thank-you-bba",
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
    thankYouPath: "/thank-you-bca",
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
    thankYouPath: "/thank-you-bcom",
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
    thankYouPath: "/thank-you-bsc",
  },
};
