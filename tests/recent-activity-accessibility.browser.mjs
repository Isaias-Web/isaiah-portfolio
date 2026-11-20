import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const { chromium } = createRequire(import.meta.url)("playwright");

// Uses the same optional Playwright/Chromium harness as the existing browser
// suites. Feed data stays in route mocks; never publishes or sends messages.
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
const variants = [
  [360, false],
  [390, false],
  [768, false],
  [1440, false],
  [390, true],
  [1440, true],
];
const stamp = "2026-11-20T15:00:00Z";
const completed = (id) => ({
  id,
  publishedAt: stamp,
  status: "completed",
  category: "TEST",
  title: `Mock ${id}`,
  summary: "Mock summary",
  description: "Mock description",
});
try {
  for (const [width, reduced] of variants) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: reduced ? "reduce" : "no-preference",
      hasTouch: width < 768,
    });
    const page = await context.newPage();
    await page.bringToFront();
    await page.clock.install({
      time: new Date(reduced ? "2026-11-21T03:00:00Z" : "2026-11-20T18:00:00Z"),
    });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (/hydration|hydrated|did not match/i.test(message.text()))
        errors.push(message.text());
    });
    let entries = [
      completed("first"),
      completed("second"),
      {
        id: "pending",
        publishedAt: stamp,
        status: "in_progress",
        category: "TEST",
        title: "Mock pending",
        summary: "In progress",
      },
    ];
    await page.route("**/api/activity", (route) =>
      route.fulfill({
        json: { date: "2026-11-20", entries, archivedCount: 0, preview: false },
      }),
    );
    await page.route("https://api.web3forms.com/**", (route) => route.abort());
    await page.goto(process.env.TEST_URL || "http://localhost:3000");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".pin-spacer").length === 3 &&
        !document.querySelector("main").inert,
      undefined,
      { timeout: 20000 },
    );
    const trigger = page.locator('[aria-controls="recent-activity-panel"]');
    const close = page.getByRole("button", {
      name: "Cerrar panel",
      exact: true,
    });
    const dialog = page.getByRole("dialog", { name: "RECENT ACTIVITY." });
    const focused = (locator) =>
      locator.evaluate((element) => element === document.activeElement);
    const open = async () => {
      await trigger.focus();
      await page.keyboard.press("Enter");
      await dialog.waitFor();
      await page.waitForFunction(
        () =>
          document.activeElement?.getAttribute("aria-label") === "Cerrar panel",
      );
    };
    const closed = async () => {
      await dialog.waitFor({ state: "detached" });
      await page.waitForFunction(() => {
        const e = document.querySelector(
          '[aria-controls="recent-activity-panel"]',
        );
        return document.activeElement === e && !e.inert;
      });
      assert.equal(
        await page.locator("main").evaluate((element) => element.inert),
        false,
      );
      assert.equal(await page.evaluate(() => document.body.style.overflow), "");
    };
    const refresh = () =>
      page.evaluate(() =>
        document.dispatchEvent(new Event("visibilitychange")),
      );

    assert.match(
      await trigger.getAttribute("aria-label"),
      reduced ? /zzz.*descanso/i : /trabajando/i,
    );
    // Close before the first animation frame: reverse has no progress yet.
    await page.clock.pauseAt(
      new Date(await page.evaluate(() => Date.now() + 100)),
    );
    await trigger.focus();
    await trigger.evaluate((element) => element.click());
    await dialog.waitFor({ state: "attached" });
    await page.evaluate(() =>
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
    );
    await page.clock.runFor(1000);
    await closed();
    await page.clock.resume();
    // Existing inert state must survive the modal's own isolation lifecycle.
    await page.evaluate(() => {
      const e = document.createElement("div");
      e.id = "audit-inert";
      e.inert = true;
      document.body.append(e);
    });
    for (const method of ["escape", "button", "backdrop"]) {
      await open();
      assert.equal(
        await page.locator("main").evaluate((element) => element.inert),
        true,
      );
      const cdp = await context.newCDPSession(page);
      const { nodes } = await cdp.send("Accessibility.getFullAXTree");
      assert.equal(
        nodes.some(
          (node) =>
            !node.ignored &&
            /Ver caso de estudio|Hablemos por WhatsApp/.test(
              node.name?.value || "",
            ),
        ),
        false,
      );
      await cdp.detach();
      // DOM focus attempts outside the panel are blocked, too.
      await page
        .locator("[data-project-open]")
        .first()
        .evaluate((element) => element.focus());
      assert.equal(await focused(close), true);
      const last = dialog.locator("button").last();
      await page.keyboard.press("Shift+Tab");
      assert.equal(await focused(last), true);
      await page.keyboard.press("Tab");
      assert.equal(await focused(close), true);
      await page.waitForTimeout(reduced ? 40 : 850);
      if (method === "escape") await page.keyboard.press("Escape");
      if (method === "button") await close.click();
      if (method === "backdrop") await page.mouse.click(8, 8);
      await closed();
      assert.equal(
        await page.locator("#audit-inert").evaluate((element) => element.inert),
        true,
      );
    }

    await open();
    const first = page.locator('[aria-controls="activity-detail-first"]');
    await first.focus();
    entries = entries.slice(1); // Valid feed update after expiry/removal.
    await refresh();
    await first.waitFor({ state: "detached" });
    await page.waitForFunction(
      () =>
        document.activeElement?.getAttribute("aria-label") === "Cerrar panel",
    );
    await page.keyboard.press("Tab");
    assert.equal(
      await page
        .locator('[aria-controls="activity-detail-second"]')
        .evaluate((element) => element === document.activeElement),
      true,
    );
    // State transition adds an accordion without stealing valid focus.
    entries = [completed("second"), completed("pending")];
    await refresh();
    await page.locator('[aria-controls="activity-detail-pending"]').waitFor();
    assert.equal(
      await focused(page.locator('[aria-controls="activity-detail-second"]')),
      true,
    );
    await page.locator('[aria-controls="activity-detail-pending"]').focus();
    entries = [
      completed("second"),
      { ...entries[1], status: "in_progress", description: undefined },
    ];
    await refresh();
    await page
      .locator('[aria-controls="activity-detail-pending"]')
      .waitFor({ state: "detached" });
    await page.waitForFunction(
      () =>
        document.activeElement?.getAttribute("aria-label") === "Cerrar panel",
    );
    entries = [];
    await refresh();
    await page.waitForFunction(
      () => !document.querySelector("#recent-activity-panel article"),
    );
    await page.keyboard.press("Tab");
    assert.equal(await focused(close), true);
    await page.keyboard.press("Shift+Tab");
    assert.equal(await focused(close), true);
    // Portals inserted later cannot introduce interactive background controls.
    await page.evaluate(() => {
      const e = document.createElement("div");
      e.id = "audit-portal";
      e.innerHTML = "<button>Outside mock</button>";
      document.body.append(e);
    });
    await page.waitForFunction(
      () => document.querySelector("#audit-portal").inert,
    );
    await page
      .locator("#audit-portal button")
      .evaluate((element) => element.focus());
    assert.equal(await focused(close), true);
    await page.keyboard.press("Escape");
    await closed();
    assert.equal(
      await page.locator("#audit-portal").evaluate((element) => element.inert),
      false,
    );

    const cycles = width === 390 ? 12 : 1;
    for (let index = 0; index < cycles; index++) {
      await open();
      await page.waitForTimeout(reduced ? 40 : index % 2 ? 20 : 850);
      await page.keyboard.press("Escape");
      await closed();
      assert.equal(await page.locator(".pin-spacer").count(), 3);
    }
    // The toast opener unmounts during opening: fall back to the dock trigger.
    const recent = new Date(
      await page.evaluate(() => Date.now()),
    ).toISOString();
    entries = [{ ...completed("toast"), publishedAt: recent }];
    await refresh();
    const toastOpen = page.getByRole("button", {
      name: "Leer resumen →",
      exact: true,
    });
    await toastOpen.waitFor();
    await toastOpen.focus();
    await page.keyboard.press("Enter");
    await dialog.waitFor();
    await page.waitForTimeout(reduced ? 40 : 850);
    await page.keyboard.press("Escape");
    await closed();
    assert.equal(await focused(trigger), true);
    assert.deepEqual(errors, []);
    results.push({
      width,
      reduced,
      closeMethods: 3,
      consecutiveCycles: cycles,
      feedRemoval: true,
      stateTransitions: true,
      tabWrap: true,
      backgroundInert: true,
      laterPortalInert: true,
      inertRestored: true,
      toastOpenerFallback: true,
      errors,
    });
    console.log(
      `PASS: Recent Activity focus at ${width}px, reduced=${reduced}`,
    );
    await context.close();
  }
  if (process.env.REPORT_PATH)
    fs.writeFileSync(process.env.REPORT_PATH, JSON.stringify(results, null, 2));
} finally {
  await browser.close();
}
