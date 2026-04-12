"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations/gsap-config";
import ProjectDetailShell from "@/components/projects/overlay/ProjectDetailShell";
import TradeMateCaseStudy from "@/components/projects/case-studies/TradeMateCaseStudy";
import TryfumCaseStudy from "@/components/projects/case-studies/TryfumCaseStudy";
import OndaCaseStudy from "@/components/projects/case-studies/OndaCaseStudy";
import SectraVisionCaseStudy from "@/components/projects/case-studies/SectraVisionCaseStudy";
import VapeMateCaseStudy from "@/components/projects/case-studies/VapeMateCaseStudy";
import HookahGtCaseStudy from "@/components/projects/case-studies/HookahGtCaseStudy";
import HookahPartnerCaseStudy from "@/components/projects/case-studies/HookahPartnerCaseStudy";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { useSmoothScrollControl } from "@/components/SmoothScrollContext";
import type { CaseStudySlug } from "@/data/caseStudies";

export type ProjectKey = "trademate" | "tryfum" | "onda" | "sectravision" | "vapemate" | "hookahgt" | "hookahpartner" | null;

type ProjectOverlayHostProps = {
  activeProject: ProjectKey;
  onClose: () => void;
  onNavigate: (slug: CaseStudySlug) => void;
};

export default function ProjectOverlayHost({
  activeProject,
  onClose,
  onNavigate,
}: ProjectOverlayHostProps) {
  const isOpen = activeProject !== null;
  const { pauseScroll, resumeScroll } = useSmoothScrollControl();

  const shellScrollRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const isTransitioningRef = useRef(false);

  const [displayedProject, setDisplayedProject] =
    useState<ProjectKey>(activeProject);
  const [pendingFadeIn, setPendingFadeIn] = useState(false);

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      pauseScroll();
    } else {
      resumeScroll();
    }

    return () => {
      resumeScroll();
    };
  }, [isOpen, pauseScroll, resumeScroll]);

  useEffect(() => {
    if (activeProject && displayedProject === null) {
      setDisplayedProject(activeProject);
      setPendingFadeIn(true);
    }
  }, [activeProject, displayedProject]);

  useEffect(() => {
    const el = contentRef.current;

    if (!el) return;
    if (!activeProject) return;
    if (!displayedProject) return;
    if (activeProject === displayedProject) return;
    if (isTransitioningRef.current) return;

    isTransitioningRef.current = true;

    const tween = gsap.to(el, {
      autoAlpha: 0,
      duration: 0.22,
      ease: "power2.out",
      onComplete: () => {
        setDisplayedProject(activeProject);
        setPendingFadeIn(true);
      },
    });

    return () => {
      tween.kill();
    };
  }, [activeProject, displayedProject]);

  useEffect(() => {
    const el = contentRef.current;
    const scroller = shellScrollRef.current;

    if (!el) return;
    if (!displayedProject) return;
    if (!pendingFadeIn) return;

    gsap.set(el, { autoAlpha: 0 });

    requestAnimationFrame(() => {
      if (scroller) {
        scroller.scrollTop = 0;
      }

      requestAnimationFrame(() => {
        if (scroller) {
          scroller.scrollTop = 0;
        }

        const tween = gsap.to(el, {
          autoAlpha: 1,
          duration: 0.28,
          ease: "power2.out",
          onComplete: () => {
            setPendingFadeIn(false);
            isTransitioningRef.current = false;
          },
        });

        return () => {
          tween.kill();
        };
      });
    });
  }, [displayedProject, pendingFadeIn]);

  const handleNavigate = (slug: CaseStudySlug) => {
    if (isTransitioningRef.current) return;
    onNavigate(slug);
  };

  if (!isOpen) return null;

  return (
    <ProjectDetailShell onClose={onClose} scrollRef={shellScrollRef}>
      <div ref={contentRef}>

        {displayedProject === "trademate" && (
          <TradeMateCaseStudy onNavigate={handleNavigate} />
        )}

        {displayedProject === "tryfum" && (
          <TryfumCaseStudy onNavigate={handleNavigate} />
        )}

        {displayedProject === "onda" && (
          <OndaCaseStudy onNavigate={handleNavigate} />
        )}

        {displayedProject === "sectravision" && (
          <SectraVisionCaseStudy onNavigate={handleNavigate} />
        )}

        {displayedProject === "vapemate" && (
          <VapeMateCaseStudy onNavigate={handleNavigate} />
        )}

        {displayedProject === "hookahgt" && (
          <HookahGtCaseStudy onNavigate={handleNavigate} />
        )}

        {displayedProject === "hookahpartner" && (
          <HookahPartnerCaseStudy onNavigate={handleNavigate} />
        )}

      </div>
    </ProjectDetailShell>
  );
}