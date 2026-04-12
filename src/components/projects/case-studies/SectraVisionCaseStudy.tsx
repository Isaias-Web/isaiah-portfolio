"use client";

import type { CaseStudySlug } from "@/data/caseStudies";
import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import SectraVisionFeature from "./sectravision/SectraVisionFeature";
import SectraVisionHero from "./sectravision/SectraVisionHero";
import SectraVisionStory from "./sectravision/SectraVisionStory";


type SectraCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function SectraVisionCaseStudy({
  onNavigate,
}: SectraCaseStudyProps) {
  return (
    <>
      <SectraVisionHero />
      <SectraVisionStory />
      <SectraVisionFeature />
      <CaseStudyNavigator currentSlug="sectravision" onNavigate={onNavigate} />
    </>
  );
}