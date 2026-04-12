"use client";

import { useRef, useState } from "react";
import ProjectPanelTradeMate from "@/components/projects/panels/ProjectPanelTradeMate";
import ProjectPanelTryFum from "@/components/projects/panels/ProjectPanelTryFum";
import ProjectPanelOnda from "@/components/projects/panels/ProjectPanelOnda";
import ProjectPanelSectraVision from "@/components/projects/panels/ProjectPanelSectraVision";
import ProjectPanelVapeMate from "@/components/projects/panels/ProjectPanelVapeMate";
import ProjectPanelHookahGt from "@/components/projects/panels/ProjectPanelHookahGt";
import ProjectPanelHookahPartner from "@/components/projects/panels/ProjectPanelHookahPartner";
import ProjectOverlayHost from "@/components/projects/overlay/ProjectOverlayHost";
import { useProjectsRail } from "@/hooks/useProjectsRail";
import type { ProjectKey } from "@/components/projects/overlay/ProjectOverlayHost";
import type { CaseStudySlug } from "@/data/caseStudies";

export default function ProjectsRail() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [activeProject, setActiveProject] = useState<ProjectKey>(null);

  const railTween = useProjectsRail(sectionRef, trackRef);

  const handleNavigateProject = (slug: CaseStudySlug) => {
    setActiveProject(slug);
  };

  return (
    <>
      <section
        ref={sectionRef}
        className="relative h-screen overflow-hidden bg-[#090a09]"
      >
        <div ref={trackRef} className="flex h-screen w-max">
          <div className="h-screen w-screen shrink-0">
            <ProjectPanelTradeMate
              railTween={railTween}
              onOpen={() => setActiveProject("trademate")}
            />
          </div>

          <div className="h-screen w-screen shrink-0">
            <ProjectPanelTryFum
              railTween={railTween}
              onOpen={() => setActiveProject("tryfum")}
            />
          </div>

          <div className="h-screen w-screen shrink-0">
            <ProjectPanelOnda
              railTween={railTween}
              onOpen={() => setActiveProject("onda")}
            />
          </div>

          <div className="h-screen w-screen shrink-0">
            <ProjectPanelSectraVision
              railTween={railTween}
              onOpen={() => setActiveProject("sectravision")}
            />
          </div>

          <div className="h-screen w-screen shrink-0">
            <ProjectPanelVapeMate
              railTween={railTween}
              onOpen={() => setActiveProject("vapemate")}
            />
          </div>

          <div className="h-screen w-screen shrink-0">
            <ProjectPanelHookahGt
              railTween={railTween}
              onOpen={() => setActiveProject("hookahgt")}
            />
          </div>

          <div className="h-screen w-screen shrink-0">
            <ProjectPanelHookahPartner
              railTween={railTween}
              onOpen={() => setActiveProject("hookahpartner")}
            />
          </div>

        </div>
      </section>

      <ProjectOverlayHost
        activeProject={activeProject}
        onClose={() => setActiveProject(null)}
        onNavigate={handleNavigateProject}
      />
    </>
  );
}