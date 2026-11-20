"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { gsap } from "@/animations/gsap-config";
import { useSmoothScrollControl } from "@/components/SmoothScrollContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
import { activityEntries } from "@/data/recentActivity";

const CITY_TIME_ZONE = "America/Mexico_City";

function dateKey(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: CITY_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date);
  const part = (type: string) => parts.find((item) => item.type === type)?.value ?? "";
  return part("year") + "-" + part("month") + "-" + part("day");
}

function dateLabel(iso: string): string {
  return new Intl.DateTimeFormat("es-MX", {
    timeZone: CITY_TIME_ZONE,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export default function RecentActivityDock() {
  const { introReady, paused, pauseScroll, resumeScroll } = useSmoothScrollControl();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // Use the same body + html lock already used by project detail overlays.
  useBodyScrollLock(isOpen);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    const updateToday = () => setToday(dateKey(new Date()));
    updateToday();
    const interval = window.setInterval(updateToday, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  const handleOpen = () => {
    if (isOpen || !introReady || paused) return;
    closingRef.current = false;
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const timeline = timelineRef.current;
    if (!timeline) {
      setIsOpen(false);
      return;
    }

    timeline.eventCallback("onReverseComplete", () => {
      setIsOpen(false);
      setExpandedId(null);
    });
    timeline.reverse();
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !panelRef.current || !backdropRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const context = gsap.context(() => {
      gsap.set(panelRef.current, { yPercent: 100 });
      gsap.set(backdropRef.current, { autoAlpha: 0 });

      const timeline = gsap.timeline({ paused: true });
      timeline
        .to(backdropRef.current, {
          autoAlpha: 1,
          duration: reducedMotion ? 0.01 : 0.28,
        }, 0)
        .to(panelRef.current, {
          yPercent: 0,
          duration: reducedMotion ? 0.01 : 0.8,
          ease: "power4.out",
        }, 0);

      timelineRef.current = timeline;
      timeline.play();
    });

    return () => {
      timelineRef.current = null;
      context.revert();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement;
    pauseScroll();
    closeRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        handleClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const controls = Array.from(
        panel.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      ).filter((control) => control.getClientRects().length > 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      resumeScroll();
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [isOpen, handleClose, pauseScroll, resumeScroll]);

  const todayEntries = activityEntries
    .filter((entry) => today && dateKey(entry.publishedAt) === today)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  const archivedCount = activityEntries.filter(
    (entry) => today && dateKey(entry.publishedAt) < today
  ).length;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        inert={!introReady || paused}
        aria-controls="recent-activity-panel"
        aria-expanded={isOpen}
        aria-label="Trabajando. Ver las actualizaciones de hoy"
        className={`fixed bottom-[88px] right-5 z-[9500] flex h-14 w-[190px] items-center justify-center rounded-full border border-[#ff2d00] bg-[#ff2d00] px-4 text-[#090a09] transition-[background-color,opacity] duration-300 hover:bg-[#ff4d2a] ${!introReady || paused ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <span className="flex items-center text-[14px] font-bold tracking-[-0.03em]">
          Trabajando
          <span aria-hidden="true" className="ml-0.5 inline-block w-[3ch] font-mono text-left">
            <span className="working-dots inline-block overflow-hidden whitespace-nowrap align-bottom">
              ...
            </span>
          </span>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[9800] text-[#f5f5f5]">
          <button
            ref={backdropRef}
            type="button"
            tabIndex={-1}
            onClick={handleClose}
            aria-label="Cerrar actualizaciones"
            className="absolute inset-0 w-full bg-black/75"
          />

          <section
            id="recent-activity-panel"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="recent-activity-title"
            className="absolute inset-x-0 bottom-0 flex h-[88dvh] flex-col overflow-hidden rounded-t-[18px] border-t border-white/15 bg-[#090a09] md:h-[78dvh]"
          >
            <div className="shrink-0 border-b border-white/10 px-6 py-7 md:px-10 lg:px-16">
              <div className="mx-auto flex w-full max-w-[1400px] items-start justify-between gap-5">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#ff2d00]">
                    DEVELOPMENT / UPDATES
                  </p>
                  <h2
                    id="recent-activity-title"
                    className="mt-4 text-[27px] font-bold uppercase tracking-[-0.045em] md:text-[46px]"
                  >
                    RECENT ACTIVITY<span className="text-[#ff2d00]">.</span>
                  </h2>
                  <p className="mt-2 text-[13px] text-white/50">
                    Trabajos y avances del día. Datos de demostración.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar panel"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/35 hover:text-white"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            <div
              data-lenis-prevent
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-7 md:px-10 lg:px-16"
            >
              <div className="mx-auto w-full max-w-[1400px]">
                {todayEntries.length === 0 ? (
                  <p className="py-12 text-center text-[13px] text-white/45">
                    Aún no hay actualizaciones publicadas hoy.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {todayEntries.map((entry) => {
                      const expanded = expandedId === entry.id;
                      return (
                        <article
                          key={entry.id}
                          className="overflow-hidden rounded-xl border border-white/15"
                        >
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-controls={"activity-detail-" + entry.id}
                            onClick={() => setExpandedId(expanded ? null : entry.id)}
                            className="flex w-full items-center gap-5 px-5 py-6 text-left md:px-7"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ff2d00]">
                                  {entry.category}
                                </span>
                                <time
                                  dateTime={entry.publishedAt}
                                  className="font-mono text-[10px] text-white/40"
                                >
                                  {dateLabel(entry.publishedAt)}
                                </time>
                              </div>
                              <h3 className="mt-4 text-[16px] font-semibold md:text-[18px]">
                                {entry.title}
                              </h3>
                              <p className="mt-2 text-[13px] leading-relaxed text-white/55">
                                {entry.summary}
                              </p>
                            </div>
                            <Plus
                              size={18}
                              strokeWidth={1.5}
                              aria-hidden="true"
                              className={
                                "shrink-0 text-[#ff2d00] transition-transform duration-500 motion-reduce:transition-none " +
                                (expanded ? "rotate-180" : "rotate-0")
                              }
                            />
                          </button>
                          <div
                            id={"activity-detail-" + entry.id}
                            inert={!expanded}
                            className={
                              "grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none " +
                              (expanded
                                ? "grid-rows-[1fr] opacity-100"
                                : "grid-rows-[0fr] opacity-0")
                            }
                          >
                            <div className="min-h-0 overflow-hidden">
                              <p className="border-t border-white/10 px-5 py-6 text-[13px] leading-[1.9] text-white/65 md:px-7 md:text-[14px]">
                                {entry.description}
                              </p>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
                <p className="mt-9 border-t border-white/10 pt-6 text-right font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                  {archivedCount} actualizaciones archivadas
                </p>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
