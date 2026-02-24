import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: [
      `${env.siteUrl}/sitemap.xml`,
      `${env.siteUrl}/news-sitemap.xml`,
      `${env.siteUrl}/rss.xml`
    ]
  };
}
