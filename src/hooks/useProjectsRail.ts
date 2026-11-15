"use client";

import { useSmoothScrollControl } from "@/components/SmoothScrollContext";

import { RefObject, useLayoutEffect, useState, useSyncExternalStore } from "react";
import { gsap } from "@/animations/gsap-config";

// GSAP owns the tween's lifecycle. React subscribes to its current handle;
// publishing/reverting that external resource must not copy it into state
// from a layout effect. Each mounted rail gets its own store.
function createRailStore() {
  let tween: gsap.core.Tween | null = null;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => tween,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    publish: (next: gsap.core.Tween | null) => {
      if (tween === next) return;
      tween = next;
      for (const listener of listeners) listener();
    },
  };
}

const getServerSnapshot = () => null;

export function useProjectsRail(
  sectionRef: RefObject<HTMLElement | null>,
  trackRef: RefObject<HTMLDivElement | null>
) {
  const [store] = useState(createRailStore);
  const railTween = useSyncExternalStore(
    store.subscribe, store.getSnapshot, getServerSnapshot
  );

  const { introReady } = useSmoothScrollControl();

  useLayoutEffect(() => {
    if (!introReady) return;
    const section = sectionRef.current;
    const track = trackRef.current;

    if (!section || !track) {
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

      store.publish(horizontalTween);
    }, section);

    return () => {
      store.publish(null);
      ctx.revert();
    };
  }, [sectionRef, trackRef, introReady, store]);

  return railTween;
}
