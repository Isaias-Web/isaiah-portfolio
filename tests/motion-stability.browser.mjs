import { createRequire } from "node:module";
import assert from "node:assert/strict";
const { chromium } = createRequire(import.meta.url)("playwright");

// Optional browser harness; no provider requests or production credentials.
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      hasTouch: width === 390,
    });
    const page = await context.newPage();
    await page.bringToFront();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("https://api.web3forms.com/**", (route) => route.abort());
    await page.goto(process.env.TEST_URL || "http://localhost:3000");
    await page.waitForFunction(
      () =>
        document.querySelectorAll(".pin-spacer").length === 3 &&
        !document.querySelector("main").inert,
      undefined,
      { timeout: 20000 },
    );
    const start = await page
      .locator(".manifesto-word")
      .first()
      .evaluate(
        (element) =>
          element.closest("section").parentElement.getBoundingClientRect().top +
          scrollY,
      );
    for (const distance of [0, 250, 660, 1100, 1321, 1100, 660, 0]) {
      await page.evaluate(
        (y) => scrollTo({ top: y, behavior: "instant" }),
        start + distance,
      );
      await page.waitForTimeout(100);
      const words = await page
        .locator(".manifesto-word")
        .evaluateAll((elements) =>
          elements.map((element) => +getComputedStyle(element).opacity),
        );
      assert.equal(
        words.filter((opacity) => opacity === 1).length,
        Math.min(12, Math.floor((distance / 1320) * 12)),
      );
    }
    for (const y of [Number.MAX_SAFE_INTEGER, 0, Number.MAX_SAFE_INTEGER]) {
      await page.evaluate((top) => scrollTo({ top, behavior: "instant" }), y);
      await page.waitForTimeout(1550);
      assert.ok(
        await page
          .locator("[data-right-now-reveal]")
          .evaluateAll(
            (elements, visible) =>
              elements.every(
                (element) =>
                  +getComputedStyle(element).opacity === (visible ? 1 : 0),
              ),
            y !== 0,
          ),
      );
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(180);
    assert.ok(
      await page
        .locator("[data-right-now-letter]")
        .evaluateAll((elements) =>
          elements.every(
            (element) => getComputedStyle(element).transform === "none",
          ),
        ),
    );
    assert.ok(
      await page
        .locator("[data-right-now-reveal]")
        .evaluateAll((elements) =>
          elements.every(
            (element) => getComputedStyle(element).opacity === "1",
          ),
        ),
    );
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.waitForTimeout(180);
    if (width === 1440) {
      await page.bringToFront();
      const hint = page.locator("[data-custom-cursor]").nth(1);
      await page
        .locator("[data-project-open]")
        .first()
        .dispatchEvent("mousemove", {
          clientX: 1439,
          clientY: 899,
          bubbles: true,
        });
      await page.waitForTimeout(600);
      assert.equal(
        await hint.evaluate((element) => getComputedStyle(element).opacity),
        "1",
      );
      const rect = await hint.boundingBox();
      assert.ok(
        rect.x >= 0 &&
          rect.x + rect.width <= width &&
          rect.y + rect.height <= 900,
      );
      await page.locator("#contact-name").dispatchEvent("mousemove", {
        clientX: 100,
        clientY: 100,
        bubbles: true,
      });
      await page.waitForFunction(
        () =>
          getComputedStyle(document.querySelectorAll("[data-custom-cursor]")[1])
            .opacity === "0",
      );
      assert.equal(
        await hint.evaluate((element) => getComputedStyle(element).opacity),
        "0",
      );
    }
    assert.deepEqual(errors, []);
    console.log(`PASS: motion, reduced motion and cursor at ${width}px`);
    await context.close();
  }
} finally {
  await browser.close();
}
