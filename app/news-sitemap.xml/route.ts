import { env } from "@/lib/env";
import { SITEMAP_NEWS_LIMIT } from "@/lib/news/constants";
import { getLatestNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

export const revalidate = 3600;

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const latestNews = await getLatestNews(SITEMAP_NEWS_LIMIT);
  const now = Date.now();

  const freshNews = latestNews
    .filter((item) => now - new Date(item.publishedAt).getTime() <= TWO_DAYS_MS)
    .slice(0, 1000);

  const items = (freshNews.length > 0 ? freshNews : latestNews).slice(0, 1000);

  const urlsXml = items
    .map((item) => {
      const articleUrl = `${env.siteUrl}/news/${toNewsSlug(item)}`;
      const publicationDate = new Date(item.publishedAt).toISOString();

      return `<url>
  <loc>${escapeXml(articleUrl)}</loc>
  <news:news>
    <news:publication>
      <news:name>AutoNews</news:name>
      <news:language>uk</news:language>
    </news:publication>
    <news:publication_date>${publicationDate}</news:publication_date>
    <news:title>${escapeXml(item.title)}</news:title>
  </news:news>
</url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urlsXml}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
