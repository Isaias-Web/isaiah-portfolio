"use client";

import { useSmoothScrollControl } from "@/components/SmoothScrollContext";

import { useLayoutEffect } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap-config";

export function useManifestoReveal(ref: React.RefObject<HTMLElement | null>) {
  const { introReady } = useSmoothScrollControl();

  useLayoutEffect(() => {
    if (!introReady) return;
    const section = ref.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const top = section.querySelector<HTMLElement>('[data-animate="top"]');
      const bottom = section.querySelector<HTMLElement>(
        '[data-animate="bottom"]',
      );
      const words = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll(".manifesto-word"),
      );

      if (!words.length) return;

      gsap.set(words, { opacity: 0.08 });
      if (top) gsap.set(top, { opacity: 0, y: 16 });
      if (bottom) gsap.set(bottom, { opacity: 0, y: 14 });

      const totalSteps = words.length;
      let previousCount = 0;
      let topVisible = false;
      let bottomVisible = false;

      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${totalSteps * 110}`,
        pin: true,
        anticipatePin: 1,
        scrub: false,
        onUpdate: (self) => {
          const progress = self.progress;
          const activeCount = Math.floor(progress * totalSteps);

          if (activeCount !== previousCount) {
            gsap.set(
              words.slice(
                Math.min(previousCount, activeCount),
                Math.max(previousCount, activeCount),
              ),
              {
                opacity: activeCount > previousCount ? 1 : 0.08,
              },
            );
            previousCount = activeCount;
          }
          const nextTop = progress > 0.02;
          if (top && nextTop !== topVisible) {
            topVisible = nextTop;
            gsap.set(top, { opacity: nextTop ? 1 : 0, y: nextTop ? 0 : 16 });
          }
          const nextBottom = progress > 0.92;
          if (bottom && nextBottom !== bottomVisible) {
            bottomVisible = nextBottom;
            gsap.set(bottom, {
              opacity: nextBottom ? 1 : 0,
              y: nextBottom ? 0 : 14,
            });
          }
        },
      });
    }, section);

    return () => ctx.revert();
  }, [ref, introReady]);
}
