import type { Metadata } from "next";
import AsbCourseLandingShell from "@/app/components/AsbCourseLandingShell";
import LandingPageTracking from "@/app/components/LandingPageTracking";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES.bsc;

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function BscPage() {
  return (
    <>
      <LandingPageTracking googleTagId="AW-18057960286" />
      <AsbCourseLandingShell course={course} />
    </>
  );
}
