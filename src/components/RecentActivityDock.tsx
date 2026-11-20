"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Activity, X } from "lucide-react";
import type { ActivityEntry } from "@/data/recentActivity";
import { gsap } from "@/animations/gsap-config";
import { useSmoothScrollControl } from "@/components/SmoothScrollContext";
import { useBodyScrollLock } from "@/hooks/useBodyScrollLock";
type ActivityFeed = {
  date: string;
  entries: ActivityEntry[];
  archivedCount: number;
  preview: boolean;
};

const SEEN_STORAGE_KEY = "isaias:recent-activity:seen-v2";

// La notificación se renueva cuando hay un avance confirmado o se cierra
// una solicitud; no solo cuando se crea un ID nuevo.
function notificationKey(entry: ActivityEntry) {
  return [entry.id, entry.updatedAt ?? entry.publishedAt, entry.status].join(":");
}

function clockMode(): "working" | "sleeping" {
  const parts = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hourCycle: "h23",
    timeZone: CITY_TIME_ZONE,
  }).formatToParts(new Date());
  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "0");
  return hour >= 8 && hour < 20 ? "working" : "sleeping";
}

function getSeenIds(): string[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(SEEN_STORAGE_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

function rememberSeen(ids: string[]) {
  try {
    const seen = [...new Set([...ids, ...getSeenIds()])].slice(0, 120);
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(seen));
  } catch {
    // Storage can be unavailable in private browsing; the feed still works.
  }
}

const CITY_TIME_ZONE = "America/Mexico_City";

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
  const [feed, setFeed] = useState<ActivityFeed | null>(null);
  const [toast, setToast] = useState<ActivityEntry | null>(null);
  const [mode, setMode] = useState<"working" | "sleeping" | null>(null);

  // Use the same body + html lock already used by project detail overlays.
  useBodyScrollLock(isOpen);

  const toastRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const backdropRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);

  useEffect(() => {
    const refreshClock = () => setMode(clockMode());
    refreshClock();
    const interval = window.setInterval(refreshClock, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  // Fetch the current production/preview feed every 45 s, and on tab return.
  // No client write API or tokens: publishing requires a reviewed GitHub change.
  useEffect(() => {
    let active = true;
    let loading = false;
    const refresh = async () => {
      if (loading) return;
      loading = true;
      try {
        const response = await fetch("/api/activity", { cache: "no-store" });
        if (!response.ok) return;
        const payload = (await response.json()) as ActivityFeed;
        if (active && Array.isArray(payload.entries)) setFeed(payload);
      } catch {
        // Preserve the last successful feed during transient network failures.
      } finally {
        loading = false;
      }
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    void refresh();
    const interval = window.setInterval(() => void refresh(), 45_000);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const dismissToast = useCallback((entry: ActivityEntry) => {
    rememberSeen([notificationKey(entry)]);
    setToast(null);
  }, []);

  const handleOpen = (entryId?: string) => {
    if (isOpen || !introReady || paused) return;
    closingRef.current = false;
    rememberSeen(feed?.entries.map(notificationKey) ?? []);
    setToast(null);
    const selected = feed?.entries.find((entry) => entry.id === entryId);
    setExpandedId(selected?.status === "completed" ? entryId ?? null : null);
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

  // Only a new, unseen entry from the current day triggers the on-site toast.
  useEffect(() => {
    if (!introReady || paused || isOpen || toast) return;
    const newest = feed?.entries.find(
      (entry) => !getSeenIds().includes(notificationKey(entry))
    );
    if (!newest) return;
    // Small presentation delay after receipt; no fictitious progress is generated.
    const schedule = window.setTimeout(() => setToast(newest), 900);
    return () => window.clearTimeout(schedule);
  }, [feed, introReady, paused, isOpen, toast]);

  useLayoutEffect(() => {
    const element = toastRef.current;
    if (!toast || !element || paused || isOpen) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const tween = gsap.fromTo(
      element,
      { autoAlpha: 0, y: -14 },
      { autoAlpha: 1, y: 0, duration: 0.42, ease: "power3.out" }
    );
    return () => { tween.kill(); };
  }, [toast, isOpen, paused]);

  useEffect(() => {
    if (!toast || paused || isOpen) return;
    const timeout = window.setTimeout(() => dismissToast(toast), 8500);
    return () => window.clearTimeout(timeout);
  }, [toast, paused, isOpen, dismissToast]);

  const todayEntries = feed?.entries ?? [];
  const archivedCount = feed?.archivedCount ?? 0;

  return (
    <>
      {toast && introReady && !paused && !isOpen && (
        <aside
          ref={toastRef}
          role="status"
          aria-live="polite"
          className="fixed right-3 top-3 z-[990] w-[calc(100vw-24px)] max-w-[340px] rounded-xl border border-white/20 bg-[#151615] p-3 text-[#f5f5f5] shadow-[0_12px_42px_rgba(0,0,0,0.35)] md:right-5 md:top-5"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#ff2d00]/35 text-[#ff2d00]">
              <Activity size={15} strokeWidth={1.6} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="pr-4 text-[12px] font-semibold leading-snug">
                {toast.title}
              </p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#ff2d00]">
                {toast.category} · {dateLabel(toast.publishedAt)}
              </p>
              <p className="mt-2 text-[11px] leading-[1.5] text-white/60">
                {toast.summary}
              </p>
              <button
                type="button"
                onClick={() => handleOpen(toast.id)}
                className="mt-2 text-[11px] font-semibold text-[#ff2d00] hover:underline"
              >
                {toast.status === "completed" ? "Leer resumen →" : "Ver avance →"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => dismissToast(toast)}
              aria-label="Descartar notificación"
              className="shrink-0 p-1 text-white/55 transition-colors hover:text-white"
            >
              <X size={14} strokeWidth={1.5} />
            </button>
          </div>
        </aside>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => handleOpen()}
        inert={!introReady || paused}
        aria-controls="recent-activity-panel"
        aria-expanded={isOpen}
        aria-label={mode === "sleeping"
          ? "En horario de descanso. Ver las actualizaciones"
          : "Trabajando. Ver las actualizaciones"}
        className={`fixed bottom-[58px] right-3 z-[950] flex h-9 w-[138px] items-center justify-center rounded-full border border-[#ff2d00] bg-[#ff2d00] px-2 text-[#090a09] md:bottom-[88px] md:right-5 md:h-14 md:w-[190px] md:px-4 transition-[background-color,opacity] duration-300 hover:bg-[#ff4d2a] ${!introReady || paused ? "pointer-events-none opacity-0" : "opacity-100"}`}
      >
        <span className="flex items-center text-[11px] font-bold tracking-[-0.03em] md:text-[14px]">
          {mode === "sleeping" ? (
            <>
              <span aria-hidden="true" className="mr-1 text-[15px] md:text-[18px]">😴</span>
              zzz...
            </>
          ) : mode === "working" ? (
            <>
              trabajando
              <span aria-hidden="true" className="ml-0.5 inline-block w-[3ch] font-mono text-left">
                <span className="working-dots inline-block overflow-hidden whitespace-nowrap align-bottom">
                  ...
                </span>
              </span>
            </>
          ) : (
            <>actividad</>
          )}
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
                    Solicitudes en curso y trabajos completados hoy. {feed?.preview ? "Vista de prueba." : ""}
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
                      const completed = entry.status === "completed";
                      const expanded = completed && expandedId === entry.id;
                      const latest = entry.progress?.at(-1);
                      return (
                        <article
                          key={entry.id}
                          className={
                            "overflow-hidden rounded-xl border " +
                            (completed
                              ? "border-white/15"
                              : "border-white/10 bg-white/[0.015]")
                          }
                        >
                          {completed ? (
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
                                    {entry.category} <span className="ml-2 text-white/40">/ FINALIZADO</span>
                                  </span>
                                  <time dateTime={entry.updatedAt ?? entry.publishedAt} className="font-mono text-[10px] text-white/40">
                                    {dateLabel(entry.updatedAt ?? entry.publishedAt)}
                                  </time>
                                </div>
                                <h3 className="mt-4 text-[16px] font-semibold md:text-[18px]">{entry.title}</h3>
                                <p className="mt-2 text-[13px] leading-relaxed text-white/55">{entry.summary}</p>
                              </div>
                              <span
                                aria-hidden="true"
                                className={
                                  "relative h-[18px] w-[18px] shrink-0 text-[#ff2d00] transition-transform duration-500 motion-reduce:transition-none " +
                                  (expanded ? "rotate-180" : "rotate-0")
                                }
                              >
                                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                                <span className={
                                  "absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-opacity duration-300 motion-reduce:transition-none " +
                                  (expanded ? "opacity-0" : "opacity-100")
                                } />
                              </span>
                            </button>
                          ) : (
                            // Una solicitud abierta se ve, pero no se puede accionar ni expandir.
                            <div aria-label="Solicitud en proceso, aún sin resumen final" className="px-5 py-6 md:px-7">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ff2d00]">
                                  {entry.category} <span className="ml-2 text-white/45">/ EN PROCESO</span>
                                </span>
                                <time dateTime={entry.updatedAt ?? entry.publishedAt} className="font-mono text-[10px] text-white/40">
                                  {dateLabel(entry.updatedAt ?? entry.publishedAt)}
                                </time>
                              </div>
                              <h3 className="mt-4 text-[16px] font-semibold text-white/65 md:text-[18px]">{entry.title}</h3>
                              <p className="mt-2 text-[13px] leading-relaxed text-white/45">{entry.summary}</p>
                              {latest && (
                                <div className="mt-4 flex items-start gap-2 border-t border-white/10 pt-4">
                                  <span className="mt-[5px] h-[5px] w-[5px] shrink-0 rounded-full bg-[#ff2d00]" />
                                  <div className="min-w-0">
                                    <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-white/55">
                                      Último avance · {latest.stage}
                                    </p>
                                    <p className="mt-1 text-[12px] leading-relaxed text-white/40">{latest.note}</p>
                                  </div>
                                </div>
                              )}
                              <p className="mt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-white/30">
                                Resumen disponible al finalizar
                              </p>
                            </div>
                          )}
                          {completed && (
                            <div
                              id={"activity-detail-" + entry.id}
                              inert={!expanded}
                              className={
                                "grid transition-[grid-template-rows,opacity] duration-500 ease-in-out motion-reduce:transition-none " +
                                (expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")
                              }
                            >
                              <div className="min-h-0 overflow-hidden">
                                <p className="border-t border-white/10 px-5 py-6 text-[13px] leading-[1.9] text-white/65 md:px-7 md:text-[14px]">
                                  {entry.description ?? "Resumen pendiente de aprobación."}
                                </p>
                              </div>
                            </div>
                          )}
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
