"use client";

import { useRef } from "react";
import { useRightNowReveal } from "@/hooks/useRightNowReveal";

type EditorialPoint = {
  title: string;
  text: string;
};

const responsibilities: EditorialPoint[] = [
  {
    title: "Desarrollo web",
    text: "Desarrollo y evolución de sitios, landings y funcionalidades con WordPress, PHP, HTML, CSS y JavaScript.",
  },
  {
    title: "Integraciones",
    text: "Integración y mantenimiento de formularios conectados a CRM, servicios externos y mecanismos de validación.",
  },
  {
    title: "Operación técnica",
    text: "Diagnóstico de incidencias, administración técnica de CMS y documentación de cambios en coordinación con distintas áreas.",
  },
];

const workflow: EditorialPoint[] = [
  {
    title: "Problema",
    text: "Reviso el contexto, el código y las restricciones para definir qué necesita cambiar y cómo comprobarlo.",
  },
  {
    title: "Implementación",
    text: "Desarrollo la solución con apoyo de ChatGPT y Codex para analizar, planificar, refactorizar y documentar. Las decisiones técnicas se revisan durante el proceso.",
  },
  {
    title: "Validación",
    text: "Compruebo el comportamiento con pruebas, revisión de cambios y control de versiones mediante GitHub y CI antes de integrar una implementación.",
  },
];

// Both professional pillars must have exactly the same desktop type scale.
const articleTitleClass =
  "mt-6 max-w-full font-black uppercase leading-[0.95] tracking-[-0.055em] text-[#f3efe8] text-[clamp(1.6rem,7.2vw,4.4rem)] md:text-[clamp(1.9rem,3.8vw,4.75rem)] lg:text-[clamp(2.3rem,4.15vw,4.75rem)]";
const articleIntroClass =
  "max-w-[650px] text-[clamp(1.2rem,2.2vw,1.8rem)] leading-[1.45] tracking-[-0.02em] text-[#f3efe8]";
const articleGridClass =
  "grid min-w-0 gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-20";
const articleSurfaceClass =
  "rounded-[15px] p-5 shadow-[6.95px_7.95px_23.6px_rgba(255,255,255,0.14)] sm:p-8 lg:p-[50px]";

