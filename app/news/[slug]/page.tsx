import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Header } from "@/components/auto/header";
import { NewsCard } from "@/components/auto/news-card";
import { Sidebar } from "@/components/auto/sidebar";
import { env } from "@/lib/env";
import { formatPublishedDate, formatPublishedDateCompact } from "@/lib/formatters";
import { toCategorySlug } from "@/lib/news/category";
import { getLatestNews, getNewsById, getNewsBySlug, getPopularNews, getRelatedNews } from "@/lib/news/news-repository";
import { parseLegacyNewsIdFromSlug, toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 120;

const FALLBACK_ARTICLE_IMAGE_URL =
  "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1400&q=80";

function getArticleUrl(slug: string): string {
  return `${env.siteUrl}/news/${slug}`;
}

function normalizeArticleImageUrl(rawUrl: string): string {
  if (!rawUrl) {
    return FALLBACK_ARTICLE_IMAGE_URL;
  }

  if (rawUrl.startsWith("/")) {
    return rawUrl;
  }

  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "https:" ? rawUrl : FALLBACK_ARTICLE_IMAGE_URL;
  } catch {
    return FALLBACK_ARTICLE_IMAGE_URL;
  }
}

function toAbsoluteSiteUrl(pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl, env.siteUrl).toString();
  } catch {
    return FALLBACK_ARTICLE_IMAGE_URL;
  }
}

function withImageSize(url: string, width: number, height: number): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.set("w", String(width));
    parsed.searchParams.set("h", String(height));
    parsed.searchParams.set("fit", "crop");
    return parsed.toString();
  } catch {
    return url;
  }
}

function buildArticleImageVariants(absoluteUrl: string): string[] {
  const variants = [
    absoluteUrl,
    withImageSize(absoluteUrl, 1200, 675),
    withImageSize(absoluteUrl, 1200, 900),
    withImageSize(absoluteUrl, 1200, 1200)
  ];

  return [...new Set(variants)];
}

type ResolvedArticle = {
  article: NewsItem | null;
  canonicalSlug: string | null;
  shouldRedirect: boolean;
};

async function resolveArticleBySlug(slug: string): Promise<ResolvedArticle> {
  const articleFromSlug = await getNewsBySlug(slug);

  if (articleFromSlug) {
    const canonicalSlug = toNewsSlug(articleFromSlug);

    return {
      article: articleFromSlug,
      canonicalSlug,
      shouldRedirect: slug !== canonicalSlug
    };
  }

  const legacyId = parseLegacyNewsIdFromSlug(slug);

  if (!legacyId) {
    return {
      article: null,
      canonicalSlug: null,
      shouldRedirect: false
    };
  }

  const legacyArticle = await getNewsById(legacyId);

  if (!legacyArticle) {
    return {
      article: null,
      canonicalSlug: null,
      shouldRedirect: false
    };
  }

  const canonicalSlug = toNewsSlug(legacyArticle);

  return {
    article: legacyArticle,
    canonicalSlug,
    shouldRedirect: true
  };
}

