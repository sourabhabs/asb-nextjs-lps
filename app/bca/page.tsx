import type { Metadata } from "next";
import Bba2PreviewShell from "@/app/components/Bba2PreviewShell";
import LandingPageTracking from "@/app/components/LandingPageTracking";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES.bca;

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function BcaPage() {
  return (
    <>
      <LandingPageTracking googleTagId="AW-18057910395" />
      <Bba2PreviewShell course={course} showWhatsApp={true} />
    </>
  );
}
