import { Header } from "@/components/auto/header";
import { NewsCard } from "@/components/auto/news-card";
import { PaginationNav } from "@/components/auto/pagination-nav";
import { Sidebar } from "@/components/auto/sidebar";

type CardNews = {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  mobileDate?: string;
  views: string;
  category: string;
  href: string;
};

type PopularNewsItem = {
  title: string;
  image: string;
  views: string;
  href: string;
};

type AutoNewsHomeProps = {
  featuredNews: CardNews | null;
  newsList: CardNews[];
  popularNews: PopularNewsItem[];
  currentPage?: number;
  totalPages?: number;
  heading?: string;
  firstPageHref?: string;
  pageHrefPrefix?: string;
};

export function AutoNewsHome({
  featuredNews,
  newsList,
  popularNews,
  currentPage = 1,
  totalPages = 1,
  heading = "Останні новини",
  firstPageHref = "/",
  pageHrefPrefix = "/news/page"
}: AutoNewsHomeProps) {
  const shouldShowPagination = totalPages > 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-8">
            {featuredNews ? <NewsCard {...featuredNews} featured /> : null}

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">{heading}</h2>
              <div className="space-y-4">
                {newsList.map((news) => (
                  <NewsCard key={news.href} {...news} />
                ))}
              </div>

              {shouldShowPagination ? (
                <PaginationNav
                  currentPage={currentPage}
                  totalPages={totalPages}
                  buildHref={(page) =>
                    page === 1 ? firstPageHref : `${pageHrefPrefix}/${page}`
                  }
                />
              ) : null}
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Sidebar popularNews={popularNews} />
            </div>
          </aside>
        </div>
      </main>

      <footer className="bg-gray-900 text-white mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="text-xl font-bold text-blue-500">AUTO</div>
                <div className="text-xl font-bold">NEWS</div>
              </div>
              <p className="text-sm text-gray-400">
                Ваше джерело останніх новин автомобільного світу.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 AutoNews. Всі права захищено.
          </div>
        </div>
      </footer>
    </div>
  );
}
