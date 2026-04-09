"use client";

import { caseStudies, type CaseStudySlug } from "@/data/caseStudies";

type CaseStudyNavigatorProps = {
  currentSlug: CaseStudySlug;
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function CaseStudyNavigator({
  currentSlug,
  onNavigate,
}: CaseStudyNavigatorProps) {
  const currentIndex = caseStudies.findIndex((item) => item.slug === currentSlug);

  if (currentIndex === -1) return null;

  const prevIndex =
    (currentIndex - 1 + caseStudies.length) % caseStudies.length;
  const nextIndex = (currentIndex + 1) % caseStudies.length;

  const prevCase = caseStudies[prevIndex];
  const nextCase = caseStudies[nextIndex];

  return (
    <section className="relative overflow-hidden bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-14 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 gap-10 border-t border-white/10 pt-10 md:grid-cols-2 md:gap-6">
          <button
            type="button"
            onClick={() => onNavigate(prevCase.slug)}
            className="group text-left transition-opacity duration-300 opacity-60 hover:opacity-100"
            aria-label={`Go to previous case study: ${prevCase.title}`}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00]">
              ← Proyecto Anterior
            </p>

            <h2 className="text-[15vw] font-black uppercase leading-[0.88] tracking-[-0.07em] text-white/55 transition-colors duration-300 group-hover:text-white md:text-[7vw]">
              {prevCase.title}
            </h2>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(nextCase.slug)}
            className="group text-right transition-opacity duration-300 opacity-60 hover:opacity-100"
            aria-label={`Go to next case study: ${nextCase.title}`}
          >
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00]">
              Siguiente Proyecto →
            </p>

            <h2 className="text-[15vw] font-black uppercase leading-[0.88] tracking-[-0.07em] text-white/55 transition-colors duration-300 group-hover:text-white md:text-[7vw]">
              {nextCase.title}
            </h2>
          </button>
        </div>
      </div>
    </section>
  );
}