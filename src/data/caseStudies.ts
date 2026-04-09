export type CaseStudySlug = "trademate" | "tryfum" | "onda";

export type CaseStudyItem = {
  slug: CaseStudySlug;
  title: string;
};

export const caseStudies: CaseStudyItem[] = [
  {
    slug: "trademate",
    title: "TradeMate",
  },
  {
    slug: "tryfum",
    title: "TryFum",
  },
  {
    slug: "onda",
    title: "Onda",
  },
];