"use client";

import { ReactNode, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap-config";

type ProjectDetailShellProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
  scrollRef?: React.MutableRefObject<HTMLDivElement | null>;
};

export default function ProjectDetailShell({
  title,
  onClose,
  children,
  scrollRef,
}: ProjectDetailShellProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const previous = document.activeElement;
    root.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    const trapTab = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const targets = Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')).filter((node) => node.getClientRects().length && getComputedStyle(node).visibility !== "hidden");
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (!first) { event.preventDefault(); root.focus(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === root)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && (document.activeElement === last || document.activeElement === root)) { event.preventDefault(); first.focus(); }
    };
    root.addEventListener("keydown", trapTab);
    return () => {
      root.removeEventListener("keydown", trapTab);
      if (previous instanceof HTMLElement && previous.isConnected) {
        previous.setAttribute("data-focus-return", "");
        previous.focus({ preventScroll: true });
        previous.removeAttribute("data-focus-return");
      }
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    // A case change removes its navigation button. Keep focus in the dialog.
    if (root && !root.contains(document.activeElement)) root.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
  }, [children]);

  const handleRequestClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);

    const tl = timelineRef.current;
    if (!tl) {
      onClose();
      return;
    }

    tl.eventCallback("onReverseComplete", () => {
      onClose();
    });

    tl.reverse();
  }, [isClosing, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") handleRequestClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRequestClose]);

  useEffect(() => {
    if (!scrollRef) return;

    scrollRef.current = internalScrollRef.current;

    return () => {
      scrollRef.current = null;
    };
  }, [scrollRef]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    const content = contentRef.current;

    if (!root || !backdrop || !panel || !content) return;

    const ctx = gsap.context(() => {
      gsap.set(backdrop, { opacity: 0 });
      gsap.set(panel, { yPercent: 100 });
      gsap.set(content, { opacity: 0, y: 32 });

      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.out",
        },
      });

      tl.to(backdrop, {
        opacity: 1,
        duration: 0.28,
      })
        .to(
          panel,
          {
            yPercent: 0,
            duration: 0.9,
            ease: "power4.out",
          },
          0
        )
        .to(
          content,
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: "power3.out",
          },
          0.22
        );

      timelineRef.current = tl;
      tl.play();
    }, root);

    return () => {
      timelineRef.current = null;
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} id="project-dialog" role="dialog" aria-modal="true" aria-label={`Caso de estudio: ${title}`} tabIndex={-1} className="fixed inset-0 z-[999] text-white">
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"
        onClick={handleRequestClose}
      />

      <div ref={panelRef} className="absolute inset-0 bg-[#050505]">
        <div className="flex h-[100dvh] flex-col">
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5 md:px-10 lg:px-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00] md:text-[11px]">
              isaiasfrutos.dev
            </p>

            <button
              type="button"
              onClick={handleRequestClose}
              className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/65 transition hover:text-white md:text-[11px]"
            >
              Cerrar
            </button>
          </div>

          <div
            ref={internalScrollRef}
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
            data-lenis-prevent
          >
            <div ref={contentRef} className="min-h-full">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
