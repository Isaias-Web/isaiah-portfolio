"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import IntroPreloader from "@/components/IntroPreloader";
import { useSmoothScrollControl } from "@/components/SmoothScrollContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { ScrollTrigger } from "@/animations/gsap-config";

import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import WhoAmI from "@/sections/WhoAmI";
import RightNow from "@/sections/RightNow";
import ProjectsRail from "@/sections/ProjectsRail";
import OpenChannel from "@/sections/OpenChannel";

export default function Page() {
  const { introReady, completeIntro } = useSmoothScrollControl();
  const mainRef = useRef<HTMLElement>(null);
  useBodyScrollLock(!introReady);

  useLayoutEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    main.inert = !introReady;
    // Preserve the empty background beneath the preloader's upward exit.
    // Only hydration applies this; SSR and the no-JS page remain visible.
    main.style.visibility = introReady ? "" : "hidden";
    return () => {
      main.inert = false;
      main.style.visibility = "";
    };
  }, [introReady]);

  useEffect(() => {
    if (!introReady) return;
    // Layout effects create pins in document order; the rail's synchronous
    // layout update then supplies its tween to the panel reveal effects.
    // Refresh after that commit, rather than relying on parent effect order.
    let firstFrame = 0;
    let secondFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      firstFrame = requestAnimationFrame(() => {
        secondFrame = requestAnimationFrame(() => {
          ScrollTrigger.sort();
          ScrollTrigger.refresh();
        });
      });
    };
    refresh();
    // Also cover resources that finish after the bounded preparation window.
    const main = mainRef.current;
    main?.addEventListener("load", refresh, true);
    document.fonts.addEventListener("loadingdone", refresh);
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
      main?.removeEventListener("load", refresh, true);
      document.fonts.removeEventListener("loadingdone", refresh);
    };
  }, [introReady]);

  return (
    <>
      <noscript>
        <style>{`
          [data-intro-layer], [data-project-open] { display: none !important; }
          html, body, a, button { cursor: auto !important; }
          .manifesto-word { opacity: 1 !important; }
          [data-projects-rail], [data-projects-track], [data-projects-track] > div {
            height: auto !important; overflow: visible !important;
          }
          [data-projects-track] { display: block !important; width: 100% !important; }
        `}</style>
      </noscript>
      {!introReady && <IntroPreloader onComplete={completeIntro} />}
      <main ref={mainRef}>
        <Hero />
        <Manifesto />
        <WhoAmI />
        <ProjectsRail />
        <RightNow />
        <OpenChannel />
      </main>
    </>
  );
}
