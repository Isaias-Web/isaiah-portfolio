"use client";

import { Component, useEffect, useState, type ComponentType, type ReactNode } from "react";

type Props = { onComplete: () => void };

class PreloaderBoundary extends Component<Props & { children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error) {
    console.error("Preloader failed; revealing the portfolio", error);
    this.props.onComplete();
  }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function IntroPreloader({ onComplete }: Props) {
  const [Preloader, setPreloader] = useState<ComponentType<Props> | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    // Bounded recovery for a stalled chunk, resource, or interrupted timeline.
    // This watchdog does not control the animation's normal timing.
    const watchdog = window.setTimeout(() => {
      console.error("Preloader timed out; revealing the portfolio");
      onComplete();
    }, 15000);

    const images = Array.from(document.querySelectorAll<HTMLImageElement>("main img"));
    const imagesReady = images.map((img) => new Promise<void>((resolve) => {
      if (img.complete) { resolve(); return; }
      const done = () => {
        img.removeEventListener("load", done);
        img.removeEventListener("error", done);
        signal.removeEventListener("abort", done);
        resolve();
      };
      img.addEventListener("load", done, { once: true });
      img.addEventListener("error", done, { once: true });
      signal.addEventListener("abort", done, { once: true });
    }));

    // Images already have CSS geometry. A slow resource must not block entry.
    let resourceTimeout: number;
    const resourceLimit = new Promise<void>((resolve) => {
      resourceTimeout = window.setTimeout(resolve, 4000);
      signal.addEventListener("abort", () => resolve(), { once: true });
    });
    const resources = Promise.race([
      Promise.all([document.fonts.ready, ...imagesReady]),
      resourceLimit,
    ]);

    Promise.all([import("@/components/Preloader"), resources])
      .then(([module]) => {
        if (!signal.aborted) setPreloader(() => module.default);
      })
      .catch((error: unknown) => {
        if (!signal.aborted) {
          console.error("Preloader could not load; revealing the portfolio", error);
          onComplete();
        }
      });

    return () => {
      controller.abort();
      window.clearTimeout(watchdog);
      window.clearTimeout(resourceTimeout);
    };
  }, [onComplete]);

  return (
    <div data-intro-layer>
      <PreloaderBoundary onComplete={onComplete}>
        {Preloader ? <Preloader onComplete={onComplete} /> : (
          <div className="fixed inset-0 z-[9999] bg-[#090a09]" />
        )}
      </PreloaderBoundary>
    </div>
  );
}
