"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/animations/gsap-config";
import { revealUp } from "@/animations/reveal";

export function useReveal(ref: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!ref.current) return;

    const ctx = gsap.context(() => {
      revealUp(ref.current, { y: 50, duration: 1 });

      ScrollTrigger.create({
        trigger: ref.current,
        start: "top 85%",
      });
    }, ref);

    return () => ctx.revert();
  }, [ref]);
}