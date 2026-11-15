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
          src="/images/tryfum-bg.jpg"
          alt="TryFüm background"
          className="h-full w-full scale-[1.03] object-cover object-center opacity-[0.22]"
        />
      </div>

      {/* top gradient blend */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-[120px] w-full bg-gradient-to-b from-[#090a09] to-transparent sm:h-[140px] md:h-[160px]" />

      <div className="relative z-20 flex min-h-screen flex-col px-4 py-8 sm:px-5 md:h-full md:px-10 lg:px-16">
        <div data-reveal className="space-y-2">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/20 md:text-[11px]">
            02 / 07
          </p>

          <p className="max-w-[260px] font-mono text-[10px] leading-[1.6] uppercase tracking-[0.24em] text-[#ff2d00] md:max-w-none md:text-[11px] md:tracking-[0.28em]">
            ECOMMERCE DTC · BRAND EXPERIENCE · CONVERSIÓN
          </p>
        </div>

        <div
          data-reveal
          className="flex flex-1 items-center pt-10 pb-8 sm:pt-12 md:pt-0 md:pb-0"
        >
          <div className="relative w-full overflow-visible">
            <h3 className="max-w-full text-[18vw] font-black uppercase leading-[0.92] tracking-[-0.04em] text-[#f3efe8] sm:text-[16.5vw] md:text-[17vw] md:tracking-[-0.07em] lg:text-[15vw]">
              TryFüm
            </h3>
          </div>
        </div>

        <div
          data-reveal
          className="grid items-end gap-8 pb-2 md:grid-cols-[1.2fr_0.8fr] md:gap-12"
        >
          <div className="max-w-[760px]">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/20 md:text-[12px] md:tracking-[0.24em] md:text-white/15">
              Una experiencia de producto pensada para vender
            </p>

            <p className="mt-3 font-mono text-[22px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#b79cff] sm:text-[24px] md:mt-4 md:text-[34px]">
              Experiencia digital enfocada en conversión
            </p>

            <p className="mt-4 max-w-[760px] font-mono text-[12px] leading-[1.8] tracking-[0.01em] text-white/65 md:text-[13px] md:text-white/55">
              Desarrollo y optimización de la tienda digital de FÜM en México,
              enfocada en comunicar el valor del producto, mejorar la conversión
              y adaptar la marca al mercado local.
            </p>

            <p className="mt-4 max-w-[760px] font-mono text-[12px] leading-[1.8] tracking-[0.01em] text-white/65 md:text-[13px] md:text-white/55">
              Se construyó una experiencia clara y estructurada, alineando
              branding, contenido y performance para fortalecer la conexión
              entre producto, usuario y marca.
            </p>
          </div>
        </div>

        <div data-reveal className="mt-8 h-px w-full bg-[#ff2d00]" />
      </div>
    </section>
  );
}