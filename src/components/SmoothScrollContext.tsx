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

  const pauseScroll = useCallback(() => {
    setPaused(true);
  }, []);

  const resumeScroll = useCallback(() => {
    setPaused(false);
  }, []);

  const value = useMemo(
    () => ({
      paused,
      pauseScroll,
      resumeScroll,
    }),
    [paused, pauseScroll, resumeScroll]
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