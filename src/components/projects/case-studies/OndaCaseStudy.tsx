"use client";

import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import OndaFeature from "./onda/OndaFeature";
import OndaHero from "./onda/OndaHero";
import OndaStory from "./onda/OndaStory";
import type { CaseStudySlug } from "@/data/caseStudies";

type OndaCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function OndaCaseStudy({ onNavigate }: OndaCaseStudyProps) {
  return (
    <>
      <OndaHero />
      <OndaStory />
      <OndaFeature />
      <CaseStudyNavigator currentSlug="onda" onNavigate={onNavigate} />
    </>
  );
}