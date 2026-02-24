import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { AutoNewsHome } from "@/components/auto/auto-news-home";
import { mapNewsForCard, resolveCategoryFromSlug } from "@/app/category/helpers";
import { NEWS_PAGE_SIZE } from "@/lib/news/constants";
import { toCategorySlug } from "@/lib/news/category";
import {
  getCategoryCounts,
  getNewsByCategoryPage,
  getPopularNews
} from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

const MAX_STATIC_CATEGORY_PAGES = 20;

type CategoryPaginationPageProps = {
  params: Promise<{
    category: string;
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

export async function generateStaticParams() {
  const categories = await getCategoryCounts();
  const params: Array<{ category: string; page: string }> = [];

  for (const category of categories) {
    const categorySlug = toCategorySlug(category.category);
    const totalPages = Math.max(1, Math.ceil(category.count / NEWS_PAGE_SIZE));
    const pagesToGenerate = Math.min(totalPages, MAX_STATIC_CATEGORY_PAGES);

    for (let page = 2; page <= pagesToGenerate; page += 1) {
      params.push({
        category: categorySlug,
        page: String(page)
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params
}: CategoryPaginationPageProps): Promise<Metadata> {
  const { category: categorySegment, page: rawPage } = await params;
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

  const categories = await getCategoryCounts();
  const resolvedCategory = resolveCategoryFromSlug(categorySegment, categories);

  if (!resolvedCategory) {
    return {
      title: "Категорію не знайдено",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const categorySlug = toCategorySlug(resolvedCategory.category);

  return {
    title: `${resolvedCategory.category} - сторінка ${page}`,
    description: `Архів категорії ${resolvedCategory.category}, сторінка ${page}.`,
    alternates: {
      canonical: `/category/${categorySlug}/page/${page}`
    }
  };
}

export default async function CategoryPaginationPage({
  params
}: CategoryPaginationPageProps) {
  const { category: categorySegment, page: rawPage } = await params;
  const page = parsePageNumber(rawPage);

  if (!page) {
    notFound();
  }

  const categories = await getCategoryCounts();
  const resolvedCategory = resolveCategoryFromSlug(categorySegment, categories);

  if (!resolvedCategory) {
    notFound();
  }

  const categorySlug = toCategorySlug(resolvedCategory.category);

  if (page === 1) {
    permanentRedirect(`/category/${categorySlug}`);
  }

  const [categoryNewsPage, popular] = await Promise.all([
    getNewsByCategoryPage(resolvedCategory.category, page, NEWS_PAGE_SIZE),
    getPopularNews(4)
  ]);

  if (categoryNewsPage.totalCount > 0 && page > categoryNewsPage.totalPages) {
    notFound();
  }

  if (categoryNewsPage.items.length === 0) {
    notFound();
  }

  const newsList = categoryNewsPage.items.map(mapNewsForCard);
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
      currentPage={categoryNewsPage.page}
      totalPages={categoryNewsPage.totalPages}
      heading={`Категорія: ${resolvedCategory.category}`}
      firstPageHref={`/category/${categorySlug}`}
      pageHrefPrefix={`/category/${categorySlug}/page`}
    />
  );
}
