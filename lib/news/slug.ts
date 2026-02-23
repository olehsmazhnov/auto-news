import type { NewsItem } from "@/types/news";

const CYRILLIC_TO_LATIN_MAP: Record<string, string> = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  є: "ye",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  ї: "yi",
  й: "y",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
  ь: "",
  ъ: "",
  ы: "y",
  э: "e",
  ё: "yo",
  ю: "yu",
  я: "ya"
};

function transliterate(value: string): string {
  return value
    .split("")
    .map((char) => CYRILLIC_TO_LATIN_MAP[char] ?? char)
    .join("");
}

export function slugify(value: string): string {
  const transliterated = transliterate(value.toLowerCase())
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "");

  const normalized = transliterated
    .trim()
    .replace(/['"`’]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "news";
}

export function toNewsSlug(item: Pick<NewsItem, "title">): string {
  return slugify(item.title);
}

export function toLegacyNewsSlug(item: Pick<NewsItem, "id" | "title">): string {
  return `${slugify(item.title)}-${item.id}`;
}

export function parseLegacyNewsIdFromSlug(slug: string): number | null {
  const match = slug.match(/-(\d+)$/);

  if (!match) {
    return null;
  }

  const parsed = Number(match[1]);
  return Number.isInteger(parsed) ? parsed : null;
}
