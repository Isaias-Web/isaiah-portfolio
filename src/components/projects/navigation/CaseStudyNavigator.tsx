"use client";

import { caseStudies, type CaseStudySlug } from "@/data/caseStudies";

type CaseStudyNavigatorProps = {
  currentSlug: CaseStudySlug;
  onNavigate: (slug: CaseStudySlug) => void;
};

const labelClass =
  "mb-3 font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff2d00] sm:text-[10px] sm:tracking-[0.28em]";

const titleClass =
  "block w-full max-w-full font-black uppercase leading-[0.86] tracking-[-0.045em] text-white/55 transition-colors duration-300 group-hover:text-white md:tracking-[-0.06em] text-[clamp(1.65rem,8.5vw,4rem)] md:text-[clamp(2rem,4.4vw,4rem)] break-words [overflow-wrap:anywhere]";

export default function CaseStudyNavigator({
  currentSlug,
  onNavigate,
}: CaseStudyNavigatorProps) {
  const currentIndex = caseStudies.findIndex(
    (item) => item.slug === currentSlug
  );

  if (currentIndex === -1) return null;

  const prevIndex =
    (currentIndex - 1 + caseStudies.length) % caseStudies.length;
  const nextIndex = (currentIndex + 1) % caseStudies.length;

  const prevCase = caseStudies[prevIndex];
  const nextCase = caseStudies[nextIndex];

  return (
    <section className="relative bg-[#050505] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-12 md:px-10 md:py-14 lg:px-16">
        <div className="grid min-w-0 grid-cols-1 gap-9 border-t border-white/10 pt-10 md:grid-cols-2 md:gap-8">
          <button
            type="button"
            onClick={() => onNavigate(prevCase.slug)}
            className="group min-w-0 w-full text-left opacity-60 transition-opacity duration-300 hover:opacity-100"
            aria-label={`Go to previous case study: ${prevCase.title}`}
          >
            <p className={labelClass}>← Proyecto Anterior</p>

            <h2 className={titleClass}>{prevCase.title}</h2>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(nextCase.slug)}
            className="group min-w-0 w-full text-left opacity-60 transition-opacity duration-300 hover:opacity-100 md:text-right"
            aria-label={`Go to next case study: ${nextCase.title}`}
          >
            <p className={labelClass}>Siguiente Proyecto →</p>

            <h2 className={titleClass}>{nextCase.title}</h2>
          </button>
        </div>
      </div>
    </section>
  );
}