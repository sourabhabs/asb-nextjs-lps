import type { Metadata } from "next";
import RootPage from "../page";

export const metadata: Metadata = {
  title: "Homepage Preview 4 | Asian School of Business",
  description: "Preview route for validating the current homepage implementation.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Homepage4Page() {
  return <RootPage />;
}
