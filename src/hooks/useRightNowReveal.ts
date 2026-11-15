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
    const originalStyles = Array.from(
      targets,
      (target) => [target, target.getAttribute("style")] as const,
    );
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
      } catch (error) {
        console.error("RightNow motion cleanup recovered:", error);
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
        section
          .querySelectorAll<HTMLElement>("#experience-heading > span")
          .forEach((line) => {
            const style = getComputedStyle(line);
            measure.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
            measure.fontKerning =
              style.fontKerning === "none" ? "none" : "normal";
            const text = line.textContent || "";
            line
              .querySelectorAll<HTMLElement>("[data-right-now-reveal='letter']")
              .forEach((letter, index) => {
                if (!index) return;
                const kerning =
                  measure.measureText(text.slice(0, index + 1)).width -
                  measure.measureText(text.slice(0, index)).width -
                  measure.measureText(text[index]).width;
                letter.style.marginInlineStart = `${kerning / parseFloat(style.fontSize)}em`;
              });
          });
      }
      ctx.add(() => {
        media.add("(prefers-reduced-motion: no-preference)", () => {
          if (failed) return;
          try {
            const targetsFor = (...names: string[]) =>
              section.querySelectorAll(
                names
                  .map((name) => `[data-right-now-reveal="${name}"]`)
                  .join(","),
              );
            const sequence = (
              id: string,
              trigger: Element,
              targets: gsap.TweenTarget = trigger,
            ) =>
              gsap
                .timeline({
                  defaults: { ease: "power3.out", duration: 0.55 },
                  scrollTrigger: {
                    id: `right-now-${id}`,
                    trigger,
                    start: "top 92%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                })
                .set(targets, { opacity: 0, y: 18, immediateRender: false }, 0);
            const label = targetsFor("label")[0];
            const letters = targetsFor("letter");
            if (!label || !letters.length) return;
            const title = sequence("title", label, [label, ...letters]);
            // Only a playing timeline primes its group, before the stagger.
            // Unvisited content stays visible if ScrollTrigger never runs.
            title
              .fromTo(
                label,
                { opacity: 0, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  immediateRender: false,
                },
              )
              .fromTo(
                letters,
                { opacity: 0, y: 18 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.65,
                  stagger: 0.035,
                  immediateRender: false,
                },
                0.18,
              );

            const reveal = (
              timeline: gsap.core.Timeline,
              selector: string,
              position: number,
              stagger = 0,
            ) =>
              timeline.fromTo(
                targetsFor(selector),
                { opacity: 0, y: 18 },
                { opacity: 1, y: 0, immediateRender: false, stagger },
                position,
              );

            const uicLabel = section.querySelector(
              '[data-right-now-reveal="uic-label"]',
            );
            if (uicLabel) {
              const uic = sequence(
                "uic",
                uicLabel,
                targetsFor("uic-label", "uic-title", "uic-meta", "uic-date"),
              );
              reveal(uic, "uic-label", 0);
              reveal(uic, "uic-title", 0.16);
              reveal(uic, "uic-meta", 0.4, 0.08);
              reveal(uic, "uic-date", 0.66);
            }
            const aiLabel = section.querySelector(
              '[data-right-now-reveal="ai-label"]',
            );
            if (aiLabel) {
              const ai = sequence(
                "engineering",
                aiLabel,
                targetsFor("ai-label", "ai-line", "ai-intro"),
              );
              reveal(ai, "ai-label", 0);
              reveal(ai, "ai-line", 0.16, 0.1);
              reveal(ai, "ai-intro", 0.5);
            }

            // Long mobile columns enter when each item actually approaches the
            // viewport; they must not finish offscreen with their desktop sibling.
            for (const group of [
              "uic-intro",
              "responsibility",
              "step",
              "automation",
            ]) {
              section
                .querySelectorAll(`[data-right-now-reveal="${group}"]`)
                .forEach((item, index) => {
                  sequence(`${group}-${index}`, item).fromTo(
                    item,
                    { opacity: 0, y: 18 },
                    {
                      opacity: 1,
                      y: 0,
                      immediateRender: false,
                      delay: index * 0.07,
                    },
                  );
                });
            }

            const hover = gsap.matchMedia();
            hover.add("(hover: hover) and (pointer: fine)", (hoverContext) => {
              const cleanups: Array<() => void> = [];
              section
                .querySelectorAll<HTMLElement>("[data-right-now-letter]")
                .forEach((letter, index) => {
                  const offset = letterOffsets[index % letterOffsets.length];
                  const animate = (returning: boolean) => {
                    if (failed) return;
                    hoverContext.add(() => {
                      try {
                        gsap.to(letter, {
                          ...(returning ? { x: 0, y: 0, rotation: 0 } : offset),
                          duration: returning ? 0.45 : 0.28,
                          ease: returning ? "power3.out" : "power2.out",
                          overwrite: "auto",
                        });
                      } catch (error) {
                        failOpen();
                        console.error("RightNow motion recovered:", error);
                      }
                    });
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
          } catch (error) {
            // Catch inside GSAP's callback so its active context is restored.
            failOpen();
            console.error("RightNow motion recovered:", error);
          }
        });
      });
    } catch (error) {
      failOpen();
      console.error("RightNow motion recovered:", error);
    }

    return () => {
      window.removeEventListener("error", failOpen);
      window.removeEventListener("unhandledrejection", failOpen);
      failOpen();
    };
  }, [introReady, ref]);
}
