import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { NewsBreadcrumbs } from "@/components/news/news-breadcrumbs";
import { NewsListCard } from "@/components/news/news-list-card";
import { env } from "@/lib/env";
import { formatPublishedDate } from "@/lib/formatters";
import { getCategoryCounts, getLatestNews, getNewsById, getPopularNews, getRelatedNews } from "@/lib/news/news-repository";
import { parseNewsIdFromSlug, toNewsSlug } from "@/lib/news/slug";

type NewsArticlePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const revalidate = 120;

function getArticleUrl(slug: string): string {
  return `${env.siteUrl}/news/${slug}`;
}

export async function generateStaticParams() {
  const latestNews = await getLatestNews(100);

  return latestNews.map((item) => ({
    slug: toNewsSlug(item)
  }));
}

export async function generateMetadata({ params }: NewsArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const id = parseNewsIdFromSlug(slug);

  if (!id) {
    return {
      title: "News not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const article = await getNewsById(id);

  if (!article) {
    return {
      title: "News not found",
      robots: {
        index: false,
        follow: false
      }
    };
  }

  const canonicalSlug = toNewsSlug(article);
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
  const id = parseNewsIdFromSlug(slug);

  if (!id) {
    notFound();
  }

  const [article, categoryCounts, popular] = await Promise.all([
    getNewsById(id),
    getCategoryCounts(),
    getPopularNews(6)
  ]);

  if (!article) {
    notFound();
  }

  const canonicalSlug = toNewsSlug(article);

  if (slug !== canonicalSlug) {
    redirect(`/news/${canonicalSlug}`);
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: articleJsonLdString }}
      />

      <SiteHeader categories={categoryCounts.map((item) => item.category)} />

      <main className="container article-layout">
        <article className="article-main">
          <NewsBreadcrumbs
            items={[
              { label: "Home", href: "/" },
              {
                label: article.category,
                href: `/category/${encodeURIComponent(article.category)}`
              },
              { label: article.title }
            ]}
          />

          <h1>{article.title}</h1>

          <div className="meta-row article-meta">
            <span>{formatPublishedDate(article.publishedAt)}</span>
            <span>{article.viewsLabel} views</span>
            <Link href={`/category/${encodeURIComponent(article.category)}`} className="category-chip">
              {article.category}
            </Link>
          </div>

          <div className="article-hero">
            <Image src={article.imageUrl} alt={article.title} fill sizes="(max-width: 1200px) 100vw, 920px" priority />
          </div>

          <div className="article-content">
            <p>{article.summary}</p>
            <p>{article.excerpt}</p>
            <p>
              AutoNews tracks this story as part of our ongoing automotive coverage.
              Follow the category feed for updates and related releases.
            </p>
          </div>

          {related.length > 0 ? (
            <section className="section-block">
              <div className="section-head">
                <h2>Related stories</h2>
              </div>
              <div className="news-stack">
                {related.map((item) => (
                  <NewsListCard key={item.id} item={item} />
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="article-sidebar">
          <section className="sidebar-card">
            <h3>Popular right now</h3>
            <ul className="popular-list">
              {popular.map((item) => (
                <li key={item.id}>
                  <Link href={`/news/${toNewsSlug(item)}`}>{item.title}</Link>
                  <span>{item.viewsLabel} views</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </main>

      <SiteFooter />
    </>
  );
}
