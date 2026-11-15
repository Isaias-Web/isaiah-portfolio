"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from "react";

type SmoothScrollContextValue = {
  introReady: boolean;
  completeIntro: () => void;
  paused: boolean;
  pauseScroll: () => void;
  resumeScroll: () => void;
};

const SmoothScrollContext = createContext<SmoothScrollContextValue | null>(null);

export function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [paused, setPaused] = useState(false);
  const [introReady, setIntroReady] = useState(false);
  const completeIntro = useCallback(() => setIntroReady(true), []);

  const pauseScroll = useCallback(() => {
    setPaused(true);
  }, []);

  const resumeScroll = useCallback(() => {
    setPaused(false);
  }, []);

  const value = useMemo(
    () => ({
      introReady,
      completeIntro,
      paused: !introReady || paused,
      pauseScroll,
      resumeScroll,
    }),
    [introReady, completeIntro, paused, pauseScroll, resumeScroll]
  );

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScrollControl() {
  const context = useContext(SmoothScrollContext);

  if (!context) {
    throw new Error(
      "useSmoothScrollControl must be used inside SmoothScrollProvider"
    );
  }

  return context;
}
