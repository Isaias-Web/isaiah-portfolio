import { NextResponse } from "next/server";
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

  const all = (preview ? [...activityEntries, ...previewActivityEntries] : activityEntries)
    .filter((entry) => Number.isFinite(Date.parse(entry.publishedAt)))
    .filter((entry) => Date.parse(entry.publishedAt) <= now.getTime());

  const entries = all
    .filter((entry) => dateInMexico(entry.publishedAt) === date)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  const archivedCount = all.filter(
    (entry) => dateInMexico(entry.publishedAt) < date
  ).length;

  return NextResponse.json(
    { date, entries, archivedCount, preview } satisfies ActivityFeedResponse,
    {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    }
  );
}
