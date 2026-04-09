"use client";

import { RefObject, useLayoutEffect } from "react";
import { gsap } from "@/animations/gsap-config";

export function useWhoAmIReveal(ref: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const section = ref.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const sectionLabel = section.querySelector('[data-reveal="section-label"]');
      const divider = section.querySelector('[data-reveal="divider"]');

      const eyebrows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('[data-reveal="eyebrow"]')
      );

      const titles = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('[data-reveal="title"]')
      );

      const rows = gsap.utils.toArray<HTMLElement>(
        section.querySelectorAll('[data-reveal="row"]')
      );

      const sequence: HTMLElement[] = [
        ...(sectionLabel ? [sectionLabel as HTMLElement] : []),
        ...eyebrows,
        ...titles,
        ...rows,
      ];

      gsap.set(sequence, {
        opacity: 0,
        y: 18,
      });

      if (divider) {
        gsap.set(divider, {
          opacity: 0,
          scaleY: 0,
          y: 0,
          transformOrigin: "center top",
        });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=1400",
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      let step = 0;

      if (sectionLabel) {
        tl.to(
          sectionLabel,
          {
            opacity: 1,
            y: 0,
            ease: "none",
            duration: 0.35,
          },
          step
        );
        step += 0.45;
      }

      if (divider) {
        tl.to(
          divider,
          {
            opacity: 1,
            scaleY: 1,
            ease: "none",
            duration: 0.55,
          },
          step
        );
        step += 0.5;
      }

      eyebrows.forEach((item) => {
        tl.to(
          item,
          {
            opacity: 1,
            y: 0,
            ease: "none",
            duration: 0.35,
          },
          step
        );
        step += 0.28;
      });

      titles.forEach((item) => {
        tl.to(
          item,
          {
            opacity: 1,
            y: 0,
            ease: "none",
            duration: 0.5,
          },
          step
        );
        step += 0.4;
      });

      rows.forEach((item) => {
        tl.to(
          item,
          {
            opacity: 1,
            y: 0,
            ease: "none",
            duration: 0.3,
          },
          step
        );
        step += 0.16;
      });
    }, section);

    return () => ctx.revert();
  }, [ref]);
}