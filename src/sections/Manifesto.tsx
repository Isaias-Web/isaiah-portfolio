"use client";

import { useRef } from "react";
import { useManifestoReveal } from "@/hooks/useManifestoReveal";

function RevealLine({
  text,
  className = "",
  accent = false,
}: {
  text: string;
  className?: string;
  accent?: boolean;
}) {
  return (
    <h2
      className={`manifesto-line ${className} ${accent ? "text-[#f1ede6]" : "text-[#f1ede6]"
        }`}
    >
      {text.split(" ").map((word, index) => (
        <span
          key={`${word}-${index}`}
          className="manifesto-word inline-block mr-[0.22em] opacity-[0.08] will-change-[opacity,color]"
        >
          {word}
        </span>
      ))}
    </h2>
  );
}

export default function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);

  useManifestoReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-[#090a09] text-white"
    >
      <div className="relative flex min-h-screen flex-col px-6 py-10 md:px-10 lg:px-16">

        {/* TOP */}
        <div data-animate="top" className="flex items-start justify-between">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            / manifiesto / p. 002
          </p>
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 items-center">
          <div className="w-full max-w-[1250px]">

            <RevealLine
              text="No digas que"
              className="ml-0 text-[14vw] font-black leading-[0.9] tracking-[-0.06em] uppercase sm:text-[12vw] md:ml-[10%] md:text-[9vw] lg:text-[8vw]"
            />

            <RevealLine
              text="No puedes,"
              className="ml-0 text-[14vw] font-black leading-[0.9] tracking-[-0.06em] uppercase sm:text-[12vw] md:ml-[18%] md:text-[9vw] lg:text-[8vw]"
            />

            <RevealLine
              text="Di que aún"
              className="ml-0 text-[14vw] font-black leading-[0.9] tracking-[-0.06em] uppercase sm:text-[12vw] md:ml-[18%] md:text-[9vw] lg:text-[8vw]"
            />

            <RevealLine
              text="No lo haz hecho."
              accent
              className="mt-4 text-[14vw] font-black leading-[0.9] tracking-[-0.06em] uppercase sm:text-[12vw] md:text-[9vw] lg:text-[8vw]"
            />
          </div>
        </div>

        {/* BOTTOM */}
        <div data-animate="bottom" className="flex justify-end">
          <p className="font-mono text-[10px] lowercase tracking-[0.2em] text-white/35 md:text-[11px]">
            isaiasfrutosweb.site / 2026
          </p>
        </div>

      </div>
    </section>
  );
}