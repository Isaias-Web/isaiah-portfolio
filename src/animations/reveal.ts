"use client";

import { gsap } from "./gsap-config";

type RevealOptions = {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
};

export function revealUp(
  elements: gsap.TweenTarget,
  options: RevealOptions = {}
) {
  const { y = 40, duration = 1, delay = 0, stagger = 0 } = options;

  return gsap.fromTo(
    elements,
    {
      opacity: 0,
      y,
    },
    {
      opacity: 1,
      y: 0,
      duration,
      delay,
      stagger,
      ease: "power3.out",
    }
  );
}