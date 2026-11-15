export default function SectraVisionFeature() {
  return (
    <section className="relative overflow-hidden bg-[#090a09] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <div className="grid min-h-[760px] border border-white/5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden border-b border-white/5 bg-[#090a09] lg:min-h-[760px] lg:border-b-0 lg:border-r lg:border-white/5">
            <div className="pointer-events-none absolute inset-0 opacity-[0.14]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(124,92,255,0.08),transparent_60%)]" />
              <div className="absolute inset-0 [background:repeating-linear-gradient(90deg,transparent_0,transparent_110px,rgba(255,255,255,0.018)_110px,rgba(255,255,255,0.018)_111px)]" />
            </div>

            <div className="relative z-10 w-full max-w-[780px] px-6 md:px-10">
              <div className="relative overflow-hidden border border-[#201a3d] bg-black shadow-[0_0_0_1px_rgba(109,86,255,0.08)]">
                <div className="aspect-[1.42/1] w-full bg-[#0a0a0a]">
                  <img
                    src="/images/sectra-bg.png"
                    alt="Sectra Vision project preview"
                    className="h-full w-full object-cover opacity-80"
                  />
                </div>

                <div className="border-t border-white/10 bg-black/70 px-5 py-4 md:px-6 md:py-5">
                  <p className="text-[clamp(1.8rem,4.8vw,4.2rem)] font-black uppercase leading-none tracking-[-0.08em] text-[#f3efe8]">
                    SECTRA VISION
                  </p>

                  <div className="mt-3 h-px w-[58%] bg-[#ff2d00]" />

                  <p className="mt-3 max-w-[460px] font-mono text-[10px] leading-[1.8] text-white/55 md:text-[11px]">
              Sitios y landings en WordPress, soporte técnico y conexiones con CRM y analítica para las necesidades de marketing.
            </p>
                </div>

                <div className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-[#ffb000]" />
              </div>
            </div>

            <p className="absolute bottom-8 left-6 font-mono text-[10px] uppercase tracking-[0.28em] text-[#7c5cff] md:bottom-10 md:left-10 md:text-[11px] lg:left-12">
              EN OPERACIÓN
            </p>
          </div>

          <div className="relative overflow-hidden bg-[#060606]">
            <div className="pointer-events-none absolute inset-0 opacity-[0.22]">
              <div className="absolute inset-0 [background-image:linear-gradient(rgba(109,86,255,0.11)_1px,transparent_1px),linear-gradient(90deg,rgba(109,86,255,0.11)_1px,transparent_1px)] [background-size:44px_44px]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(109,86,255,0.1),transparent_38%)]" />
            </div>

            <div className="relative flex h-full min-h-[420px] flex-col px-8 py-10 md:px-10 md:py-12 lg:min-h-[760px] lg:px-14 lg:py-14">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#7c5cff] md:text-[11px]">
                  ÁREAS
                </p>

                <ul className="mt-8 space-y-5">
                  {[
                    "WordPress / CMS Management",
                    "Landing Pages",
                    "UX/UI Web Design",
                    "Technical Maintenance",
                    "CRM Integrations",
                    "Analytics & Reporting",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-4 font-mono text-[15px] text-white/65 md:text-[16px]"
                    >
                      <span className="text-[#7c5cff]">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto pt-16">
                <p className="text-[clamp(4rem,12vw,10rem)] font-black uppercase leading-none tracking-[-0.08em] text-[#7c5cff]/18">
                  2024
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}