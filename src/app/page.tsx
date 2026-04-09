"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

import Hero from "@/sections/Hero";
import Manifesto from "@/sections/Manifesto";
import WhoAmI from "@/sections/WhoAmI";
import RightNow from "@/sections/RightNow";
import ProjectsRail from "@/sections/ProjectsRail";
import OpenChannel from "@/sections/OpenChannel";

const Preloader = dynamic(() => import("@/components/Preloader"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 z-[9999] bg-[#090a09]" />,
});

export default function Page() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <>
      {!loadingComplete && (
        <Preloader onComplete={() => setLoadingComplete(true)} />
      )}

      {loadingComplete && (
        <main>
          <Hero />
          <Manifesto />
          <WhoAmI />
          <ProjectsRail />
          <RightNow />
          <OpenChannel />
        </main>
      )}
    </>
  );
}