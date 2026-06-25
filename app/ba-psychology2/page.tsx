import type { Metadata } from "next";
import AsbCourseLandingShell from "@/app/components/AsbCourseLandingShell";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const baseCourse = ASB_COURSE_ROUTES["ba-psychology"];
const course = {
  ...baseCourse,
  heroImage: "/ASB-BG-D.webp",
  mobileHeroImage: "/Mobile ba-psyjpg.jpg",
  hasScholarshipAsterisk: true,
};

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function BaPsychology2Page() {
  return <AsbCourseLandingShell course={course} forceTealTheme={true} />;
}
