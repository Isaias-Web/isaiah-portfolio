import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { socialOpenGraphArtworkBase64 } from "../src/lib/socialOpenGraphArtwork.ts";

const jpeg = Buffer.from(socialOpenGraphArtworkBase64, "base64");

test("Social OG asset is a nonempty JPEG with expected dimensions", () => {
  assert.ok(jpeg.length > 50_000, "Image seems unexpectedly small");
  assert.equal(jpeg[0], 0xff);
  assert.equal(jpeg[1], 0xd8);
  assert.equal(jpeg[jpeg.length - 2], 0xff);
  assert.equal(jpeg[jpeg.length - 1], 0xd9);

  let frame = -1;
  for (let i = 2; i < jpeg.length - 9; i++) {
    if (jpeg[i] === 0xff && [0xc0, 0xc1, 0xc2].includes(jpeg[i + 1])) {
      frame = i;
      break;
    }
  }
  assert.ok(frame >= 0, "JPEG frame header not found");
  assert.equal(jpeg.readUInt16BE(frame + 5), 630);
  assert.equal(jpeg.readUInt16BE(frame + 7), 1200);
});

test("Social image route returns JPEG bytes directly instead of ImageResponse", () => {
  const route = readFileSync("src/app/og-image-v2/route.ts", "utf8");
  assert.match(route, /new Response\(new Uint8Array\(jpeg\)/);
  assert.match(route, /image\/jpeg/);
  assert.doesNotMatch(route, /new ImageResponse\\(/);
});

test("Open Graph and X cards reference the versioned image URL", () => {
  const layout = readFileSync("src/app/layout.tsx", "utf8");
  assert.match(layout, /url: "\/og-image-v2"/);
  assert.match(layout, /card: "summary_large_image"/);
  assert.match(layout, /type: "image\/jpeg"/);
});
