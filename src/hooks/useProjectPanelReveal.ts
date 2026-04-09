"use client";

import { RefObject, useLayoutEffect } from "react";
import { gsap } from "@/animations/gsap-config";

export function useProjectPanelReveal(
  panelRef: RefObject<HTMLElement | null>,
  containerAnimation?: gsap.core.Tween | null
) {
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel || !containerAnimation) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(
        panel.querySelectorAll("[data-reveal]")
      );

      if (!items.length) return;

      gsap.set(items, {
        y: 36,
        opacity: 0,
      });

      items.forEach((item, index) => {
        gsap.to(item, {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power3.out",
          delay: index * 0.05,
          scrollTrigger: {
            trigger: panel,
            containerAnimation,
            start: "left 75%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, panel);

    return () => ctx.revert();
  }, [panelRef, containerAnimation]);
}