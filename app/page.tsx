import { AutoNewsHome } from "@/components/auto/auto-news-home";
import { formatPublishedDate, formatPublishedDateCompact } from "@/lib/formatters";
import { NEWS_PAGE_SIZE } from "@/lib/news/constants";
import { getFeaturedNews, getLatestNewsPage, getPopularNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

export const revalidate = 120;

function mapNewsForCard(item: NewsItem) {
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

export default async function HomePage() {
  const [featuredFromDb, latestPage, popular] = await Promise.all([
    getFeaturedNews(),
    getLatestNewsPage(1, NEWS_PAGE_SIZE + 1),
    getPopularNews(4)
  ]);

  const featuredItem = featuredFromDb ?? latestPage.items[0] ?? null;
  const featuredNews = featuredItem ? mapNewsForCard(featuredItem) : null;
  const newsList = latestPage.items
    .filter((item) => (featuredItem ? item.id !== featuredItem.id : true))
    .slice(0, NEWS_PAGE_SIZE)
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
      currentPage={1}
      totalPages={latestPage.totalPages}
      firstPageHref="/"
      pageHrefPrefix="/news/page"
    />
  );
}
