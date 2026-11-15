"use client";

import type { FocusEvent, RefObject } from "react";
import type { gsap } from "@/animations/gsap-config";

type Props = {
  name: string;
  panelRef: RefObject<HTMLElement | null>;
  railTween?: gsap.core.Tween | null;
  onOpen?: () => void;
};

export default function ProjectOpenButton({
  name,
  panelRef,
  railTween,
  onOpen,
}: Props) {
  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => {
    // Keyboard focus should reveal its panel without changing pointer scrolling.
    if (
      !event.currentTarget.matches(":focus-visible") ||
      event.currentTarget.hasAttribute("data-focus-return")
    )
      return;
    const panel = panelRef.current;
    const track = panel?.closest<HTMLElement>("[data-projects-track]");
    const trigger = railTween?.scrollTrigger;
    if (!panel || !track || !trigger) return;
    const panels = Array.from(track.children);
    const index = panels.findIndex((wrapper) => wrapper.contains(panel));
    if (index < 0 || panels.length < 2) return;
    if (track.parentElement) track.parentElement.scrollLeft = 0;
    trigger.scroll(
      trigger.start +
        ((trigger.end - trigger.start) * index) / (panels.length - 1),
    );
  };

  return (
    <button
      type="button"
      data-project-open
      aria-label={`Ver caso de estudio: ${name}`}
      aria-haspopup="dialog"
      onFocus={handleFocus}
      onClick={onOpen}
      className="absolute inset-0 z-30 h-full w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ff2d00]"
    >
      <span className="sr-only">Ver caso de estudio: {name}</span>
    </button>
  );
}
