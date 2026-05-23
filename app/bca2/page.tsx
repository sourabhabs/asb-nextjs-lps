import type { Metadata } from "next";
import Bba2PreviewShell, { PREVIEW_COURSES } from "@/app/components/Bba2PreviewShell";

const course = PREVIEW_COURSES.bca;

export const metadata: Metadata = {
  title: "BCA Preview | Asian School of Business",
  description:
    "Top BCA college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Bca2Page() {
  return <Bba2PreviewShell course={course} />;
}