export async function generateStaticParams() {
  const latestNews = await getLatestNews(100);

  return latestNews.map((item) => ({
    slug: toNewsSlug(item)
  }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const resolved = await resolveArticleBySlug(slug);

  if (!resolved.article || !resolved.canonicalSlug) {
    return {
      title: "Новину не знайдено",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const article = resolved.article;
  const canonicalSlug = resolved.canonicalSlug;
  const imageUrl = normalizeArticleImageUrl(article.imageUrl);
  const absoluteImageUrl = toAbsoluteSiteUrl(imageUrl);
  const imageVariants = buildArticleImageVariants(absoluteImageUrl);
  const canonicalPath = `/news/${canonicalSlug}`;
  const canonicalUrl = getArticleUrl(canonicalSlug);

  return {
    title: article.title,
    description: article.excerpt,
    category: article.category,
    keywords: [article.category, "automotive news", "car news", article.title],
    alternates: {
      canonical: canonicalPath
    },
    robots: {
      index: true,
      follow: true
    },
    authors: [
      {
        name: "AutoNews Editorial Team"
      }
    ],
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url: canonicalUrl,
      publishedTime: article.publishedAt,
      section: article.category,
      tags: [article.category],
      images: imageVariants.map((url) => ({
        url,
        alt: article.title
      }))
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [imageVariants[0]]
    },
    other: {
      "article:published_time": article.publishedAt,
      "article:section": article.category
    }
  };
}

export default async function NewsArticlePage({ params }: NewsArticlePageProps) {
  const { slug } = await params;
  const resolvedArticle = await resolveArticleBySlug(slug);

  const popular = await getPopularNews(6);

  if (!resolvedArticle.article || !resolvedArticle.canonicalSlug) {
    notFound();
  }

  const article = resolvedArticle.article;
  const canonicalSlug = resolvedArticle.canonicalSlug;
  const articleImageUrl = normalizeArticleImageUrl(article.imageUrl);
  const absoluteArticleImageUrl = toAbsoluteSiteUrl(articleImageUrl);
  const articleImageVariants = buildArticleImageVariants(absoluteArticleImageUrl);

  if (resolvedArticle.shouldRedirect) {
    permanentRedirect(`/news/${canonicalSlug}`);
  }

  const canonicalUrl = getArticleUrl(canonicalSlug);
  const editorialPageUrl = `${env.siteUrl}/about`;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: articleImageVariants,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: article.category,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    isAccessibleForFree: true,
    author: {
      "@type": "Organization",
      name: "AutoNews Editorial Team",
      url: editorialPageUrl,
      sameAs: [editorialPageUrl]
    },
    publisher: {
      "@type": "Organization",
      name: "AutoNews",
      url: env.siteUrl
    }
  };
  const articleJsonLdString = JSON.stringify(articleJsonLd).replace(/</g, "\\u003c");

  const related = await getRelatedNews(article.id, 4);
  const popularNews = popular.map((item) => ({
    title: item.title,
    image: item.imageUrl,
    views: item.viewsLabel,
    href: `/news/${toNewsSlug(item)}`
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLdString }}
      />

      <div className="min-h-screen bg-gray-50">
        <Header />

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <article className="lg:col-span-2 space-y-6">
              <nav className="text-sm text-gray-500">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Головна
                </Link>
                <span> / </span>
                <Link
                  href={`/category/${toCategorySlug(article.category)}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {article.category}
                </Link>
                <span> / </span>
                <span className="text-gray-700">{article.title}</span>
              </nav>

              <section className="bg-white rounded-lg border p-6 md:p-8">
                {/* <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
                    {article.category}
                  </span>
                </div> */}

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <span className="sm:hidden">{formatPublishedDateCompact(article.publishedAt)}</span>
                  <span className="hidden sm:inline">{formatPublishedDate(article.publishedAt)}</span>
                  {/* <span className="hidden sm:inline">{article.viewsLabel} переглядів</span> */}
                </div>

                <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-6">
                  <Image
                    src={articleImageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 920px"
                    priority
                  />
                </div>

                <div className="space-y-4 text-gray-700 leading-7">
                  <p>{article.summary}</p>
                  {article.sourceAttributionUrl ? (
                    <p className="text-sm text-gray-500">
                      Джерело:{" "}
                      <a
                        href={article.sourceAttributionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline break-all"
                      >
                        {article.sourceAttributionUrl}
                      </a>
                    </p>
                  ) : null}
                </div>
              </section>

              {related.length > 0 ? (
                <section className="bg-white rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Схожі новини</h2>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <NewsCard
                        key={item.id}
                        title={item.title}
                        excerpt={item.excerpt}
                        image={item.imageUrl}
                        date={formatPublishedDate(item.publishedAt)}
                        mobileDate={formatPublishedDateCompact(item.publishedAt)}
                        views={item.viewsLabel}
                        category={item.category}
                        href={`/news/${toNewsSlug(item)}`}
                      />
                    ))}
                  </div>
                </section>
              ) : null}
            </article>

            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <Sidebar popularNews={popularNews} />
              </div>
            </div>
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
              <div>
                <h4 className="font-semibold mb-4">Підписка</h4>
                <p className="text-sm text-gray-400 mb-4">Отримуйте останні новини на пошту</p>
                <input
                  type="email"
                  placeholder="Ваш email"
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              © 2026 AutoNews. Всі права захищено.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
