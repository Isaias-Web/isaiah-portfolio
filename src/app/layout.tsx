import type { Metadata } from "next";
import "./globals.css";
import CustomCursor from "@/components/system/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { SmoothScrollProvider } from "@/components/SmoothScrollContext";
import WhatsAppButton from "@/components/WhatsAppButton";

const siteUrl = "https://isaiasfrutos.dev";
const siteTitle = "Isaías Frutos | Full-Stack Developer & Digital Solutions Architect";
const siteDescription =
  "Desarrollo web, eCommerce y soluciones digitales. Explora los proyectos, tecnologías y experiencia de Isaías Frutos en Next.js, Shopify y desarrollo de sistemas.";

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
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
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
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
