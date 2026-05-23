import type { Metadata } from "next";
import Bba2PreviewShell from "@/app/components/Bba2PreviewShell";
import { PREVIEW_COURSES } from "@/lib/asb-preview-routes";

const course = PREVIEW_COURSES.bsc;

export const metadata: Metadata = {
  title: "B.Sc. (CS) Preview | Asian School of Business",
  description:
    "Top B.Sc. (CS) college in Greater Noida - Asian School of Business offers future-ready undergraduate programs with global exposure, Oxford learning opportunities, expert faculty and placement assistance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Bsc2Page() {
  return <Bba2PreviewShell course={course} />;
}
