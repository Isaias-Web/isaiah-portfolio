"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "@/animations/gsap-config";
import { letterOffsets } from "@/animations/letter-motion";
import { useSmoothScrollControl } from "@/components/SmoothScrollContext";

export function useRightNowReveal(ref: RefObject<HTMLElement | null>) {
  const { introReady } = useSmoothScrollControl();

  useLayoutEffect(() => {
    const section = ref.current;
    if (!introReady || !section) return;

    const ctx = gsap.context(() => {}, section);
    const media = gsap.matchMedia();
    const hoverCleanups = new Set<() => void>();
    const targets = section.querySelectorAll<HTMLElement>(
      "[data-right-now-reveal], [data-right-now-letter]",
    );
    const originalStyles = Array.from(targets, (target) => [
      target, target.getAttribute("style"),
    ] as const);
    let failed = false;

    const restoreStyles = () => {
      for (const [target, style] of originalStyles) {
        if (style === null) target.removeAttribute("style");
        else target.setAttribute("style", style);
      }
    };
    // No CSS/SSR hiding. A setup or subsequent runtime error leaves readable
    // content, even if the animation library cannot finish its own cleanup.
    const failOpen = () => {
      if (failed) return;
      failed = true;
      try {
        hoverCleanups.forEach((cleanup) => cleanup());
        media.revert();
        ctx.revert();
      } finally {
        restoreStyles();
      }
    };

    window.addEventListener("error", failOpen);
    window.addEventListener("unhandledrejection", failOpen);

    try {
      // Inline blocks lose the original word's font kerning. Restore those
      // advances in em so responsive font sizes keep the approved spacing.
      const measure = document.createElement("canvas").getContext("2d");
      if (measure) {
        section.querySelectorAll<HTMLElement>("#experience-heading > span").forEach((line) => {
          const style = getComputedStyle(line);
          measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
          measure.fontKerning = style.fontKerning === "none" ? "none" : "normal";
          const text = line.textContent || "";
          line.querySelectorAll<HTMLElement>("[data-right-now-reveal='letter']").forEach((letter, index) => {
            if (!index) return;
            const kerning = measure.measureText(text.slice(0, index + 1)).width
              - measure.measureText(text.slice(0, index)).width
              - measure.measureText(text[index]).width;
            letter.style.marginInlineStart = `${kerning / parseFloat(style.fontSize)}em`;
          });
        });
      }
      ctx.add(() => {
        media.add("(prefers-reduced-motion: no-preference)", () => {
          if (failed) return;
          const label = section.querySelector('[data-right-now-reveal="label"]');
          const letters = section.querySelectorAll('[data-right-now-reveal="letter"]');
          const title = gsap.timeline({
            defaults: { ease: "power3.out", duration: 0.55 },
            scrollTrigger: {
              id: "right-now-title",
              trigger: label,
              start: "top 92%",
              toggleActions: "play none none none",
              once: true,
            },
          });
          // Deferring the from-state until playback keeps unvisited content
          // visible if ScrollTrigger never runs. Layout is never changed.
          title
            .fromTo(label, { opacity: 0, y: 18 }, {
              opacity: 1, y: 0, immediateRender: false,
            })
            .fromTo(letters, { opacity: 0, y: 18 }, {
              opacity: 1, y: 0, duration: 0.65, stagger: 0.035,
              immediateRender: false,
            }, 0.18);

          const hover = gsap.matchMedia();
          hover.add("(hover: hover) and (pointer: fine)", (hoverContext) => {
            const cleanups: Array<() => void> = [];
            section.querySelectorAll<HTMLElement>("[data-right-now-letter]").forEach((letter, index) => {
              const offset = letterOffsets[index % letterOffsets.length];
              const animate = (returning: boolean) => {
                if (failed) return;
                try {
                  hoverContext.add(() => {
                    gsap.to(letter, {
                      ...(returning ? { x: 0, y: 0, rotation: 0 } : offset),
                      duration: returning ? 0.45 : 0.28,
                      ease: returning ? "power3.out" : "power2.out",
                      overwrite: "auto",
                    });
                  });
                } catch (error) {
                  failOpen();
                  console.error("RightNow motion recovered:", error);
                }
              };
              const enter = () => animate(false);
              const leave = () => animate(true);
              letter.addEventListener("mouseenter", enter);
              letter.addEventListener("mouseleave", leave);
              const cleanup = () => {
                letter.removeEventListener("mouseenter", enter);
                letter.removeEventListener("mouseleave", leave);
                hoverCleanups.delete(cleanup);
              };
              hoverCleanups.add(cleanup);
              cleanups.push(cleanup);
            });
            return () => cleanups.forEach((cleanup) => cleanup());
          });
          return () => hover.revert();
        });
      });
    } catch (error) {
      failOpen();
      console.error("RightNow motion recovered:", error);
    }

    return () => {
      window.removeEventListener("error", failOpen);
      window.removeEventListener("unhandledrejection", failOpen);
      hoverCleanups.forEach((cleanup) => cleanup());
      media.revert();
      ctx.revert();
      restoreStyles();
    };
  }, [introReady, ref]);
}
