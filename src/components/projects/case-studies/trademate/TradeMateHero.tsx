"use client";

export default function TradeMateHero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#090a09] text-white">
      {/* background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/trademate-bg.webp"
          alt="TradeMate background"
          className="h-full w-full object-cover object-center opacity-[0.22] scale-[1.03]"
        />
      </div>

      {/* top gradient (igual que panels) */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-[160px] w-full bg-gradient-to-b from-[#090a09] to-transparent" />

      <div className="relative z-20 mx-auto flex min-h-[90dvh] w-full max-w-[1400px] flex-col px-6 py-8 md:px-10 md:py-10 lg:px-16 lg:py-12">
        {/* top meta */}
        <div className="flex items-start justify-between gap-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            CASO DE ESTUDIO
          </p>

          <button
            type="button"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] transition-opacity duration-300 hover:opacity-70 md:text-[11px]"
          >
            Sistema de comercio B2B/B2C
          </button>
        </div>

        {/* secondary meta */}
        <div className="mt-12 flex items-start justify-between gap-6 md:mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            01 / 07
          </p>

          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
              2026
            </p>
            <p className="mt-3 font-mono text-[11px] text-white/35 md:text-[12px]">
              Ecommerce
            </p>
          </div>
        </div>

        {/* hero content */}
        <div className="mt-auto flex flex-col">
          <div className="border-b border-[#6d56ff]/45 pb-4">
            <h1 className="max-w-full text-[15vw] font-black uppercase leading-[0.9] tracking-[-0.045em] text-[#f3efe8] sm:text-[16.5vw] md:text-[15vw] md:tracking-[-0.07em] lg:text-[13vw]">
              TRADEMATE
            </h1>
          </div>

          <p className="mt-4 max-w-[720px] font-mono text-[13px] leading-[1.8] text-[#8f7cff] md:mt-5 md:text-[15px]">
            Una infraestructura de comercio escalable
          </p>
        </div>
      </div>
    </section>
  );
}