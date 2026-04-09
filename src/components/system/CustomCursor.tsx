"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });

  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest(
        'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="zoom"]'
      );

      setIsPointer(Boolean(clickable));
    };

    const handleMouseLeave = () => setIsVisible(false);
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

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      cancelAnimationFrame(animationFrame);
    };
  }, [isVisible]);

  return (
    <>
      <div
        ref={cursorRef}
        className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full border border-white/85 mix-blend-difference transition-[width,height,opacity,background-color,border-color] duration-300 ease-out md:block ${
          isVisible ? "opacity-100" : "opacity-0"
        } ${isPointer ? "h-16 w-16" : "h-10 w-10"}`}
      />

      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[10000] hidden rounded-full bg-white mix-blend-difference transition-[opacity,transform] duration-200 ease-out md:block ${
          isVisible && !isPointer ? "opacity-100 h-1.5 w-1.5" : "opacity-0 h-1.5 w-1.5"
        }`}
      />
    </>
  );
}