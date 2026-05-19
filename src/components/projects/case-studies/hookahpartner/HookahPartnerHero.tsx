"use client";

export default function HookahPartnerHero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#090a09] text-white">
      {/* background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hookahpartner-bg.webp"
          alt="Hookah Partner background"
          className="h-full w-full scale-[1.03] object-cover object-center opacity-[0.22]"
        />
      </div>

      {/* top gradient */}
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-[160px] w-full bg-gradient-to-b from-[#090a09] to-transparent" />

      <div className="relative z-20 mx-auto flex min-h-[90dvh] w-full max-w-[1400px] flex-col px-5 py-8 sm:px-6 md:px-10 md:py-10 lg:px-16 lg:py-12">
        <div className="flex min-w-0 items-start justify-between gap-5">
          <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff2d00] sm:text-[10px] sm:tracking-[0.28em] md:text-[11px]">
            CASO DE ESTUDIO
          </p>

          <button
            type="button"
            className="max-w-[160px] text-right font-mono text-[9px] uppercase leading-[1.5] tracking-[0.18em] text-[#ff2d00] transition-opacity duration-300 hover:opacity-70 sm:max-w-none sm:text-[10px] sm:tracking-[0.28em] md:text-[11px]"
          >
            ECOMMERCE DTC · UX/UI · CONVERSIÓN
          </button>
        </div>

        <div className="mt-12 flex min-w-0 items-start justify-between gap-5 md:mt-16">
          <p className="shrink-0 font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff2d00] sm:text-[10px] sm:tracking-[0.28em] md:text-[11px]">
            07 / 07
          </p>

          <div className="min-w-0 text-right">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-[#ff2d00] sm:text-[10px] sm:tracking-[0.28em] md:text-[11px]">
              2023
            </p>

            <p className="mt-3 max-w-[180px] font-mono text-[10px] leading-[1.5] text-white/35 sm:max-w-none md:text-[12px]">
              DTC · Commerce · Experience
            </p>
          </div>
        </div>

        <div className="mt-auto flex min-w-0 flex-col">
          <div className="border-b border-[#6d56ff]/45 pb-4">
            <h1 className="w-full max-w-full whitespace-normal break-words text-wrap-balance font-black uppercase leading-[0.86] tracking-[-0.065em] text-[#f3efe8] text-[clamp(3.1rem,15vw,11rem)] md:text-[clamp(5rem,12vw,13rem)]">
              HOOKAH PARTNER
            </h1>
          </div>

          <p className="mt-4 max-w-[720px] font-mono text-[11px] leading-[1.8] text-[#8f7cff] sm:text-[13px] md:mt-5 md:text-[15px]">
            Experiencia ecommerce enfocada en navegación, claridad de producto
            y conversión
          </p>
        </div>
      </div>
    </section>
  );
}