export default function VapeMateStory() {
  return (
    <section className="relative bg-[#090a09] text-white">
      <div className="mx-auto w-full max-w-[1400px] px-6 py-20 md:px-10 md:py-24 lg:px-16 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-20">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
              EL PROYECTO
            </p>

            <div className="mt-10 max-w-[930px] space-y-10">
              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                Vape Mate combina operación de eCommerce, gestión de catálogo y contenido para una marca de distribución con presencia en México y Europa.
              </p>

              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                El trabajo como webmaster y en UX/UI y diseño gráfico incluyó la organización de información de producto, piezas visuales y soporte a la operación digital diaria.
              </p>

              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                La implementación se apoyó en Shopify y Liquid, con JavaScript, CSS y contenido de producto. El catálogo y los materiales visuales formaron parte del soporte a los distintos canales de la marca.
              </p>
            </div>
          </div>

          <aside className="lg:pt-14">
            <div className="border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                STACK
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Shopify",
                  "Liquid",
                  "UX/UI Design",
                  "JavaScript",
                  "CSS",
                  "Graphic Design",
                  "Product Content",
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
                Webmaster · UX/UI · Graphic Design · Ecommerce Support
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                AÑO
              </p>

              <p className="mt-5 font-mono text-[15px] text-white/55 md:text-[16px]">
                2023
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <span
                className="inline-flex items-center gap-2 border-b border-[#7c5cff] pb-1 font-mono text-[15px] uppercase tracking-[0.18em] text-[#7c5cff] transition-opacity duration-300 hover:opacity-70 md:text-[16px]"
              >
                Página no disponible
                <span aria-hidden="true">↗</span>
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}