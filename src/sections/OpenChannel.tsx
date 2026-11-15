"use client";

import { useRef } from "react";
import ContactForm from "@/components/contact/ContactForm";
import { useContactGlow } from "@/hooks/useContactGlow";

const socialLinks = [
  { label: "Sitio", href: "https://isaiasfrutos.dev" },
  { label: "CV", href: "/cv-isaias-frutos.pdf" },
  { label: "GitHub", href: "https://github.com/Isaias-Web" },
  { label: "Instagram", href: "https://www.instagram.com/isaiah_sfc/" },
];

export default function OpenChannel() {
  const sectionRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  useContactGlow(sectionRef, glowRef);

  return (
    <section
      ref={sectionRef}
      id="contacto"
      aria-labelledby="contact-heading"
      className="relative isolate min-h-screen overflow-hidden bg-[#090a09] text-white"
    >
      <div
        ref={glowRef}
        data-contact-glow
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-0 opacity-0"
        style={{
          width: "min(64rem, 120vw)",
          height: "min(64rem, 120vw)",
          backgroundImage:
            "radial-gradient(ellipse at center, rgba(255,45,0,0.13) 0%, rgba(255,45,0,0.055) 32%, rgba(255,45,0,0.018) 52%, transparent 72%)",
        }}
      />
      <div className="relative z-10 flex min-h-screen flex-col px-6 py-10 md:px-10 md:py-12 lg:px-16 lg:py-14">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
          / contacto / p. 006
        </p>
        <h2
          id="contact-heading"
          className="mt-12 max-w-[1000px] text-[clamp(2.6rem,6.8vw,6.5rem)] font-black uppercase leading-[0.95] tracking-[-0.05em] md:mt-16"
        >
          Cuéntame qué
          <br />
          necesitas construir.
        </h2>
        <div className="mt-10 grid min-w-0 gap-12 border-t border-[#ff2d00]/80 pt-10 md:mt-14 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <p className="max-w-[580px] font-mono text-[13px] leading-[1.9] text-white/65">
              Desarrollo web, eCommerce, integraciones o una colaboración.
              Cuéntame el contexto y el objetivo de tu consulta.
            </p>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ff2d00]">
              Contacto directo
            </p>
            <a
              href="mailto:isaiahweb333@gmail.com"
              className="mt-4 inline-block max-w-full break-all text-[clamp(1.1rem,2.6vw,2.8rem)] font-black uppercase leading-[1.25] tracking-[-0.03em] text-[#f3efe8]"
            >
              isaiahweb333@gmail.com
            </a>
            <p className="mt-5 font-mono text-[12px] leading-[1.8] text-white/50">
              El correo y el enlace de WhatsApp están disponibles para contactar
              directamente.
            </p>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-5">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/60 transition-colors hover:text-white"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
          <ContactForm />
        </div>
        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-[10px] uppercase tracking-[0.18em] text-white/40 md:flex-row md:items-end md:justify-between md:text-[11px]">
          <p className="font-mono">© 2026 ISAÍAS FRUTOS — isaiasfrutos.dev</p>
          <p className="font-mono">
            Desarrollo full-stack · eCommerce · integraciones
          </p>
        </div>
      </div>
    </section>
  );
}
