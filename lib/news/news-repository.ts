import { DEFAULT_NEWS_CATEGORY } from "@/lib/news/constants";
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

const NEWS_SELECT =
  "id,title,excerpt,summary,source_url,image,image_url,date,published_at,views,view_count,category,is_featured,is_popular";
const SLUG_LOOKUP_LIMIT = 2000;
const DEFAULT_CATEGORY_KEY = DEFAULT_NEWS_CATEGORY.toLowerCase();

function sortByDateDesc(news: NewsItem[]): NewsItem[] {
  return [...news].sort((a, b) => {
    const aTime = new Date(a.publishedAt).getTime();
    const bTime = new Date(b.publishedAt).getTime();
    return bTime - aTime;
  });
}

function sortedFallback(): NewsItem[] {
  return sortByDateDesc(fallbackNews);
}

function getFallbackById(id: number): NewsItem | null {
  return fallbackNews.find((item) => item.id === id) ?? null;
}

function getFallbackBySlug(slug: string): NewsItem | null {
  const normalizedSlug = slugify(slug);
  return sortedFallback().find((item) => slugify(item.title) === normalizedSlug) ?? null;
}

function getFallbackCategoryCounts(): CategoryCount[] {
  return [
    {
      category: DEFAULT_NEWS_CATEGORY,
      count: fallbackNews.length,
    },
  ];
}

function normalizeCategoryKey(category: string): string {
  return category.trim().toLowerCase();
}

function isDefaultNewsCategory(category: string): boolean {
  return normalizeCategoryKey(category) === DEFAULT_CATEGORY_KEY;
}

export async function getLatestNews(limit = 12): Promise<NewsItem[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback().slice(0, limit);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return sortedFallback().slice(0, limit);
  }

  return data.map((row) => mapNewsRow(row as NewsRow));
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
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortByDateDesc(fallbackNews)
      .filter((item) => item.isPopular)
      .slice(0, limit);
  }

  const popularResult = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .eq("is_popular", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (!popularResult.error && popularResult.data && popularResult.data.length > 0) {
    return popularResult.data.map((row) => mapNewsRow(row as NewsRow));
  }

  const fallbackResult = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .order("view_count", { ascending: false })
    .limit(limit);

  if (fallbackResult.error || !fallbackResult.data) {
    return sortByDateDesc(fallbackNews)
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, limit);
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
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback()
      .filter((item) => item.id !== excludedId)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .neq("id", excludedId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return sortedFallback()
      .filter((item) => item.id !== excludedId)
      .slice(0, limit);
  }

  return data.map((row) => mapNewsRow(row as NewsRow));
}

export async function getNewsByCategory(category: string, limit = 24): Promise<NewsItem[]> {
  if (!isDefaultNewsCategory(category)) {
    return [];
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback().slice(0, limit);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return sortedFallback().slice(0, limit);
  }

  return data.map((row) => mapNewsRow(row as NewsRow));
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getFallbackCategoryCounts();
  }

  const { count, error } = await supabase
    .from("news_items")
    .select("id", { head: true, count: "exact" });

  if (error || typeof count !== "number") {
    return getFallbackCategoryCounts();
  }

  return [
    {
      category: DEFAULT_NEWS_CATEGORY,
      count,
    },
  ];
}
