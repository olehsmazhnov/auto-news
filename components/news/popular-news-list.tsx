import Link from "next/link";
import { toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

type PopularNewsListProps = {
  items: NewsItem[];
};

export function PopularNewsList({ items }: PopularNewsListProps) {
  return (
    <section className="sidebar-card">
      <h3>Популярне</h3>
      <ul className="popular-list">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/news/${toNewsSlug(item)}`}>{item.title}</Link>
            <span>{item.viewsLabel} переглядів</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
