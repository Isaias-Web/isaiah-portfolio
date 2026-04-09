"use client";

import { useRef, useState } from "react";
import ProjectPanelTradeMate from "@/components/projects/panels/ProjectPanelTradeMate";
import ProjectPanelTryFum from "@/components/projects/panels/ProjectPanelTryFum";
import ProjectPanelOnda from "@/components/projects/panels/ProjectPanelOnda";
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