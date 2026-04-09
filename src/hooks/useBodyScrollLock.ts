"use client";

import { useLayoutEffect } from "react";

export function useBodyScrollLock(locked: boolean) {
  useLayoutEffect(() => {
    if (!locked) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    const previousOverscrollBehavior =
      document.body.style.overscrollBehavior;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
    };
  }, [locked]);
}