"use client";

import { useSmoothScrollControl } from "@/components/SmoothScrollContext";

import { RefObject, useLayoutEffect, useState } from "react";
import { gsap } from "@/animations/gsap-config";

export function useProjectsRail(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLDivElement | null>
) {
  const [railTween, setRailTween] = useState<gsap.core.Tween | null>(null);

  const { introReady } = useSmoothScrollControl();

  useLayoutEffect(() => {
    if (!introReady) return;
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
      setRailTween(null);
      return;
    }

    let horizontalTween: gsap.core.Tween | null = null;

    const ctx = gsap.context(() => {
      const getMaxX = () => Math.max(track.scrollWidth - window.innerWidth, 0);

      gsap.set(track, { x: 0 });

      horizontalTween = gsap.to(track, {
        x: () => -getMaxX(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getMaxX()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      setRailTween(horizontalTween);
    }, section);

    return () => {
      setRailTween(null);
      ctx.revert();
    };
  }, [sectionRef, trackRef, introReady]);

  return railTween;
}