// 24-hour sliding window for publicly visible activity.
// The latest approved update resets visibility for the same record.
export const ACTIVITY_WINDOW_MS = 24 * 60 * 60 * 1000;

export type ActivityTimestamp = {
  publishedAt: string;
  updatedAt?: string;
};

export function lastActivityTime(entry: ActivityTimestamp): number {
  return Date.parse(entry.updatedAt ?? entry.publishedAt);
}

export function isVisibleActivity(
  entry: ActivityTimestamp,
  now: number,
): boolean {
  const published = Date.parse(entry.publishedAt);
  const latest = lastActivityTime(entry);

  return (
    Number.isFinite(published) &&
    Number.isFinite(latest) &&
    published <= now &&
    latest >= published &&
    latest <= now &&
    now - latest < ACTIVITY_WINDOW_MS
  );
}
