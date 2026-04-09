"use client";

import type { CaseStudySlug } from "@/data/caseStudies";
import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import TryfumFeature from "./tryfum/TryfumFeature";
import TryfumHero from "./tryfum/TryfumHero";
import TryfumStory from "./tryfum/TryfumStory";

type TryfumCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function TryfumCaseStudy({
  onNavigate,
}: TryfumCaseStudyProps) {
  return (
    <>
      <TryfumHero />
      <TryfumStory />
      <TryfumFeature />
      <CaseStudyNavigator currentSlug="tryfum" onNavigate={onNavigate} />
    </>
  );
}