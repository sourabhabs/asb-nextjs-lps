import type { Metadata } from "next";
import Bsc2PreviewShell from "@/app/components/Bsc2PreviewShell";
import LandingPageTracking from "@/app/components/LandingPageTracking";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES.bsc;

export const metadata: Metadata = {
  title: `${course.title} | Preview`,
  description: course.description,
  robots: {
    index: false,
    follow: false,
  },
};

export default function Bsc2Page() {
  return (
    <>
      <LandingPageTracking googleTagId="AW-18057960286" />
      <Bsc2PreviewShell course={course} showWhatsApp={true} />
    </>
  );
}
