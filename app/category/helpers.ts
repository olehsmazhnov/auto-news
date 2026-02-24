import { formatPublishedDate, formatPublishedDateCompact } from "@/lib/formatters";
import { normalizeCategorySegment, toCategorySlug } from "@/lib/news/category";
import type { CategoryCount, NewsItem } from "@/types/news";
import { toNewsSlug } from "@/lib/news/slug";

export function resolveCategoryFromSlug(
  categorySegment: string,
  categories: CategoryCount[]
): CategoryCount | null {
  const normalizedSegment = normalizeCategorySegment(categorySegment);

  return categories.find((category) => toCategorySlug(category.category) === normalizedSegment) ?? null;
}

export function mapNewsForCard(item: NewsItem) {
  return {
    title: item.title,
    excerpt: item.excerpt,
    image: item.imageUrl,
    date: formatPublishedDate(item.publishedAt),
    mobileDate: formatPublishedDateCompact(item.publishedAt),
    views: item.viewsLabel,
    category: item.category,
    href: `/news/${toNewsSlug(item)}`
  };
}
