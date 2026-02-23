import Link from "next/link";
import { PopularNewsList } from "@/components/news/popular-news-list";
import type { CategoryCount, NewsItem } from "@/types/news";

type NewsSidebarProps = {
  categories: CategoryCount[];
  popular: NewsItem[];
};

export function NewsSidebar({ categories, popular }: NewsSidebarProps) {
  return (
    <aside className="news-sidebar">
      <PopularNewsList items={popular} />

      <section className="sidebar-card">
        <h3>Categories</h3>
        <ul className="category-list">
          {categories.map((category) => (
            <li key={category.category}>
              <Link href={`/category/${encodeURIComponent(category.category)}`}>
                <span>{category.category}</span>
                <span>{category.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
