import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { getCategoryCounts, getLatestNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, categories] = await Promise.all([getLatestNews(100), getCategoryCounts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: env.siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1
    }
  ];

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${env.siteUrl}/news/${toNewsSlug(item)}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: "daily",
    priority: 0.8
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((item) => ({
    url: `${env.siteUrl}/category/${encodeURIComponent(item.category)}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.7
  }));

  return [...staticRoutes, ...newsRoutes, ...categoryRoutes];
}
