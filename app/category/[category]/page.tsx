import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AutoNewsHome } from "@/components/auto/auto-news-home";
import { mapNewsForCard, resolveCategoryFromSlug } from "@/app/category/helpers";
import { toCategorySlug } from "@/lib/news/category";
import {
  getCategoryCounts,
  getNewsByCategoryPage,
  getPopularNews
} from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const revalidate = 120;

export async function generateStaticParams() {
  const categories = await getCategoryCounts();

  return categories.map((category) => ({
    category: toCategorySlug(category.category)
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: categorySegment } = await params;
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
    title: `${resolvedCategory.category} - останні новини`,
    description: `Поточна стрічка новин у категорії ${resolvedCategory.category}.`,
    alternates: {
      canonical: `/category/${categorySlug}`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySegment } = await params;
  const categories = await getCategoryCounts();
  const resolvedCategory = resolveCategoryFromSlug(categorySegment, categories);

  if (!resolvedCategory) {
    notFound();
  }

  const categorySlug = toCategorySlug(resolvedCategory.category);
  const [categoryNewsPage, popular] = await Promise.all([
    getNewsByCategoryPage(resolvedCategory.category),
    getPopularNews(4)
  ]);

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
      currentPage={1}
      totalPages={categoryNewsPage.totalPages}
      heading={`Категорія: ${resolvedCategory.category}`}
      firstPageHref={`/category/${categorySlug}`}
      pageHrefPrefix={`/category/${categorySlug}/page`}
    />
  );
}
