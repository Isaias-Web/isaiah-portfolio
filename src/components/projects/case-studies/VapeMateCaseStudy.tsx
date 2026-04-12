"use client";

import type { CaseStudySlug } from "@/data/caseStudies";
import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import VapeMateFeature from "./vapemate/VapeMateFeature";
import VapeMateHero from "./vapemate/VapeMateHero";
import VapeMateStory from "./vapemate/VapeMateStory";

type VapeMateCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function VapeMateCaseStudy({
  onNavigate,
}: VapeMateCaseStudyProps) {
  return (
    <>
      <VapeMateHero />
      <VapeMateStory />
      <VapeMateFeature />
      <CaseStudyNavigator currentSlug="vapemate" onNavigate={onNavigate} />
    </>
  );
}