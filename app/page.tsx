import { AutoNewsHome } from "@/components/auto/auto-news-home";
import { formatPublishedDate } from "@/lib/formatters";
import { getFeaturedNews, getLatestNews, getPopularNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

export const revalidate = 120;

function mapNewsForCard(item: NewsItem) {
  return {
    title: item.title,
    excerpt: item.excerpt,
    image: item.imageUrl,
    date: formatPublishedDate(item.publishedAt),
    views: item.viewsLabel,
    category: item.category,
    href: `/news/${toNewsSlug(item)}`
  };
}

export default async function HomePage() {
  const [featuredFromDb, latest, popular] = await Promise.all([
    getFeaturedNews(),
    getLatestNews(30),
    getPopularNews(4)
  ]);

  const featuredItem = featuredFromDb ?? latest[0] ?? null;
  const featuredNews = featuredItem ? mapNewsForCard(featuredItem) : null;
  const newsList = latest
    .filter((item) => (featuredItem ? item.id !== featuredItem.id : true))
    .map(mapNewsForCard);

  const popularNews = popular.map((item) => ({
    title: item.title,
    image: item.imageUrl,
    views: item.viewsLabel,
    href: `/news/${toNewsSlug(item)}`
  }));

  return (
    <AutoNewsHome
      featuredNews={featuredNews}
      newsList={newsList}
      popularNews={popularNews}
    />
  );
}
