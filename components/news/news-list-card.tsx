import Image from "next/image";
import Link from "next/link";
import { formatPublishedDate } from "@/lib/formatters";
import { toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

type NewsListCardProps = {
  item: NewsItem;
};

export function NewsListCard({ item }: NewsListCardProps) {
  return (
    <article className="news-card">
      <Link href={`/news/${toNewsSlug(item)}`} className="news-card-image">
        <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 280px" />
      </Link>

      <div className="news-card-content">
        <Link href={`/category/${encodeURIComponent(item.category)}`} className="category-chip muted">
          {item.category}
        </Link>
        <h2>
          <Link href={`/news/${toNewsSlug(item)}`}>{item.title}</Link>
        </h2>
        <p>{item.excerpt}</p>
        <div className="meta-row">
          <span>{formatPublishedDate(item.publishedAt)}</span>
          <span>{item.viewsLabel} views</span>
        </div>
      </div>
    </article>
  );
}
