import { ImageResponse } from "next/og";
import { socialOpenGraphArtworkBase64 } from "@/lib/socialOpenGraphArtwork";

export const runtime = "nodejs";
export const alt =
  "Isaías Frutos — Desarrollo Full-Stack, eCommerce e Integración con IA";
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundColor: "#ff2d00",
        }}
      >
        {/* Artwork from the approved user-supplied social-media image. */}
        <img
          src={`data:image/webp;base64,${socialOpenGraphArtworkBase64}`}
          width={size.width}
          height={size.height}
          alt={alt}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>
    ),
    size,
  );
}
