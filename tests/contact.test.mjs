import test from "node:test";
import assert from "node:assert/strict";
import { validateContact } from "../src/lib/contact.ts";
const valid = {
  name: "María López",
  email: "maria@example.com",
  inquiry: "integrations",
  message: "Necesito conectar un formulario con un CRM.",
};
test("accepts a complete consultation without mutating its contents", () => {
  const original = { ...valid };
  assert.deepEqual(validateContact(valid), {});
  assert.deepEqual(valid, original);
});
test("reports all missing required fields", () => {
  assert.deepEqual(
    Object.keys(
      validateContact({ name: " ", email: "", inquiry: "", message: " " }),
    ),
    ["name", "email", "inquiry", "message"],
  );
});
test("rejects invalid email, multiline email, and unrecognized consultation type", () => {
  for (const email of ["invalid", "a@b", "a@b.com\r\nBcc:x@y.com"])
    assert.ok(validateContact({ ...valid, email }).email);
  assert.ok(validateContact({ ...valid, inquiry: "arbitrary" }).inquiry);
});
test("bounds payload fields, including values pasted beyond HTML limits", () => {
  assert.ok(validateContact({ ...valid, name: "a".repeat(101) }).name);
  assert.ok(
    validateContact({ ...valid, email: "a".repeat(250) + "@b.com" }).email,
  );
  assert.ok(validateContact({ ...valid, message: "x".repeat(3001) }).message);
});
test("validates meaningful message content and permits boundary lengths", () => {
  assert.ok(validateContact({ ...valid, message: " ".repeat(30) }).message);
  for (const n of [20, 3000])
    assert.equal(
      validateContact({ ...valid, message: "x".repeat(n) }).message,
      undefined,
    );
});
