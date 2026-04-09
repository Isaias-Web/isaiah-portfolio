"use client";

import { RefObject, useEffect } from "react";
import { gsap } from "@/animations/gsap-config";

type UsePreloaderParams = {
  rootRef: RefObject<HTMLDivElement | null>;
  wavePathRef: RefObject<SVGPathElement | null>;
  lineRef: RefObject<HTMLDivElement | null>;
  setProgress: (value: number) => void;
  onComplete?: () => void;
  deps?: unknown[];
};

export function usePreloader({
  rootRef,
  wavePathRef,
  lineRef,
  setProgress,
  onComplete,
  deps = [],
}: UsePreloaderParams) {
  useEffect(() => {
    const root = rootRef.current;
    const wavePath = wavePathRef.current;
    const line = lineRef.current;

    if (!root || !wavePath || !line) return;

    const pathLength = wavePath.getTotalLength();

    wavePath.style.strokeDasharray = `${pathLength}`;
    wavePath.style.strokeDashoffset = `${pathLength}`;

    gsap.set(line, {
      scaleX: 0,
      transformOrigin: "left center",
    });

    const counter = { value: 0 };

    const tl = gsap.timeline({
      defaults: {
        ease: "power3.out",
      },
      onComplete: () => {
        onComplete?.();
      },
    });

    tl.to(counter, {
      value: 100,
      duration: 2.2,
      ease: "power2.out",
      onUpdate: () => {
        setProgress(Math.round(counter.value));
      },
    });

    tl.to(
      wavePath,
      {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: "power2.out",
      },
      0
    );

    tl.to(
      line,
      {
        scaleX: 1,
        duration: 2.2,
        ease: "power2.out",
      },
      0
    );

    tl.to({}, { duration: 0.25 });

    tl.to(root, {
      yPercent: -100,
      duration: 1.1,
      ease: "power4.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [rootRef, wavePathRef, lineRef, setProgress, onComplete, ...deps]);
}