import Image from "next/image";
import Link from "next/link";
import { formatPublishedDate } from "@/lib/formatters";
import { toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

type FeaturedNewsCardProps = {
  item: NewsItem;
};

export function FeaturedNewsCard({ item }: FeaturedNewsCardProps) {
  return (
    <article className="featured-card">
      <Link href={`/news/${toNewsSlug(item)}`} className="featured-media">
        <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 1024px) 100vw, 760px" priority />
      </Link>

      <div className="featured-content">
        <Link href={`/category/${encodeURIComponent(item.category)}`} className="category-chip">
          {item.category}
        </Link>
        <h1>
          <Link href={`/news/${toNewsSlug(item)}`}>{item.title}</Link>
        </h1>
        <p>{item.excerpt}</p>
        <div className="meta-row">
          <span>{formatPublishedDate(item.publishedAt)}</span>
          <span>{item.viewsLabel} views</span>
        </div>
      </div>
    </article>
  );
}
