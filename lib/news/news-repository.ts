import { DEFAULT_NEWS_CATEGORY, NEWS_PAGE_SIZE } from "@/lib/news/constants";
import { fallbackNews } from "@/lib/news/fallback-news";
import { mapNewsRow } from "@/lib/news/news-mapper";
import { slugify } from "@/lib/news/slug";
import { getSupabaseClient } from "@/lib/supabase";
import type { CategoryCount, NewsItem } from "@/types/news";

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

type CategoryRow = {
  category: string | null;
};

export type PaginatedNewsResult = {
  items: NewsItem[];
  totalCount: number;
  totalPages: number;
  page: number;
  limit: number;
};

const NEWS_SELECT =
  "id,title,excerpt,summary,source_url,image,image_url,date,published_at,views,view_count,category,is_featured,is_popular";
const SLUG_LOOKUP_LIMIT = 2000;
const MAX_CATEGORY_ROWS = 5000;

function sortByDateDesc(news: NewsItem[]): NewsItem[] {
  return [...news].sort((a, b) => {
    const aTime = new Date(a.publishedAt).getTime();
    const bTime = new Date(b.publishedAt).getTime();
    if (bTime !== aTime) {
      return bTime - aTime;
    }

    return b.id - a.id;
  });
}

function sortedFallback(): NewsItem[] {
  return sortByDateDesc(fallbackNews);
}

function normalizePage(page: number): number {
  if (!Number.isFinite(page)) {
    return 1;
  }

  return Math.max(1, Math.floor(page));
}

function normalizeLimit(limit: number): number {
  if (!Number.isFinite(limit)) {
    return NEWS_PAGE_SIZE;
  }

  return Math.min(100, Math.max(1, Math.floor(limit)));
}

function normalizeCategoryKey(category: string): string {
  return category.trim().toLowerCase();
}

function toPaginatedResult(
  items: NewsItem[],
  totalCount: number,
  page: number,
  limit: number
): PaginatedNewsResult {
  const safeTotalCount = Math.max(0, totalCount);
  const totalPages = Math.max(1, Math.ceil(safeTotalCount / limit));
  const safePage = Math.min(page, totalPages);

  return {
    items,
    totalCount: safeTotalCount,
    totalPages,
    page: safePage,
    limit
  };
}

function aggregateCategoryCounts(items: Array<{ category: string | null | undefined }>): CategoryCount[] {
  const byCategory = new Map<string, { category: string; count: number }>();

  for (const item of items) {
    const rawCategory = item.category?.trim();

    if (!rawCategory) {
      continue;
    }

    const key = normalizeCategoryKey(rawCategory);
    const existing = byCategory.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      byCategory.set(key, {
        category: rawCategory,
        count: 1
      });
    }
  }

  if (byCategory.size === 0) {
    return [
      {
        category: DEFAULT_NEWS_CATEGORY,
        count: items.length
      }
    ];
  }

  return [...byCategory.values()].sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }

    return a.category.localeCompare(b.category);
  });
}

function getFallbackById(id: number): NewsItem | null {
  return fallbackNews.find((item) => item.id === id) ?? null;
}

function getFallbackBySlug(slug: string): NewsItem | null {
  const normalizedSlug = slugify(slug);
  return sortedFallback().find((item) => slugify(item.title) === normalizedSlug) ?? null;
}

function getFallbackCategoryCounts(): CategoryCount[] {
  return aggregateCategoryCounts(fallbackNews);
}

function getFallbackCategoryPage(category: string, page: number, limit: number): PaginatedNewsResult {
  const normalizedCategory = normalizeCategoryKey(category);
  const itemsInCategory = sortedFallback().filter(
    (item) => normalizeCategoryKey(item.category) === normalizedCategory
  );
  const offset = (page - 1) * limit;
  const pagedItems = itemsInCategory.slice(offset, offset + limit);

  return toPaginatedResult(pagedItems, itemsInCategory.length, page, limit);
}

export async function getNewsTotalCount(): Promise<number> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback().length;
  }

  const { count, error } = await supabase
    .from("news_items")
    .select("id", { head: true, count: "exact" });

  if (error || typeof count !== "number") {
    return sortedFallback().length;
  }

  return count;
}

export async function getLatestNewsPage(page = 1, limit = NEWS_PAGE_SIZE): Promise<PaginatedNewsResult> {
  const safePage = normalizePage(page);
  const safeLimit = normalizeLimit(limit);
  const offset = (safePage - 1) * safeLimit;
  const supabase = getSupabaseClient();

  if (!supabase) {
    const fallbackItems = sortedFallback();
    const pagedItems = fallbackItems.slice(offset, offset + safeLimit);
    return toPaginatedResult(pagedItems, fallbackItems.length, safePage, safeLimit);
  }

  const { data, error, count } = await supabase
    .from("news_items")
    .select(NEWS_SELECT, { count: "exact" })
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + safeLimit - 1);

  if (error || !data) {
    const fallbackItems = sortedFallback();
    const pagedItems = fallbackItems.slice(offset, offset + safeLimit);
    return toPaginatedResult(pagedItems, fallbackItems.length, safePage, safeLimit);
  }

  const mappedItems = data.map((row) => mapNewsRow(row as NewsRow));
  const totalCount = typeof count === "number" ? count : mappedItems.length;

  return toPaginatedResult(mappedItems, totalCount, safePage, safeLimit);
}

