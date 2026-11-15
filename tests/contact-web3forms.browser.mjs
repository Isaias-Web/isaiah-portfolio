import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
const loadPackage = createRequire(import.meta.url);
const { chromium } = loadPackage("playwright");
(async () => {
  const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
  try {
    const results = [];
    for (const width of [1440, 390]) {
      const p = await b.newPage({
          viewport: { width, height: 900 },
          hasTouch: width === 390,
        }),
        errors = [];
      p.on("pageerror", (e) => errors.push(e.message));
      p.on("console", (m) => {
        if (/hydration|hydrated|did not match/i.test(m.text()))
          errors.push(m.text());
      });
      let mode = "slow",
        calls = 0;
      await p.route("https://api.web3forms.com/submit", async (route) => {
        calls++;
        const req = route.request();
        assert.match(
          req.headers()["content-type"],
          /multipart\/form-data; boundary=/,
        );
        const body = req.postData();
        for (const field of [
          "access_key",
          "name",
          "email",
          "inquiry",
          "message",
        ])
          assert.ok(body.includes(`name="${field}"`));
        assert.ok(!body.includes("turnstile"));
        if (mode === "network") return route.abort("failed");
        if (mode === "slow") await new Promise((r) => setTimeout(r, 900));
        return route.fulfill({
          status: mode === "429" ? 429 : mode === "500" ? 500 : 200,
          contentType: "application/json",
          body:
            mode === "invalid"
              ? "not-json"
              : JSON.stringify({
                  success:
                    mode === "false"
                      ? false
                      : mode === "string"
                        ? "true"
                        : true,
                }),
        });
      });
      await p.goto(process.env.TEST_URL || "http://localhost:3161");
      await p.waitForFunction(
        () =>
          document.querySelectorAll(".pin-spacer").length === 3 &&
          !document.querySelector("main").inert,
        { timeout: 20000 },
      );
      const button = p.getByRole("button", {
          name: "ENVIAR CONSULTA",
          exact: true,
        }),
        form = p.locator("[data-contact-form]"),
        toast = p.locator("[data-contact-toast]");
      await button.click();
      assert.equal(calls, 0);
      assert.equal(await p.locator('[aria-invalid="true"]').count(), 4);
      assert.equal(
        await p.evaluate(() => document.activeElement.id),
        "contact-name",
      );
      const fill = async () => {
        await p.locator("#contact-name").fill("Prueba local");
        await p.locator("#contact-email").fill("test@example.com");
        await p.locator("#contact-inquiry").selectOption("integrations");
        await p
          .locator("#contact-message")
          .fill("Consulta de prueba local sin correo real.");
      };
      await fill();
      await form.evaluate((f) => {
        f.requestSubmit();
        f.dispatchEvent(
          new Event("submit", { bubbles: true, cancelable: true }),
        );
      });
      await p
        .getByRole("button", { name: "ENVIANDO...", exact: true })
        .waitFor();
      assert.equal(
        await p.locator("#contact-name").inputValue(),
        "Prueba local",
      );
      assert.equal(await p.locator("#contact-name").isDisabled(), true);
      await toast.waitFor();
      assert.equal(calls, 1);
      assert.equal(await p.locator("#contact-name").inputValue(), "");
      assert.equal(await p.locator("#contact-inquiry").inputValue(), "");
      await p.waitForTimeout(250);
      const rect = await toast.boundingBox();
      assert.ok(
        rect.x >= 15 &&
          rect.x + rect.width <= width - 15 &&
          rect.y >= 15 &&
          rect.y < 40,
      );
      assert.equal(
        await toast.evaluate((e) => e.parentElement === document.body),
        true,
      );
      await p.mouse.wheel(0, 120);
      await p.waitForTimeout(300);
      assert.ok(Math.abs((await toast.boundingBox()).y - rect.y) < 1);
      await p.waitForTimeout(5100);
      assert.equal(await toast.count(), 0);
      for (const failure of [
        "429",
        "500",
        "invalid",
        "false",
        "string",
        "network",
      ]) {
        mode = failure;
        await fill();
        await button.click();
        await p.waitForFunction(
          () =>
            document.querySelector("form").getAttribute("aria-busy") ===
            "false",
        );
        assert.equal(await toast.count(), 0);
        assert.equal(
          await p.locator("#contact-name").inputValue(),
          "Prueba local",
        );
        assert.ok(
          (await p.locator("form [role=status]").innerText()).length > 10,
        );
      }
      mode = "slow";
      await button.click();
      await toast.waitFor();
      await p.getByRole("button", { name: "Cerrar notificación" }).focus();
      await p.keyboard.press("Enter");
      await toast.waitFor({ state: "detached" });
      assert.equal(
        await button.evaluate((e) => e === document.activeElement),
        true,
      );
      await fill();
      await p.locator("[name=botcheck]").evaluate((e) => (e.checked = true));
      const before = calls;
      await button.click();
      assert.equal(calls, before);
      assert.equal(await toast.count(), 0);
      assert.equal(await p.locator(".pin-spacer").count(), 3);
      assert.ok(
        await p.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      );
      assert.deepEqual(errors, []);
      results.push({
        width,
        mockedRequests: calls,
        duplicateGuard: true,
        successReset: true,
        pendingRetainsData: true,
        errorsRetainData: true,
        autoCloseFiveSeconds: true,
        keyboardClose: true,
        fixedPortal: true,
        honeypot: true,
        errors,
      });
      await p.close();
    }
    if (process.env.REPORT_PATH)
      fs.writeFileSync(
        process.env.REPORT_PATH,
        JSON.stringify(results, null, 2),
      );
    console.log(JSON.stringify(results, null, 2));
  } finally {
    await b.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
