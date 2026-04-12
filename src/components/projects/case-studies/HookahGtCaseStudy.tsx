"use client";

import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import HookahGtFeature from "./hookahgt/HookahGtFeature";
import HookahGtHero from "./hookahgt/HookahGtHero";
import HookahGtStory from "./hookahgt/HookahGtStory";
import type { CaseStudySlug } from "@/data/caseStudies";

type HookahGtCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function HookahGtCaseStudy({ onNavigate }: HookahGtCaseStudyProps) {
  return (
    <>
      <HookahGtHero />
      <HookahGtStory />
      <HookahGtFeature />
      <CaseStudyNavigator currentSlug="hookahgt" onNavigate={onNavigate} />
    </>
  );
}