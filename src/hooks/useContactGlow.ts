"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "@/animations/gsap-config";
import { useSmoothScrollControl } from "@/components/SmoothScrollContext";

export function useContactGlow(
  sectionRef: RefObject<HTMLElement | null>,
  glowRef: RefObject<HTMLDivElement | null>,
) {
  const { introReady } = useSmoothScrollControl();

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const glow = glowRef.current;
    if (!introReady || !section || !glow) return;

    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add(
        "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
        (context) => {
          try {
            gsap.set(glow, { xPercent: -50, yPercent: -50 });
            // Three reusable tweens; pointer events never set React state or
            // allocate new animations. The gradient itself is painted once.
            const xTo = gsap.quickTo(glow, "x", {
              duration: 0.65,
              ease: "power3.out",
            });
            const yTo = gsap.quickTo(glow, "y", {
              duration: 0.65,
              ease: "power3.out",
            });
            const opacityTo = gsap.quickTo(glow, "opacity", {
              duration: 0.55,
              ease: "power2.out",
            });
            let active = false;
            let clientX = 0;
            let clientY = 0;

            const stopTracking = () => {
              window.removeEventListener("scroll", update);
              window.removeEventListener("resize", update);
              window.removeEventListener("blur", hide);
            };
            const hide = () => {
              if (!active) return;
              active = false;
              stopTracking();
              opacityTo(0);
            };
            const update = () => {
              if (!active) return;
              const bounds = section.getBoundingClientRect();
              if (
                clientX < bounds.left ||
                clientX > bounds.right ||
                clientY < bounds.top ||
                clientY > bounds.bottom
              ) {
                hide();
                return;
              }
              xTo(clientX - bounds.left);
              yTo(clientY - bounds.top);
            };
            const show = (event: PointerEvent) => {
              if (event.pointerType !== "mouse") {
                hide();
                return;
              }
              clientX = event.clientX;
              clientY = event.clientY;
              if (!active) {
                const bounds = section.getBoundingClientRect();
                // Reposition while invisible; a quick reentry during fade-out
                // keeps interpolating from the existing light position.
                if (Number(gsap.getProperty(glow, "opacity")) < 0.01) {
                  xTo(clientX - bounds.left, clientX - bounds.left);
                  yTo(clientY - bounds.top, clientY - bounds.top);
                }
                active = true;
                window.addEventListener("scroll", update, { passive: true });
                window.addEventListener("resize", update);
                window.addEventListener("blur", hide);
                opacityTo(1);
              }
              update();
            };

            section.addEventListener("pointerenter", show);
            section.addEventListener("pointermove", show);
            section.addEventListener("pointerleave", hide);
            section.addEventListener("pointercancel", hide);
            return () => {
              active = false;
              stopTracking();
              section.removeEventListener("pointerenter", show);
              section.removeEventListener("pointermove", show);
              section.removeEventListener("pointerleave", hide);
              section.removeEventListener("pointercancel", hide);
            };
          } catch (error) {
            context.revert();
            console.warn("Contact glow unavailable:", error);
          }
        },
      );
    }, section);

    return () => {
      media.revert();
      ctx.revert();
    };
  }, [introReady, sectionRef, glowRef]);
}
