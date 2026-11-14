import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://isaiasfrutos.dev/sitemap.xml",
    host: "https://isaiasfrutos.dev",
  };
}
