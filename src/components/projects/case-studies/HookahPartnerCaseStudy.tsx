"use client";

import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import HookahPartnerFeature from "./hookahpartner/HookahPartnerFeature";
import HookahPartnerHero from "./hookahpartner/HookahPartnerHero";
import HookahPartnerStory from "./hookahpartner/HookahPartnerStory";
import type { CaseStudySlug } from "@/data/caseStudies";

type HookahGtCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function HookahGtCaseStudy({ onNavigate }: HookahGtCaseStudyProps) {
  return (
    <>
      <HookahPartnerHero />
      <HookahPartnerStory />
      <HookahPartnerFeature />
      <CaseStudyNavigator currentSlug="hookahpartner" onNavigate={onNavigate} />
    </>
  );
}