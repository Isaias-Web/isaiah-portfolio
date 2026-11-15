const responsibilities = [
  "Desarrollo y evolución de sitios, landings y funcionalidades con WordPress, PHP, HTML, CSS y JavaScript.",
  "Integración y mantenimiento de formularios conectados a CRM, servicios externos y mecanismos de validación.",
  "Diagnóstico de incidencias, administración técnica de CMS y documentación de cambios en coordinación con distintas áreas.",
];

const workflow = [
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

export default function RightNow() {
  return (
    <section
      id="experiencia"
      aria-labelledby="experience-heading"
      className="relative overflow-hidden bg-[#090a09] text-white"
    >
      <div className="relative px-6 py-10 md:px-10 md:py-12 lg:px-16 lg:py-14">
        <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
          / experiencia y método / p. 005
        </p>
        <h2
          id="experience-heading"
          className="max-w-[620px] font-black uppercase leading-[0.84] tracking-[-0.07em] text-[#f3efe8] text-[24vw] sm:text-[20vw] md:text-[15vw] lg:text-[13vw]"
        >
          <span className="block">PERFIL</span>
          <span className="block text-[#ff2d00]">ACTUAL</span>
        </h2>
        <article
          aria-labelledby="uic-heading"
          className="mt-16 border-t border-white/15 py-10 md:mt-20 md:py-14"
        >
          <div className="grid min-w-0 gap-8 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-20">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2d00]">
                Experiencia institucional / UIC
              </p>
              <h3
                id="uic-heading"
                className="mt-6 max-w-[750px] text-[clamp(2.2rem,5.8vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.05em]"
              >
                Web Master
                <br />
                Institucional
              </h3>
              <p className="mt-6 font-mono text-[14px] leading-relaxed text-white/80">
                Universidad Intercontinental
              </p>
              <p className="mt-1 font-mono text-[12px] leading-relaxed text-white/55">
                Comunicación Social
              </p>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-[#ff2d00]">
                <time dateTime="2026-08-18">18 de agosto de 2026</time> —
                actualidad
              </p>
            </div>
            <div className="min-w-0">
              <p className="max-w-[650px] text-[clamp(1.2rem,2.2vw,1.8rem)] leading-[1.45] tracking-[-0.02em] text-[#f3efe8]">
                Desarrollo y administro plataformas web institucionales, integro
                servicios y automatizo tareas técnicas.
              </p>
              <ul className="mt-8 divide-y divide-white/10 border-t border-white/10">
                {responsibilities.map((text, index) => (
                  <li
                    key={text}
                    className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-5 font-mono text-[12px] leading-[1.8] text-white/65 md:text-[13px]"
                  >
                    <span aria-hidden="true" className="text-[#ff2d00]">
                      0{index + 1}
                    </span>
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>
        <article
          aria-labelledby="engineering-heading"
          className="border-t border-[#ff2d00]/70 py-10 md:py-14"
        >
          <div className="grid min-w-0 gap-10 md:grid-cols-[1.1fr_1fr] md:gap-12 lg:gap-20">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ff2d00]">
                Ingeniería asistida y automatización
              </p>
              <h3
                id="engineering-heading"
                lang="en"
                className="mt-6 text-[clamp(2rem,4.5vw,4.5rem)] font-black uppercase leading-[0.98] tracking-[-0.04em]"
              >
                AI-Assisted
                <br />
                Engineering
                <br />
                <span className="text-[#ff2d00]">&amp; Automation</span>
              </h3>
              <p className="mt-6 max-w-[540px] font-mono text-[12px] leading-[1.8] text-white/60 md:text-[13px]">
                Aplico IA al trabajo de ingeniería y combino scripts e
                integraciones para resolver tareas repetitivas. Cada flujo
                necesita criterios de revisión y comprobación.
              </p>
            </div>
            <ol className="divide-y divide-white/10 border-t border-white/10">
              {workflow.map((step, index) => (
                <li
                  key={step.title}
                  className="grid grid-cols-[2rem_minmax(0,1fr)] gap-4 py-6"
                >
                  <span
                    aria-hidden="true"
                    className="font-mono text-[11px] text-[#ff2d00]"
                  >
                    0{index + 1}
                  </span>
                  <div>
                    <h4 className="text-xl font-semibold tracking-[-0.02em]">
                      {step.title}
                    </h4>
                    <p className="mt-3 font-mono text-[12px] leading-[1.8] text-white/60 md:text-[13px]">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <dl className="mt-10 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2 md:gap-12 lg:gap-20">
            <div className="min-w-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff2d00]">
                Automatización técnica / Python y PHP
              </dt>
              <dd className="mt-4 max-w-[580px] font-mono text-[12px] leading-[1.8] text-white/65 md:text-[13px]">
                Scripts para actualizar múltiples páginas, generar inventarios y
                ejecutar auditorías y validaciones de implementaciones.
              </dd>
            </div>
            <div className="min-w-0">
              <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#ff2d00]">
                Automatización operativa / Power Automate
              </dt>
              <dd className="mt-4 max-w-[580px] font-mono text-[12px] leading-[1.8] text-white/65 md:text-[13px]">
                Flujos que procesan correos y adjuntos según condiciones
                definidas, con comprobaciones para evitar duplicados.
              </dd>
            </div>
          </dl>
        </article>
      </div>
    </section>
  );
}
