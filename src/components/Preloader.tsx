"use client";

import { useEffect, useRef, useState } from "react";
import { usePreloader } from "@/hooks/usePreloader";

type PreloaderProps = {
  onComplete?: () => void;
};

function buildWavePath(
  width: number,
  height: number,
  amplitude = 14,
  wavelength = 180
) {
  const centerY = height / 2;
  const step = 4;

  let d = `M0 ${centerY}`;

  for (let x = 0; x <= width; x += step) {
    const y =
      centerY + Math.sin((x / wavelength) * Math.PI * 2) * amplitude;
    d += ` L${x} ${y}`;
  }

  return d;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const waveWrapRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const [progress, setProgress] = useState(0);
  const [svgWidth, setSvgWidth] = useState(1440);
  const svgHeight = 60;

  useEffect(() => {
    const el = waveWrapRef.current;
    if (!el) return;

    const update = () => {
      setSvgWidth(el.clientWidth || 1440);
    };

    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  usePreloader({
    rootRef,
    wavePathRef,
    lineRef,
    setProgress,
    onComplete,
    svgWidth,
  });

  const padded = String(progress).padStart(3, "0");
  const wavePath = buildWavePath(svgWidth, svgHeight, 14, 180);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#090a09] text-white"
    >

      <div
        ref={waveWrapRef}
        className="pointer-events-none absolute left-0 top-[46%] w-full -translate-y-1/2 opacity-20"
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="block h-[60px] w-full md:h-[72px]"
          preserveAspectRatio="none"
        >
          <path
            ref={wavePathRef}
            d={wavePath}
            fill="none"
            stroke="#ff2d00"
            strokeWidth="1.5"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>

      <div className="relative flex h-full flex-col justify-between px-6 py-8 md:px-10 lg:px-14">
        <div className="flex-1" />

        <div className="relative z-10 w-full">
          <div className="max-w-[980px]">
            <div className="font-black uppercase leading-snug tracking-[0em] text-[#f1ede6] text-[20vw] sm:text-[16vw] md:text-[12vw] lg:text-[10rem]">
              {padded}
            </div>
          </div>

          <div className="mt-6 h-px w-full overflow-hidden">
            <div
              ref={lineRef}
              className="h-full w-full origin-left scale-x-0 bg-[#ff2d00]"
            />
          </div>

          <div className="max-w-[980px]">
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-[#ff2d00] md:text-[11px]">
              isaiasfrutos.dev / Entrando a sitio web
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
