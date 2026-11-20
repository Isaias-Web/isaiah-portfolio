import { NextResponse } from "next/server";
import { isVisibleActivity, lastActivityTime } from "@/lib/activityWindow";
import {
  activityEntries,
  previewActivityEntries,
  type ActivityEntry,
} from "@/data/recentActivity";

export const dynamic = "force-dynamic";

const ZONE = "America/Mexico_City";

function dateInMexico(value: string | Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: ZONE,
  }).formatToParts(typeof value === "string" ? new Date(value) : value);
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return [get("year"), get("month"), get("day")].join("-");
}

type ActivityFeedResponse = {
  date: string;
  entries: ActivityEntry[];
  archivedCount: number;
  preview: boolean;
};

export function GET() {
  const now = new Date();
  const date = dateInMexico(now);
  const preview =
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV === "development";

  const timestamp = now.getTime();
  const all = (preview ? [...activityEntries, ...previewActivityEntries] : activityEntries)
    .filter((entry) => Number.isFinite(Date.parse(entry.publishedAt)))
    .filter((entry) => Number.isFinite(lastActivityTime(entry)))
    .filter((entry) => Date.parse(entry.publishedAt) <= timestamp)
    .filter((entry) => lastActivityTime(entry) >= Date.parse(entry.publishedAt))
    .filter((entry) => lastActivityTime(entry) <= timestamp);

  // Una ventana de 24 horas exactas desde el último avance publicado.
  // No se mantienen solicitudes abiertas indefinidamente.
  const entries = all
    .filter((entry) => isVisibleActivity(entry, timestamp))
    .sort((a, b) => lastActivityTime(b) - lastActivityTime(a));

  // El contador sigue representando solo trabajos terminados, no
  // solicitudes abiertas que hayan caducado.
  const archivedCount = all.filter(
    (entry) =>
      entry.status === "completed" &&
      !isVisibleActivity(entry, timestamp)
  ).length;

  return NextResponse.json(
    { date, entries, archivedCount, preview } satisfies ActivityFeedResponse,
    {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    }
  );
}
