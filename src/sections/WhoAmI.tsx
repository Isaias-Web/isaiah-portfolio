"use client";

import { useRef } from "react";
import { useWhoAmIReveal } from "@/hooks/useWhoAmIReveal";

const buildRows = [
  { label: "CORE", value: "JavaScript · TypeScript · Shopify (Liquid, APIs, Webhooks)" },
  { label: "FRONTEND", value: "React · Next.js · HTML · CSS · Tailwind" },
  { label: "BACKEND", value: "Node.js · Express · APIs · Webhooks" },
  { label: "DATA", value: "PostgreSQL · Redis · MySQL" },
  { label: "INTEGRACIÓN", value: "GraphQL · REST APIs · Make · Integraciones de sistemas" },
  { label: "ECOMMERCE & CMS", value: "Shopify · WordPress" },
  { label: "DISEÑO", value: "Figma · Photoshop · Illustrator" },
  { label: "ANIMACIÓN", value: "GSAP · Three.js" },
  { label: "DEPLOY", value: "Vercel · AWS · Docker" },
];

const cultureRows = [
  { label: "SONIDO", value: "Arctic Monkeys · Incubus · Blur" },
  { label: "PANTALLA", value: "Suits · Peaky Blinders · Game of Thrones" },
  { label: "JUEGOS", value: "Need for Speed · Batman Arkham · Halo" },
  { label: "INSTRUMENTOS", value: "Guitarra · Bajo" },
  { label: "LECTURA", value: "Kafka · Faulkner · Lovecraft" },
  { label: "ESTILO", value: "Vintage · Old Money" },
  { label: "CIUDAD", value: "CDMX" },
  { label: "COMIDA", value: "Pizza · Sushi · Tacos" },
  { label: "AHORA", value: "Familia" },
];

function InfoTable({
  eyebrow,
  title,
  rows,
}: {
  eyebrow: string;
  title: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col">
      <p
        data-reveal="eyebrow"
        className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]"
      >
        {eyebrow}
      </p>

      <div className="mt-8 sm:mt-10 md:mt-16 lg:mt-20">
        <h2
          data-reveal="title"
          className="font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#f3efe8] text-[15vw] sm:text-[13vw] md:text-[4.8vw] lg:text-[5.2vw] xl:text-[6.6vw]"
        >
          {title.split("\n").map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h2>
      </div>

      <div className="mt-8 space-y-0 md:mt-12 lg:mt-14">
        {rows.map((row) => (
          <div
            key={row.label}
            data-reveal="row"
            className="group grid min-w-0 grid-cols-[7rem_minmax(0,1fr)] gap-x-6 border-b border-white/10 py-4 transition-colors duration-300 xl:gap-x-7"
          >
            <span className="min-w-0 font-mono text-[10px] uppercase leading-[1.4] tracking-[0.2em] text-[#ff2d00] md:text-[11px]">
              {row.label}
            </span>

            <span className="min-w-0 font-mono text-[13px] leading-[1.8] tracking-[0.01em] text-white/72 [overflow-wrap:anywhere] md:text-[15px] md:leading-relaxed md:text-white/62 md:transition-all md:duration-300 md:ease-out md:group-hover:translate-x-[4px] md:group-hover:text-white/92">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function WhoAmI() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useWhoAmIReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-visible bg-[#090a09] text-white md:min-h-[100dvh] md:overflow-hidden"
    >
      {/* full-height center divider */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <div
          data-reveal="divider"
          className="h-full w-px origin-center bg-[#ff2d00]/90"
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-5 md:flex md:min-h-[100dvh] md:flex-col md:px-7 md:py-10 lg:px-10 lg:py-12 xl:px-16">
        {/* top label */}
        <div className="mb-8 shrink-0 md:mb-14 lg:mb-16">
          <p
            data-reveal="section-label"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]"
          >
            Quien soy / p. 003
          </p>
        </div>

        {/* content area */}
        <div className="relative md:flex-1">
          <div className="grid gap-14 md:h-full md:min-h-full md:grid-cols-2 md:gap-0">
            <div className="flex flex-col md:h-full md:justify-center md:pr-4 lg:pr-6 xl:pr-14">
              <InfoTable
                eyebrow="El código"
                title={`Lo que\ndesarrollo`}
                rows={buildRows}
              />
            </div>

            <div className="flex flex-col md:h-full md:justify-center md:pl-4 lg:pl-6 xl:pl-14">
              <InfoTable
                eyebrow="Mi cultura"
                title={`Lo que\nme mueve`}
                rows={cultureRows}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
