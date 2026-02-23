import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Header } from "@/components/auto/header";
import { NewsCard } from "@/components/auto/news-card";
import { Sidebar } from "@/components/auto/sidebar";
import { env } from "@/lib/env";
import { formatPublishedDate } from "@/lib/formatters";
import { getLatestNews, getNewsById, getNewsBySlug, getPopularNews, getRelatedNews } from "@/lib/news/news-repository";
import { parseLegacyNewsIdFromSlug, toNewsSlug } from "@/lib/news/slug";
import type { NewsItem } from "@/types/news";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 120;

function getArticleUrl(slug: string): string {
  return `${env.siteUrl}/news/${slug}`;
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
      title: "News not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const article = resolved.article;
  const canonicalSlug = resolved.canonicalSlug;
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
      images: [
        {
          url: article.imageUrl,
          alt: article.title
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.imageUrl]
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

  if (resolvedArticle.shouldRedirect) {
    permanentRedirect(`/news/${canonicalSlug}`);
  }

  const canonicalUrl = getArticleUrl(canonicalSlug);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: [article.imageUrl],
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    articleSection: article.category,
    mainEntityOfPage: canonicalUrl,
    url: canonicalUrl,
    author: {
      "@type": "Organization",
      name: "AutoNews Editorial Team"
    },
    publisher: {
      "@type": "Organization",
      name: "AutoNews",
      url: env.siteUrl
    }
  };
  const articleJsonLdString = JSON.stringify(articleJsonLd).replace(/</g, "\\u003c");

  const related = await getRelatedNews(article.category, article.id, 4);
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
                  Home
                </Link>
                <span> / </span>
                <Link
                  href={`/category/${encodeURIComponent(article.category)}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {article.category}
                </Link>
                <span> / </span>
                <span className="text-gray-700">{article.title}</span>
              </nav>

              <section className="bg-white rounded-lg border p-6 md:p-8">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded">
                    {article.category}
                  </span>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <span>{formatPublishedDate(article.publishedAt)}</span>
                  <span>{article.viewsLabel} views</span>
                </div>

                <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-6">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1200px) 100vw, 920px"
                    priority
                  />
                </div>

                <div className="space-y-4 text-gray-700 leading-7">
                  <p>{article.summary}</p>
                  <p>{article.excerpt}</p>
                  <p>
                    AutoNews tracks this story as part of our ongoing automotive coverage.
                    Follow the category feed for updates and related releases.
                  </p>
                </div>
              </section>

              {related.length > 0 ? (
                <section className="bg-white rounded-lg border p-6">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related stories</h2>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <NewsCard
                        key={item.id}
                        title={item.title}
                        excerpt={item.excerpt}
                        image={item.imageUrl}
                        date={formatPublishedDate(item.publishedAt)}
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="text-xl font-bold text-blue-500">AUTO</div>
                  <div className="text-xl font-bold">NEWS</div>
                </div>
                <p className="text-sm text-gray-400">
                  Your source for the latest automotive world updates.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Sections</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">News</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Test drives</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Reviews</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Tech</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contacts</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Advertising</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Jobs</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Subscribe</h4>
                <p className="text-sm text-gray-400 mb-4">Get latest news by email</p>
                <input
                  type="email"
                  placeholder="Your email"
                  className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              Copyright 2026 AutoNews. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
