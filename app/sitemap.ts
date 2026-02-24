import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { toCategorySlug } from "@/lib/news/category";
import { NEWS_PAGE_SIZE, SITEMAP_NEWS_LIMIT } from "@/lib/news/constants";
import { getCategoryCounts, getLatestNews, getNewsTotalCount } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, totalCount, categoryCounts] = await Promise.all([
    getLatestNews(SITEMAP_NEWS_LIMIT),
    getNewsTotalCount(),
    getCategoryCounts()
  ]);
  const totalPages = Math.max(1, Math.ceil(totalCount / NEWS_PAGE_SIZE));

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: env.siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${env.siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    },
    {
      url: `${env.siteUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7
    },
    {
      url: `${env.siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5
    }
  ];

  const paginatedNewsRoutes: MetadataRoute.Sitemap = Array.from(
    { length: Math.max(0, totalPages - 1) },
    (_, index) => ({
      url: `${env.siteUrl}/news/page/${index + 2}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.7
    })
  );

  const uniqueCategorySlugs = [...new Set(categoryCounts.map((item) => toCategorySlug(item.category)))];
  const categoryRoutes: MetadataRoute.Sitemap = uniqueCategorySlugs.map((categorySlug) => ({
    url: `${env.siteUrl}/category/${categorySlug}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.7
  }));

  const categoryPaginatedRoutes: MetadataRoute.Sitemap = categoryCounts.flatMap((category) => {
    const totalCategoryPages = Math.max(1, Math.ceil(category.count / NEWS_PAGE_SIZE));
    const categorySlug = toCategorySlug(category.category);

    return Array.from({ length: Math.max(0, totalCategoryPages - 1) }, (_, index) => ({
      url: `${env.siteUrl}/category/${categorySlug}/page/${index + 2}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.6
    }));
  });

  const newsRoutes: MetadataRoute.Sitemap = news.map((item) => ({
    url: `${env.siteUrl}/news/${toNewsSlug(item)}`,
    lastModified: new Date(item.publishedAt),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...categoryPaginatedRoutes,
    ...paginatedNewsRoutes,
    ...newsRoutes
  ];
}
