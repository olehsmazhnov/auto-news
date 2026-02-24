import { slugify } from "@/lib/news/slug";

export function toCategorySlug(category: string): string {
  return slugify(category);
}

export function normalizeCategorySegment(categorySegment: string): string {
  try {
    return slugify(decodeURIComponent(categorySegment));
  } catch {
    return slugify(categorySegment);
  }
}
