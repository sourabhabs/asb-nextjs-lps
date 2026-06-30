import type { Metadata } from "next";
import AsbCourseLandingShell from "@/app/components/AsbCourseLandingShell";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES["ba-psychology"];

const customEvents = [
  {
    label: "Nukkad Natak",
    src: "/nukkad-natak/boy.png",
    wide: true,
  },
  { label: "Aman Gupta", src: "/Events/Aman-4.webp" },
  { label: "Jazzy-B", src: "/Events/jazzy-B.webp" },
  { label: "Nukkad Natak", src: "/nukkad-natak/girl.jpg" },
] as const;

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function BaPsychology2Page() {
  return (
    <AsbCourseLandingShell
      course={course}
      customEvents={customEvents}
      desktopScholarshipLogoSrc="/nukkad-natak/psych.png"
      desktopScholarshipLogoAlt="Psychology program logo"
    />
  );
}
