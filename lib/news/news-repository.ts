import { getSupabaseClient } from "@/lib/supabase";
import { fallbackNews } from "@/lib/news/fallback-news";
import { mapNewsRow } from "@/lib/news/news-mapper";
import type { CategoryCount, NewsItem } from "@/types/news";

type NewsRow = {
  id: number;
  title: string | null;
  excerpt: string | null;
  summary: string | null;
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
  "id,title,excerpt,summary,image,image_url,date,published_at,views,view_count,category,is_featured,is_popular";

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

function getFallbackCategoryCounts(): CategoryCount[] {
  const counts = fallbackNews.reduce<Record<string, number>>((acc, item) => {
    acc[item.category] = (acc[item.category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
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

export async function getRelatedNews(category: string, excludedId: number, limit = 4): Promise<NewsItem[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback()
      .filter((item) => item.category === category && item.id !== excludedId)
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .eq("category", category)
    .neq("id", excludedId)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return sortedFallback()
      .filter((item) => item.category === category && item.id !== excludedId)
      .slice(0, limit);
  }

  return data.map((row) => mapNewsRow(row as NewsRow));
}

export async function getNewsByCategory(category: string, limit = 24): Promise<NewsItem[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return sortedFallback()
      .filter((item) => item.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }

  const { data, error } = await supabase
    .from("news_items")
    .select(NEWS_SELECT)
    .ilike("category", category)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    return sortedFallback()
      .filter((item) => item.category.toLowerCase() === category.toLowerCase())
      .slice(0, limit);
  }

  return data.map((row) => mapNewsRow(row as NewsRow));
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return getFallbackCategoryCounts();
  }

  const { data, error } = await supabase.from("news_items").select("category");

  if (error || !data) {
    return getFallbackCategoryCounts();
  }

  const counts = data.reduce<Record<string, number>>((acc, row) => {
    const category = (row.category as string | null)?.trim();

    if (!category) {
      return acc;
    }

    acc[category] = (acc[category] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
