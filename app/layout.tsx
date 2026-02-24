import type { Metadata } from "next";
import { Suspense } from "react";
import "@/app/globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "AutoNews - автомобільні новини та огляди ринку",
    template: "%s | AutoNews"
  },
  description:
    "AutoNews - огляди електромобілів, тест-драйви, новини автоспорту та тренди автомобільної індустрії.",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": `${env.siteUrl}/rss.xml`
    }
  },
  openGraph: {
    type: "website",
    siteName: "AutoNews",
    title: "AutoNews - автомобільні новини та огляди ринку",
    description:
      "AutoNews - огляди електромобілів, тест-драйви, новини автоспорту та тренди автомобільної індустрії.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoNews - автомобільні новини та огляди ринку",
    description:
      "AutoNews - огляди електромобілів, тест-драйви, новини автоспорту та тренди автомобільної індустрії."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AutoNews",
    url: env.siteUrl,
    sameAs: [`${env.siteUrl}/about`]
  }).replace(/</g, "\\u003c");

  return (
    <html lang="uk">
      <body>
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: organizationJsonLd }}
        />
        {children}
      </body>
    </html>
  );
}
