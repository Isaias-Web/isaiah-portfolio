import test from "node:test";
import assert from "node:assert/strict";
import { ACTIVITY_WINDOW_MS, isVisibleActivity } from "../src/lib/activityWindow.ts";

const publishedAt = "2026-11-19T12:00:00-06:00";
const publishedMs = Date.parse(publishedAt);
const pending = { publishedAt };

test("recent request is visible during the next 24 hours even across midnight", () => {
  assert.equal(isVisibleActivity(pending, publishedMs + ACTIVITY_WINDOW_MS - 1), true);
});

test("request expires at exactly 24 hours even while still in progress", () => {
  assert.equal(isVisibleActivity(pending, publishedMs + ACTIVITY_WINDOW_MS), false);
  assert.equal(isVisibleActivity(pending, publishedMs + ACTIVITY_WINDOW_MS + 1), false);
});

test("an approved update extends visibility by another 24 hours", () => {
  const updatedAt = "2026-11-20T11:00:00-06:00";
  const entry = { publishedAt, updatedAt };
  assert.equal(isVisibleActivity(entry, publishedMs + ACTIVITY_WINDOW_MS), true);
  assert.equal(isVisibleActivity(entry, Date.parse(updatedAt) + ACTIVITY_WINDOW_MS), false);
});

test("future and invalid dates are not visible", () => {
  assert.equal(isVisibleActivity(pending, publishedMs - 1), false);
  assert.equal(isVisibleActivity({ publishedAt: "invalid" }, publishedMs), false);
  assert.equal(
    isVisibleActivity({ publishedAt, updatedAt: "2026-11-19T11:00:00-06:00" }, publishedMs),
    false
  );
});
