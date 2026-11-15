"use client";

import { useSmoothScrollControl } from "@/components/SmoothScrollContext";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/animations/gsap-config";
import { letterOffsets } from "@/animations/letter-motion";

function splitText(text: string) {
  return text.split("").map((char, i) => (
    <span
      key={`${text}-${i}`}
      className="hero-letter inline-block will-change-transform"
      data-letter-index={i}
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const topBarRef = useRef<HTMLDivElement | null>(null);
  const firstLineRef = useRef<HTMLHeadingElement | null>(null);
  const secondLineRef = useRef<HTMLParagraphElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const bottomMetaRef = useRef<HTMLDivElement | null>(null);
  const bgRef = useRef<HTMLDivElement | null>(null);
  const bottomBlendRef = useRef<HTMLDivElement | null>(null);

  const { introReady } = useSmoothScrollControl();

  useLayoutEffect(() => {
    if (!introReady) return;
    const cleanups: Array<() => void> = [];

    const section = sectionRef.current;
    const divider = dividerRef.current;

    if (!section || !divider) return;

    const ctx = gsap.context(() => {
      gsap.set(
        [topBarRef.current, dividerRef.current, bottomMetaRef.current],
        {
          opacity: 0,
          y: 24,
        }
      );

      gsap.set([firstLineRef.current, secondLineRef.current], {
        opacity: 0,
        yPercent: 18,
        skewY: 4,
        transformOrigin: "top center",
      });

      gsap.set(bgRef.current, {
        scale: 1.08,
        opacity: 0,
      });

      gsap.set(bottomBlendRef.current, {
        scaleY: 0.35,
        opacity: 0.7,
        transformOrigin: "bottom center",
      });

      const introTl = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

      introTl
        .to(bgRef.current, {
          opacity: 1,
          scale: 1,
          duration: 1.4,
        })
        .to(
          topBarRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          "-=1.0"
        )
        .to(
          firstLineRef.current,
          {
            opacity: 1,
            yPercent: 0,
            skewY: 0,
            duration: 0.95,
          },
          "-=0.35"
        )
        .to(
          secondLineRef.current,
          {
            opacity: 1,
            yPercent: 0,
            skewY: 0,
            duration: 0.95,
          },
          "-=0.72"
        )
        .to(
          dividerRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          "-=0.45"
        )
        .to(
          bottomMetaRef.current,
          {
            opacity: 1,
            y: 0,
            duration: 0.75,
          },
          "-=0.35"
        );

      const letters = gsap.utils.toArray<HTMLElement>(".hero-letter");

      letters.forEach((letter, i) => {
        const offset = letterOffsets[i % letterOffsets.length];

        const handleEnter = () => {
          gsap.to(letter, {
            x: offset.x,
            y: offset.y,
            rotation: offset.rotation,
            duration: 0.28,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleLeave = () => {
          gsap.to(letter, {
            x: 0,
            y: 0,
            rotation: 0,
            duration: 0.45,
            ease: "power3.out",
            overwrite: "auto",
          });
        };

        letter.addEventListener("mouseenter", handleEnter);
        letter.addEventListener("mouseleave", handleLeave);

        cleanups.push(() => {
          letter.removeEventListener("mouseenter", handleEnter);
          letter.removeEventListener("mouseleave", handleLeave);
        });
      });

      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      scrollTl
        .to(
          bgRef.current,
          {
            scale: 1.12,
            yPercent: 8,
            ease: "none",
          },
          0
        )
        .to(
          firstLineRef.current,
          {
            xPercent: -10,
            yPercent: -22,
            rotate: -3,
            ease: "none",
          },
          0
        )
        .to(
          secondLineRef.current,
          {
            xPercent: 10,
            yPercent: 22,
            rotate: 3,
            ease: "none",
          },
          0
        )
        .to(
          dividerRef.current,
          {
            scaleX: 0,
            opacity: 0,
            ease: "none",
          },
          0
        )
        .to(
          bottomMetaRef.current,
          {
            opacity: 0.2,
            y: 16,
            ease: "none",
          },
          0
        )
        .to(
          bottomBlendRef.current,
          {
            scaleY: 1.45,
            opacity: 1,
            ease: "none",
          },
          0
        );
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [introReady]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden bg-[#050505] text-white"
    >
      {/* Background image */}
      <div ref={bgRef} className="absolute inset-0 z-0 will-change-transform">
        <Image
          src="/images/hero-portfolio.png"
          alt="Retrato de Isaías Frutos"
          fill
          priority
          className="object-cover object-center"
        />

        {/* dark base */}
        <div className="absolute inset-0 bg-black/55" />

        {/* stronger bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

        {/* left-to-right cinematic shading */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/55" />

        {/* orange atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_62%,rgba(255,45,0,0.22),transparent_32%),radial-gradient(circle_at_78%_28%,rgba(255,45,0,0.10),transparent_26%)]" />

        {/* vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.85)]" />
      </div>

      {/* top ui */}
      <div className="relative z-20 flex min-h-screen flex-col justify-between px-6 pb-8 pt-8 md:px-10 lg:px-16">
        <div
          ref={topBarRef}
          className="flex items-start justify-between"
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            isaiasfrutos.dev
          </p>

          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
            vol. 1 / 2026
          </p>
        </div>

        <div className="pointer-events-none relative z-20 mt-auto pt-[10rem] sm:pt-[12rem] md:pt-[14rem] lg:pt-[16rem]">
          <div
            ref={dividerRef}
            className="mt-6 h-px w-full origin-left bg-[#ff2d00]"
          />

          <div
            ref={bottomMetaRef}
            className="mt-4 flex items-end justify-between gap-4"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/35 md:text-[11px]">
              p. 001
            </p>

            <div className="max-w-[520px] text-right">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/80 md:text-[12px]">
                Desarrollo full-stack · eCommerce · integraciones
              </p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
                ↓ Desplázate para sintonizar
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* giant typography */}
      <div className="absolute inset-x-6 bottom-24 z-30 md:inset-x-10 md:bottom-28 lg:inset-x-16 lg:bottom-32">
        <div className="max-w-[1300px] overflow-visible">
          <h1
            aria-label="Isaías Frutos"
            ref={firstLineRef}
            className="font-black uppercase leading-[0.84] tracking-[-0.065em] text-[#ff2d00] text-[24vw] sm:text-[21vw] md:text-[18vw] lg:text-[15vw] will-change-transform drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            {splitText("Isaías")}
          </h1>
        </div>

        <div className="max-w-[1300px] overflow-visible">
          <p
            ref={secondLineRef}
            className="font-black uppercase leading-[0.88] tracking-[-0.065em] text-white text-[24vw] sm:text-[21vw] md:text-[18vw] lg:text-[15vw] will-change-transform drop-shadow-[0_8px_24px_rgba(0,0,0,0.45)]"
          >
            {splitText("Frutos")}
          </p>
        </div>
      </div>

      <div
        ref={bottomBlendRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[38vh] origin-bottom"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#090a09] via-[#090a09]/82 via-[45%] to-transparent" />
      </div>
    </section>
  );
}
