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
          src="/images/vapemate-bg.jpg"
          alt="Vape Mate background"
          className="h-full w-full scale-[1.03] object-cover object-center opacity-[0.22]"
        />
      </div>

      {/* top gradient blend */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-[120px] w-full bg-gradient-to-b from-[#090a09] to-transparent sm:h-[140px] md:h-[160px]" />

      {/* dark overlay */}
      <div className="absolute inset-0 z-[11] bg-black/35" />

      <div className="relative z-20 flex min-h-screen flex-col px-4 py-8 sm:px-5 md:h-full md:px-10 lg:px-16">
        <div data-reveal className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/20 md:text-[11px]">
            02 / 03
          </p>

          <p className="max-w-[340px] font-mono text-[10px] leading-[1.6] uppercase tracking-[0.24em] text-[#ff2d00] md:max-w-none md:text-[11px] md:tracking-[0.28em]">
            ECOMMERCE DTC · WEBMASTER · UX/UI · CREATIVE SUPPORT
          </p>
        </div>

        <div
          data-reveal
          className="flex flex-1 items-center pt-10 pb-8 sm:pt-12 md:pt-0 md:pb-0"
        >
          <div className="relative w-full overflow-visible">
            <h1 className="max-w-full text-[15vw] font-black uppercase leading-[0.92] tracking-[-0.045em] text-[#f3efe8] sm:text-[17vw] md:text-[17vw] md:tracking-[-0.07em] lg:text-[15vw]">
              VAPEMATE
            </h1>
          </div>
        </div>

        <div
          data-reveal
          className="grid items-end gap-8 pb-2 md:grid-cols-[1.2fr_0.8fr] md:gap-12"
        >
          <div className="max-w-[800px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 md:text-[12px] md:tracking-[0.24em] md:text-white/15">
              Ecosistema digital para catálogo, contenido y marca
            </p>

            <h3 className="mt-3 font-mono text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#b79cff] sm:text-[24px] md:mt-4 md:text-[34px]">
              Soporte digital para ecommerce y comunicación de producto
            </h3>

            <p className="mt-4 max-w-[780px] font-mono text-[12px] leading-[1.8] tracking-[0.01em] text-white/65 md:text-[13px] md:text-white/55">
              Gestión de catálogo, contenido y experiencia web para una marca
              distribuidora con presencia internacional, alineando operación
              digital, producto y comunicación comercial.
            </p>
          </div>
        </div>

        <div data-reveal className="mt-8 h-px w-full bg-[#ff2d00]" />
      </div>
    </section>
  );
}