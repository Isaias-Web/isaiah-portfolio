"use client";

import { useRef } from "react";
import { gsap } from "@/animations/gsap-config";
import { useProjectPanelReveal } from "@/hooks/useProjectPanelReveal";

type ProjectPanelIntroProps = {
  railTween?: gsap.core.Tween | null;
  onOpen?: () => void;
};

export default function ProjectPanelIntro({
  railTween,
  onOpen,
}: ProjectPanelIntroProps) {
  const panelRef = useRef<HTMLElement | null>(null);

  useProjectPanelReveal(panelRef, railTween);

  return (
    <section
      ref={panelRef}
      onClick={onOpen}
      data-cursor="zoom"
      className="relative min-h-screen w-full overflow-hidden bg-[#090a09] text-white md:h-full"
    >
      {/* background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hookahpartner-bg.webp"
          alt="Hookah Partner background"
          className="h-full w-full scale-[1.03] object-cover object-center opacity-[0.22]"
        />
      </div>

      {/* top gradient */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-[120px] w-full bg-gradient-to-b from-[#090a09] to-transparent sm:h-[140px] md:h-[160px]" />

      {/* overlay */}
      <div className="absolute inset-0 z-[11] bg-black/35" />

      <div className="relative z-20 flex min-h-screen flex-col px-4 py-8 sm:px-5 md:h-full md:px-10 lg:px-16">
        <div data-reveal className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/20 md:text-[11px]">
            03 / 03
          </p>

          <p className="max-w-[340px] font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2d00] md:max-w-none md:text-[11px] md:tracking-[0.28em]">
            ECOMMERCE DTC · UX/UI · CONVERSIÓN
          </p>
        </div>

        <div
          data-reveal
          className="flex flex-1 items-center pt-10 pb-8 sm:pt-12 md:pt-0 md:pb-0"
        >
          <h1 className="text-[15vw] font-black uppercase leading-[0.92] tracking-[-0.045em] text-[#f3efe8] sm:text-[17vw] md:text-[17vw] lg:text-[15vw]">
            HOOKAH PARTNER
          </h1>
        </div>

        <div data-reveal className="pb-2">
          <h3 className="font-mono text-[22px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#ffd15c] md:text-[30px]">
            Experiencia digital enfocada en conversión
          </h3>

          <p className="mt-4 max-w-[640px] font-mono text-[12px] leading-[1.9] text-white/60 md:text-[13px]">
            Desarrollo y optimización de ecommerce enfocado en navegación clara,
            estructura de catálogo y presentación de producto para impulsar la
            compra dentro del canal digital.
          </p>
        </div>

        <div className="mt-8 h-px w-full bg-[#ff2d00]" />
      </div>
    </section>
  );
}