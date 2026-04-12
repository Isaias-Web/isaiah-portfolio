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
    title: "TryFum",
  },
  {
    slug: "onda",
    title: "Onda",
  },
  {
    slug: "sectravision",
    title: "SectraVision",
  },
  {
    slug: "vapemate",
    title: "VapeMate",
  },
  {
    slug: "hookahgt",
    title: "HookahGt",
  },
  {
    slug: "hookahpartner",
    title: "HookahPartner",
  },
];