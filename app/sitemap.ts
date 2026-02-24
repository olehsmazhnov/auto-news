import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getLatestNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getLatestNews(100);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: env.siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
  ];

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${env.siteUrl}/news/${toNewsSlug(item)}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [...staticRoutes, ...newsRoutes];
}
