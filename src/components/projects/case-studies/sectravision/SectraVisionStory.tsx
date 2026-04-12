export default function SectraVisionStory() {
  return (
    <section className="relative bg-[#090a09] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
          {/* left story */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
              EL PROYECTO
            </p>

            <div className="mt-10 max-w-[930px] space-y-10">
              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                Sectra Visión es un proyecto enfocado en la gestión y optimización
                de activos digitales para marketing, donde el objetivo principal
                fue mantener, mejorar y escalar distintos sitios web y puntos de
                contacto digitales dentro de un entorno operativo real.
              </p>

              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                Se trabajó sobre múltiples sitios en CMS como WordPress,
                desarrollando landing pages orientadas a conversión, mejorando la
                estructura de navegación y asegurando el correcto funcionamiento
                técnico en temas como velocidad, seguridad y estabilidad.
              </p>

              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                El proyecto también involucró la integración de herramientas de
                CRM, analítica y automatización, permitiendo generar reportes,
                optimizar campañas y tomar decisiones basadas en datos para mejorar
                el rendimiento digital de la marca.
              </p>
            </div>
          </div>

          {/* right meta */}
          <aside className="lg:pt-14">
            <div className="border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                STACK
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "WordPress / CMS",
                  "HTML, CSS, JavaScript",
                  "Google Analytics / Tag Manager",
                  "CRM Integrations",
                  "Hosting & Domain Management",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-4 font-mono text-[15px] text-white/62 md:text-[16px]"
                  >
                    <span className="text-[#7c5cff]">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                ROL
              </p>

              <p className="mt-5 font-mono text-[15px] text-white/55 md:text-[16px]">
                Webmaster · UX/UI · Desarrollo Web · Marketing Digital
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                AÑO
              </p>

              <p className="mt-5 font-mono text-[15px] text-white/55 md:text-[16px]">
                2024
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <span className="inline-flex items-center gap-2 border-b border-[#7c5cff] pb-1 font-mono text-[15px] uppercase tracking-[0.18em] text-[#7c5cff] md:text-[16px]">
                Proyecto interno
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}