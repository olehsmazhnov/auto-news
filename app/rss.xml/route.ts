import { env } from "@/lib/env";
import { getLatestNews } from "@/lib/news/news-repository";
import { toNewsSlug } from "@/lib/news/slug";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const latestNews = await getLatestNews(100);
  const buildDate = new Date().toUTCString();

  const itemsXml = latestNews
    .map((item) => {
      const articleUrl = `${env.siteUrl}/news/${toNewsSlug(item)}`;

      return `<item>
  <title>${escapeXml(item.title)}</title>
  <link>${escapeXml(articleUrl)}</link>
  <guid>${escapeXml(articleUrl)}</guid>
  <description>${escapeXml(item.excerpt)}</description>
  <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>AutoNews</title>
    <link>${escapeXml(env.siteUrl)}</link>
    <description>Останні новини автомобільної індустрії від AutoNews.</description>
    <language>uk-UA</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400"
    }
  });
}
