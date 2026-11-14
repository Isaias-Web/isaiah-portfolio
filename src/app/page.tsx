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
    return () => { main.inert = false; };
  }, [introReady]);

  useEffect(() => {
    if (!introReady) return;
    // Layout effects create pins in document order; the rail's synchronous
    // layout update then supplies its tween to the panel reveal effects.
    // Refresh after that commit, rather than relying on parent effect order.
    let secondFrame = 0;
    const firstFrame = requestAnimationFrame(() => {
      secondFrame = requestAnimationFrame(() => {
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      });
    });
    return () => {
      cancelAnimationFrame(firstFrame);
      cancelAnimationFrame(secondFrame);
    };
  }, [introReady]);

  return (
    <>
      <noscript>
        <style>{`
          [data-intro-layer] { display: none !important; }
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