function NumberedPoints({
  items,
  reveal,
  reverseOnDesktop = false,
}: {
  items: EditorialPoint[];
  reveal: "responsibility" | "step";
  reverseOnDesktop?: boolean;
}) {
  return (
    <ol className="mt-8 divide-y divide-white/10 border-t border-white/10">
      {items.map((item, index) => (
        <li
          key={item.title}
          data-right-now-reveal={reveal}
          className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-6 ${reverseOnDesktop ? "lg:grid-cols-[minmax(0,1fr)_2rem]" : ""}`}
        >
          <span aria-hidden="true" className={`font-mono text-[11px] text-[#ff2d00] ${reverseOnDesktop ? "lg:order-2 lg:text-right" : ""}`}>
            0{index + 1}
          </span>
          <div className={`min-w-0 ${reverseOnDesktop ? "lg:order-1 lg:text-right" : ""}`}>
            <h4 className="text-xl font-semibold tracking-[-0.02em]">
              {item.title}
            </h4>
            <p className="mt-3 font-mono text-[12px] leading-[1.8] text-white/60 md:text-[13px]">
              {item.text}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function RightNow() {
  const sectionRef = useRef<HTMLElement>(null);
  useRightNowReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="experiencia"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-[#090a09] text-white"
    >
      <div className="relative px-6 py-10 md:px-10 md:py-12 lg:px-16 lg:py-14">
        <p
          data-right-now-reveal="label"
          className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]"
        >
          / experiencia y método / p. 005
        </p>
        <h2
          id="experience-heading"
          aria-label="Perfil actual"
          className="max-w-[620px] font-black uppercase leading-[0.84] tracking-[-0.07em] text-[#f3efe8] text-[24vw] sm:text-[20vw] md:text-[15vw] lg:text-[13vw]"
        >
          {["PERFIL", "ACTUAL"].map((line, lineIndex) => (
            <span
              key={line}
              aria-hidden="true"
              className={
                lineIndex
                  ? "block whitespace-nowrap text-[#ff2d00]"
                  : "block whitespace-nowrap"
              }
            >
              {line.split("").map((letter, index) => (
                <span
                  key={`${line}-${index}`}
                  data-right-now-reveal="letter"
                  className="inline-block"
                >
                  <span data-right-now-letter className="inline-block">
                    {letter}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h2>

        {/* Single editorial group: no full-width orange divider between pillars. */}
        <div className="mt-16 border-t border-white/15 pt-10 md:mt-20 md:pt-14">
          <article aria-labelledby="uic-heading" className={articleSurfaceClass}>
            <div className={articleGridClass}>
              <div className="min-w-0">
                <p
                  data-right-now-reveal="uic-label"
                  className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2d00]"
                >
                  Experiencia institucional / UIC
                </p>
                <h3
                  id="uic-heading"
                  data-right-now-reveal="uic-title"
                  className={articleTitleClass}
                >
                  Web Master
                  <br />
                  Institucional
                </h3>
                <p
                  data-right-now-reveal="uic-meta"
                  className="mt-6 font-mono text-[14px] leading-relaxed text-white/80"
                >
                  Universidad Intercontinental
                </p>
                <p
                  data-right-now-reveal="uic-meta"
                  className="mt-1 font-mono text-[12px] leading-relaxed text-white/55"
                >
                  Comunicación Social
                </p>
                <p
                  data-right-now-reveal="uic-date"
                  className="mt-4 font-mono text-[11px] leading-relaxed text-[#ff2d00]"
                >
                  <time dateTime="2026-08-18">18 de agosto de 2026</time> — actualidad
                </p>
              </div>
              <div className="min-w-0">
                <p data-right-now-reveal="uic-intro" className={articleIntroClass}>
                  Desarrollo y administro plataformas web institucionales, integro
                  servicios y automatizo tareas técnicas.
                </p>
                <NumberedPoints items={responsibilities} reveal="responsibility" />
              </div>
            </div>
          </article>

          <article aria-labelledby="engineering-heading" className={`${articleSurfaceClass} mt-10 md:mt-14`}>
            <div className={`${articleGridClass} lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]`}>
              <div className="min-w-0 lg:order-2 lg:text-right">
                <p
                  data-right-now-reveal="ai-label"
                  className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2d00]"
                >
                  Ingeniería asistida y automatización
                </p>
                <h3 id="engineering-heading" lang="en" className={articleTitleClass}>
                  <span data-right-now-reveal="ai-line" className="inline-block">
                    AI-Assisted
                  </span>
                  <br />
                  <span data-right-now-reveal="ai-line" className="inline-block">
                    Engineering
                  </span>
                  <br />
                  <span data-right-now-reveal="ai-line" className="inline-block">
                    &amp; Automation
                  </span>
                </h3>
                <p
                  data-right-now-reveal="ai-meta"
                  className="mt-6 font-mono text-[14px] leading-relaxed text-white/80"
                >
                  Ingeniería aplicada a soluciones digitales
                </p>
                <p
                  data-right-now-reveal="ai-meta"
                  className="mt-1 font-mono text-[12px] leading-relaxed text-white/55"
                >
                  ChatGPT · Codex · Python · PHP · Power Automate
                </p>
                <p
                  data-right-now-reveal="ai-date"
                  className="mt-4 font-mono text-[11px] leading-relaxed text-[#ff2d00]"
                >
                  <time dateTime="2026">2026</time> — actualidad
                </p>
              </div>
              <div className="min-w-0 lg:order-1 lg:text-right">
                <p data-right-now-reveal="ai-intro" className={articleIntroClass}>
                  Aplico IA al trabajo de ingeniería y combino scripts e
                  integraciones para resolver tareas repetitivas. Cada flujo
                  necesita criterios de revisión y comprobación.
                </p>
                <NumberedPoints items={workflow} reveal="step" reverseOnDesktop />
              </div>
            </div>
            <dl className="mt-10 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2 md:gap-12 lg:gap-20 lg:text-right">
              <div data-right-now-reveal="automation" className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff2d00]">
                  Automatización técnica / Python y PHP
                </dt>
                <dd className="mt-4 max-w-[580px] font-mono text-[12px] leading-[1.8] text-white/65 md:text-[13px] lg:ml-auto">
                  Scripts para actualizar múltiples páginas, generar inventarios y
                  ejecutar auditorías y validaciones de implementaciones.
                </dd>
              </div>
              <div data-right-now-reveal="automation" className="min-w-0">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff2d00]">
                  Automatización operativa / Power Automate
                </dt>
                <dd className="mt-4 max-w-[580px] font-mono text-[12px] leading-[1.8] text-white/65 md:text-[13px] lg:ml-auto">
                  Flujos que procesan correos y adjuntos según condiciones
                  definidas, con comprobaciones para evitar duplicados.
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </div>
    </section>
  );
}
