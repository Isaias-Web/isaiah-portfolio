import { heroComicPreviewBase64 } from "@/lib/heroComicPreview";

// Serves an optimized version of the user-supplied artwork in this preview branch.
// The original site assets and production hero remain untouched.
export const runtime = "nodejs";

export function GET() {
  const webp = Buffer.from(heroComicPreviewBase64, "base64");

  return new Response(new Uint8Array(webp), {
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(webp.byteLength),
      "Cache-Control": "public, max-age=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
