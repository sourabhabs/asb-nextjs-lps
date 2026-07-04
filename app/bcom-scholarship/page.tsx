import type { Metadata } from "next";
import Bba2PreviewShell from "@/app/components/Bba2PreviewShell";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES["bcom-scholarship"];

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function BcomScholarshipPage() {
  return <Bba2PreviewShell course={course} showWhatsApp={true} />;
}
