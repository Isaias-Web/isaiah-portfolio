const socialLinks = [
  { label: "Sitio", href: "https://www.isaiasfrutosweb.site" },
  { label: "CV", href: "/cv-isaias-frutos.pdf" },
  { label: "GitHub", href: "https://github.com/Isaias-Web" },
  { label: "Instagram", href: "https://www.instagram.com/isaiah_sfc/" },
];

export default function OpenChannel() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#090a09] text-white">
      <div className="relative flex min-h-screen flex-col px-6 py-10 md:px-10 md:py-12 lg:px-16 lg:py-14">

        {/* top label */}
        <div className="space-y-8 md:space-y-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            / contacto / p. 006
          </p>
        </div>

        {/* main block */}
        <div className="mt-16 md:mt-20 lg:mt-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            Construyamos algo que realmente genere valor.
          </p>

          <div className="mt-10 md:mt-12">
            <a
              href="mailto:isaiahweb333@gmail.com"
              className="block max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-black uppercase leading-[0.9] tracking-[-0.06em] text-[#f3efe8] text-[10vw] sm:text-[9vw] md:text-[7vw] lg:text-[6vw]"
            >
              isaiahweb333@gmail.com
            </a>
          </div>
        </div>

        {/* divider */}
        <div className="mt-12 h-px w-full bg-[#ff2d00]/80 md:mt-16" />

        {/* links */}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-5 md:mt-12 md:gap-x-12">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/45 transition-colors duration-300 hover:text-white"
            >
              {link.label} ↗
            </a>
          ))}
        </div>

        {/* footer */}
        <div className="mt-auto flex flex-col gap-4 pt-16 text-[10px] uppercase tracking-[0.18em] text-white/20 md:flex-row md:items-end md:justify-between md:text-[11px]">
          <p className="font-mono">
            © 2026 ISAÍAS FRUTOS — isaiasfrutosweb.site
          </p>

          <p className="font-mono">
            Desarrollo web · e-commerce · sistemas
          </p>
        </div>
      </div>
    </section>
  );
}