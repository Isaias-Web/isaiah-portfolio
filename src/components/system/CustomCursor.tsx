"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const [isPointer, setIsPointer] = useState(false);
  const [isActionable, setIsActionable] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const moveCursor = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      setIsVisible(true);

      const target = e.target instanceof Element ? e.target : null;
      if (!target) {
        setIsPointer(false);
        setIsActionable(false);
        return;
      }

      const clickable = target.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="zoom"]'
      );

      setIsPointer(Boolean(clickable));

      // Only show the hint on actual actions, not editable form fields.
      const actionable = target.closest(
        'a[href], button:not(:disabled), [role="button"]:not([aria-disabled="true"]), summary, input[type="submit"]:not(:disabled), input[type="button"]:not(:disabled), [data-cursor="zoom"]'
      );
      setIsActionable(Boolean(actionable));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsActionable(false);
    };
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    let animationFrame = 0;

    const render = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.18;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.18;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0) translate(-50%, -50%)`;
      }

      if (hintRef.current) {
        const x = Math.max(12, Math.min(pos.current.x + 25, window.innerWidth - 212));
        const y = Math.max(12, Math.min(pos.current.y + 24, window.innerHeight - 48));
        hintRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        data-custom-cursor
        className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full border border-white/85 mix-blend-difference transition-[width,height,opacity,background-color,border-color] duration-300 ease-out md:block ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isPointer ? "h-16 w-16" : "h-10 w-10"}`}
      />

      <div
        ref={hintRef}
        data-custom-cursor
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 top-0 z-[10001] hidden h-[36px] w-[200px] items-center gap-2 border border-[#ff2d00]/50 bg-[#111310]/95 px-3 font-mono text-[9px] uppercase tracking-[0.13em] text-[#f3efe8] shadow-[0_10px_35px_rgba(0,0,0,0.4)] backdrop-blur-sm transition-opacity duration-200 ease-out motion-reduce:transition-none md:flex ${
          isVisible && isActionable ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff2d00]" />
        CLICK PARA INTERACTUAR
      </div>

      <div
        ref={dotRef}
        data-custom-cursor
        className={`pointer-events-none fixed left-0 top-0 z-[10000] hidden rounded-full bg-white mix-blend-difference transition-[opacity,transform] duration-200 ease-out md:block ${
          isVisible && !isPointer ? "opacity-100 h-1.5 w-1.5" : "opacity-0 h-1.5 w-1.5"
        }`}
      />
    </>
  );
}
