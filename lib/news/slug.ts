import type { NewsItem } from "@/types/news";

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function toNewsSlug(item: Pick<NewsItem, "id" | "title">): string {
  return `${slugify(item.title)}-${item.id}`;
}

export function parseNewsIdFromSlug(slug: string): number | null {
  const segments = slug.split("-");
  const idPart = segments.at(-1);

  if (!idPart) {
    return null;
  }

  const parsed = Number(idPart);
  return Number.isInteger(parsed) ? parsed : null;
}
