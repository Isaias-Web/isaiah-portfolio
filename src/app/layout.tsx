import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/system/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { SmoothScrollProvider } from "@/components/SmoothScrollContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import RecentActivityDock from "@/components/RecentActivityDock";

const siteUrl = "https://isaiasfrutos.dev";
const siteTitle = "Isaías Frutos | Desarrollo full-stack, eCommerce y automatización";
const siteDescription =
  "Desarrollo full-stack, eCommerce e integraciones. Experiencia en plataformas institucionales, automatización e ingeniería asistida por IA. Proyectos de Isaías Frutos.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_MX",
    url: siteUrl,
    siteName: "Isaías Frutos",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image-v2",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Isaías Frutos — Desarrollo Full-Stack, eCommerce e Integración con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/og-image-v2",
        alt: "Isaías Frutos — Desarrollo Full-Stack, eCommerce e Integración con IA",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-MX" suppressHydrationWarning>
      <body>
        <SmoothScrollProvider>
          <CustomCursor />
          <SmoothScroll>{children}</SmoothScroll>
          <WhatsAppButton />
          <RecentActivityDock />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
