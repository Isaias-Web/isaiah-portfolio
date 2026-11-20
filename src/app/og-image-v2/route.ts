import { socialOpenGraphArtworkBase64 } from "@/lib/socialOpenGraphArtwork";

// Serve the approved raster file directly. Avoid decoding a WebP data URI
// through Next ImageResponse/Satori: the previous image rendered as a flat orange card.
export const runtime = "nodejs";

export function GET() {
  const jpeg = Buffer.from(socialOpenGraphArtworkBase64, "base64");

  return new Response(new Uint8Array(jpeg), {
    headers: {
      "Content-Type": "image/jpeg",
      "Content-Length": String(jpeg.byteLength),
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
