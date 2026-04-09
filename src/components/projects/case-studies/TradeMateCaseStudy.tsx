"use client";

import type { CaseStudySlug } from "@/data/caseStudies";
import CaseStudyNavigator from "../navigation/CaseStudyNavigator";
import TradeMateFeature from "./trademate/TradeMateFeature";
import TradeMateHero from "./trademate/TradeMateHero";
import TradeMateStory from "./trademate/TradeMateStory";

type TradeMateCaseStudyProps = {
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function TradeMateCaseStudy({
  onNavigate,
}: TradeMateCaseStudyProps) {
  return (
    <>
      <TradeMateHero />
      <TradeMateStory />
      <TradeMateFeature />
      <CaseStudyNavigator currentSlug="trademate" onNavigate={onNavigate} />
    </>
  );
}