export async function getLatestNews(limit = NEWS_PAGE_SIZE): Promise<NewsItem[]> {
  const result = await getLatestNewsPage(1, limit);
  return result.items;
}

export async function getFeaturedNews(): Promise<NewsItem | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback().find((item) => item.isFeatured) ?? sortedFallback()[0] ?? null;
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    const latest = await getLatestNews(1);
    return latest[0] ?? null;
  }

  return mapNewsRow(data as NewsRow);
}

export async function getPopularNews(limit = 5): Promise<NewsItem[]> {
  const safeLimit = normalizeLimit(limit);
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortByDateDesc(fallbackNews)
      .filter((item) => item.isPopular)
      .slice(0, safeLimit);
  }

  const popularResult = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .eq("is_popular", true)
    .order("published_at", { ascending: false })
    .limit(safeLimit);

  if (!popularResult.error && popularResult.data && popularResult.data.length > 0) {
    return popularResult.data.map((row) => mapNewsRow(row as NewsRow));
  }

  const fallbackResult = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .order("view_count", { ascending: false })
    .limit(safeLimit);

  if (fallbackResult.error || !fallbackResult.data) {
    return sortByDateDesc(fallbackNews)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, safeLimit);
  }

  return fallbackResult.data.map((row) => mapNewsRow(row as NewsRow));
}

export async function getNewsById(id: number): Promise<NewsItem | null> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getFallbackById(id);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .eq("id", id)
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return getFallbackById(id);
  }

  return mapNewsRow(data as NewsRow);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const normalizedSlug = slugify(slug);
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getFallbackBySlug(normalizedSlug);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .order("published_at", { ascending: false })
    .limit(SLUG_LOOKUP_LIMIT);

  if (error || !data) {
    return getFallbackBySlug(normalizedSlug);
  }

  const match = data
    .map((row) => mapNewsRow(row as NewsRow))
    .find((item) => slugify(item.title) === normalizedSlug);

  return match ?? getFallbackBySlug(normalizedSlug);
}

export async function getRelatedNews(excludedId: number, limit = 4): Promise<NewsItem[]> {
  const safeLimit = normalizeLimit(limit);
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback()
      .filter((item) => item.id !== excludedId)
      .slice(0, safeLimit);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .neq("id", excludedId)
    .order("published_at", { ascending: false })
    .limit(safeLimit);

  if (error || !data) {
    return sortedFallback()
      .filter((item) => item.id !== excludedId)
      .slice(0, safeLimit);
  }

  return data.map((row) => mapNewsRow(row as NewsRow));
}

export async function getNewsByCategoryPage(
  category: string,
  page = 1,
  limit = NEWS_PAGE_SIZE
): Promise<PaginatedNewsResult> {
  const safePage = normalizePage(page);
  const safeLimit = normalizeLimit(limit);
  const normalizedCategory = normalizeCategoryKey(category);
  const offset = (safePage - 1) * safeLimit;
  const supabase = getSupabaseClient();

  if (!normalizedCategory) {
    return toPaginatedResult([], 0, safePage, safeLimit);
  }

  if (!supabase) {
    return getFallbackCategoryPage(normalizedCategory, safePage, safeLimit);
  }

  const { data, error, count } = await supabase
    .from("news_items")
    .select(NEWS_SELECT, { count: "exact" })
    .ilike("category", normalizedCategory)
    .order("published_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + safeLimit - 1);

  if (error || !data) {
    return getFallbackCategoryPage(normalizedCategory, safePage, safeLimit);
  }

  const mappedItems = data.map((row) => mapNewsRow(row as NewsRow));
  const totalCount = typeof count === "number" ? count : mappedItems.length;

  return toPaginatedResult(mappedItems, totalCount, safePage, safeLimit);
}

export async function getNewsByCategory(category: string, limit = 24): Promise<NewsItem[]> {
  const result = await getNewsByCategoryPage(category, 1, limit);
  return result.items;
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getFallbackCategoryCounts();
  }

  const { data, error } = await supabase
    .from("news_items")
    .select("category")
    .order("published_at", { ascending: false })
    .limit(MAX_CATEGORY_ROWS);

  if (error || !data) {
    return getFallbackCategoryCounts();
  }

  const counts = aggregateCategoryCounts(data as CategoryRow[]);

  if (counts.length === 0) {
    return getFallbackCategoryCounts();
  }

  return counts;
}
