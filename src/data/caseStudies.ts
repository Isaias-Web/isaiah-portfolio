export type CaseStudySlug = "trademate" | "tryfum" | "onda" | "sectravision" | "vapemate" | "hookahgt" | "hookahpartner";

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
    title: "TryFüm",
  },
  {
    slug: "onda",
    title: "Onda",
  },
  {
    slug: "sectravision",
    title: "Sectra Visión",
  },
  {
    slug: "vapemate",
    title: "Vape Mate",
  },
  {
    slug: "hookahgt",
    title: "Hookah GT",
  },
  {
    slug: "hookahpartner",
    title: "Hookah Partner",
  },
];