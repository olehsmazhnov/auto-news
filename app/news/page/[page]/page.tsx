import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { AutoNewsHome } from "@/components/auto/auto-news-home";
import { formatPublishedDate, formatPublishedDateCompact } from "@/lib/formatters";
import { NEWS_PAGE_SIZE } from "@/lib/news/constants";
import { getLatestNewsPage, getNewsTotalCount, getPopularNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

const MAX_STATIC_PAGINATION_PAGES = 50;

type NewsPageProps = {
  params: Promise<{
    page: string;
  }>;
};

export const revalidate = 120;

function parsePageNumber(rawPage: string): number | null {
  const page = Number(rawPage);

  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
}

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

export async function generateStaticParams() {
  const totalCount = await getNewsTotalCount();
  const totalPages = Math.max(1, Math.ceil(totalCount / NEWS_PAGE_SIZE));
  const pagesToGenerate = Math.min(totalPages, MAX_STATIC_PAGINATION_PAGES);

  return Array.from({ length: Math.max(0, pagesToGenerate - 1) }, (_, index) => ({
    page: String(index + 2)
  }));
}

export async function generateMetadata({ params }: NewsPageProps): Promise<Metadata> {
  const { page: rawPage } = await params;
  const page = parsePageNumber(rawPage);

  if (!page || page < 2) {
    return {
      title: "Сторінку не знайдено",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  return {
    title: `Останні новини - сторінка ${page}`,
    description: `Архів автоновин, сторінка ${page}.`,
    alternates: {
      canonical: `/news/page/${page}`
    }
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { page: rawPage } = await params;
  const page = parsePageNumber(rawPage);

  if (!page) {
    notFound();
  }

  if (page === 1) {
    permanentRedirect("/");
  }

  const [newsPage, popular] = await Promise.all([
    getLatestNewsPage(page, NEWS_PAGE_SIZE),
    getPopularNews(4)
  ]);

  if (newsPage.totalCount > 0 && page > newsPage.totalPages) {
    notFound();
  }

  if (newsPage.items.length === 0) {
    notFound();
  }

  const newsList = newsPage.items.map(mapNewsForCard);
  const popularNews = popular.map((item) => ({
    title: item.title,
    image: item.imageUrl,
    views: item.viewsLabel,
    href: `/news/${toNewsSlug(item)}`
  }));

  return (
    <AutoNewsHome
      featuredNews={null}
      newsList={newsList}
      popularNews={popularNews}
      currentPage={newsPage.page}
      totalPages={newsPage.totalPages}
      firstPageHref="/"
      pageHrefPrefix="/news/page"
    />
  );
}
