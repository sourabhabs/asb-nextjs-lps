import type { Metadata } from "next";
import AsbCourseLandingShell from "@/app/components/AsbCourseLandingShell";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES["ba-psychology3"];

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function BaPsychology3Page() {
  return <AsbCourseLandingShell course={course} />;
}
