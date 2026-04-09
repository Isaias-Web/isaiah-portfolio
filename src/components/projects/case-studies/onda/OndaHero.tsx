"use client";

export default function OndaHero() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden bg-[#090a09] text-white">
      {/* background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/onda-bg.png"
          alt="ONDA background"
          className="h-full w-full object-cover object-center opacity-[0.22] scale-[1.03]"
        />
      </div>

      {/* top gradient */}
      <div className="pointer-events-none absolute top-0 left-0 z-10 h-[160px] w-full bg-gradient-to-b from-[#090a09] to-transparent" />

      <div className="relative z-20 mx-auto flex min-h-[90dvh] w-full max-w-[1400px] flex-col px-6 py-8 md:px-10 md:py-10 lg:px-16 lg:py-12">
        <div className="flex items-start justify-between gap-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            CASO DE ESTUDIO
          </p>

          <button
            type="button"
            className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] transition-opacity duration-300 hover:opacity-70 md:text-[11px]"
          >
            ECOMMERCE · BRAND · WELLNESS EXPERIENCE
          </button>
        </div>

        <div className="mt-12 flex items-start justify-between gap-6 md:mt-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            03 / 04
          </p>

          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
              2026
            </p>
            <p className="mt-3 font-mono text-[11px] text-white/35 md:text-[12px]">
              Brand · Experience
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-col">
          <div className="border-b border-[#6d56ff]/45 pb-4">
            <h1 className="text-[22vw] font-black uppercase leading-[0.86] tracking-[-0.08em] text-[#f3efe8] md:text-[15vw] lg:text-[13vw]">
              ONDA
            </h1>
          </div>

          <p className="mt-4 max-w-[720px] font-mono text-[13px] leading-[1.8] text-[#8f7cff] md:mt-5 md:text-[15px]">
            Experiencia digital de marca enfocada en conexión y claridad de producto
          </p>
        </div>
      </div>
    </section>
  );
}