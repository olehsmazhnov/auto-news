import { formatViewCount } from "@/lib/formatters";
import { DEFAULT_NEWS_CATEGORY } from "@/lib/news/constants";
import { splitSummaryAndSourceAttribution } from "@/lib/news/source-attribution";
import type { NewsItem } from "@/types/news";

type NewsRow = {
  id: number;
  title: string | null;
  excerpt: string | null;
  summary: string | null;
  source_url: string | null;
  image: string | null;
  image_url: string | null;
  date: string | null;
  published_at: string | null;
  views: string | null;
  view_count: number | null;
  category: string | null;
  is_featured: boolean | null;
  is_popular: boolean | null;
};

function normalizeDate(rawPublishedAt: string | null, rawDate: string | null): string {
  if (rawPublishedAt) {
    return rawPublishedAt;
  }

  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }

  return new Date().toISOString();
}

function normalizeImage(imageUrl: string | null, image: string | null): string {
  if (imageUrl) {
    return imageUrl;
  }

  if (image) {
    return image;
  }

  return "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80";
}

export function mapNewsRow(row: NewsRow): NewsItem {
  const viewCount = row.view_count ?? 0;
  const normalizedExcerpt = row.excerpt?.trim() || "";
  const summaryCandidate = row.summary?.trim() || normalizedExcerpt;
  const { summary: cleanedSummary, sourceAttributionUrl } = splitSummaryAndSourceAttribution(
    summaryCandidate,
    row.source_url,
  );
  const normalizedSummary = cleanedSummary || normalizedExcerpt || "No summary available.";
  const normalizedExcerptWithoutSource = splitSummaryAndSourceAttribution(
    normalizedExcerpt,
    null,
  ).summary;

  return {
    id: row.id,
    title: row.title?.trim() || "Untitled news",
    excerpt: normalizedExcerptWithoutSource || "No excerpt available yet.",
    summary: normalizedSummary,
    sourceAttributionUrl,
    imageUrl: normalizeImage(row.image_url, row.image),
    publishedAt: normalizeDate(row.published_at, row.date),
    viewsLabel: row.views || formatViewCount(viewCount),
    viewCount,
    category: DEFAULT_NEWS_CATEGORY,
    isFeatured: Boolean(row.is_featured),
    isPopular: Boolean(row.is_popular),
  };
}
