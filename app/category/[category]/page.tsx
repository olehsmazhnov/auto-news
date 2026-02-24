import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsListCard } from "@/components/news/news-list-card";
import { NewsSidebar } from "@/components/news/news-sidebar";
import { getCategoryCounts, getNewsByCategory, getPopularNews } from "@/lib/news/news-repository";

type CategoryPageProps = {
  params: Promise<{
    category: string;
  }>;
};

export const revalidate = 120;

function decodeCategoryParam(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category: encodedCategory } = await params;
  const category = decodeCategoryParam(encodedCategory);

  return {
    title: `${category} News`,
    description: `Latest automotive stories in ${category}.`,
    alternates: {
      canonical: `/category/${encodeURIComponent(category)}`
    }
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: encodedCategory } = await params;
  const category = decodeCategoryParam(encodedCategory);

  const [items, categoryCounts, popular] = await Promise.all([
    getNewsByCategory(category, 24),
    getCategoryCounts(),
    getPopularNews(5)
  ]);

  return (
    <>
      <SiteHeader categories={categoryCounts.map((item) => item.category)} />

      <main className="container page-grid">
        <section className="main-feed section-block">
          <div className="section-head">
            <h1>{category}</h1>
            <p>{items.length} stories found.</p>
          </div>

          {items.length > 0 ? (
            <div className="news-stack">
              {items.map((item) => (
                <NewsListCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <p>No stories available for this category yet.</p>
          )}
        </section>

        <NewsSidebar categories={categoryCounts} popular={popular} />
      </main>

      <SiteFooter />
    </>
  );
}
