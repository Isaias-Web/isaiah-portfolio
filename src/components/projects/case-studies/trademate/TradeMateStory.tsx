export default function TradeMateStory() {
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
                TradeMate es una plataforma de comercio diseñada para unificar operaciones B2B y B2C en un solo sistema. Nace de la necesidad de centralizar inventario, automatizar procesos y escalar múltiples canales de venta sin perder control operativo.
              </p>

              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                Se desarrolló una arquitectura que permite gestionar productos, variantes y SKUs de forma eficiente, integrando flujos de mayoreo y menudeo dentro de una misma lógica. La sincronización de inventario y la automatización de órdenes reducen errores y optimizan la operación diaria.
              </p>

              <p className="font-mono text-[16px] leading-[1.95] text-white/62 md:text-[17px] lg:text-[18px]">
                Más que una tienda, TradeMate funciona como un sistema de distribución digital, donde cada proceso está pensado para escalar: desde la gestión de stock hasta la integración entre plataformas.
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
                  "Shopify (Liquid)",
                  "Shopify GraphQL & Webhooks",
                  "Node.js",
                  "Redis / Upstash",
                  "APIs personalizadas",
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
                Full Stack Developer · Ecommerce · System Design
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                AÑO
              </p>

              <p className="mt-5 font-mono text-[15px] text-white/55 md:text-[16px]">
                2026
              </p>
            </div>

            <div className="mt-10 border-t border-white/10 pt-8">
              <a
                target="_blank"
                href="https://trademat3.com/"
                className="inline-flex items-center gap-2 border-b border-[#7c5cff] pb-1 font-mono text-[15px] uppercase tracking-[0.18em] text-[#7c5cff] transition-opacity duration-300 hover:opacity-70 md:text-[16px]"
              >
                Ver sitio
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}