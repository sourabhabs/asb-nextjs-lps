import type { Metadata } from "next";
import AsbCourseLandingShell from "@/app/components/AsbCourseLandingShell";
import LandingPageTracking from "@/app/components/LandingPageTracking";
import { ASB_COURSE_ROUTES } from "@/lib/asb-routes";

const course = ASB_COURSE_ROUTES.bca;

export const metadata: Metadata = {
  title: course.title,
  description: course.description,
};

export default function Bca2Page() {
  return (
    <>
      <LandingPageTracking googleTagId="AW-18057910395" />
      <AsbCourseLandingShell
        course={course}
        formConsentNote='<div id="heroLeadForm">
<div className="single_form hero-form-title" style={{width:"auto"}}><h3></h3></div>
<div className=""><input type="checkbox" checked name = "pl" value={"Y"} /><span style={{color:"#fff"}}> &nbsp; I have read and agree to the Privacy Policy and the collection of my personal information.</span></div>
</div>'
      />
    </>
  );
}
