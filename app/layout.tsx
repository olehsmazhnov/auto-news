import type { Metadata } from "next";
import "@/app/globals.css";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "AutoNews - Автомобільні новини та огляди ринку",
    template: "%s | AutoNews"
  },
  description:
    "AutoNews — огляди електромобілів, тест-драйви, новини автоспорту та тренди автомобільної індустрії.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "AutoNews",
    title: "AutoNews - Автомобільні новини та огляди ринку",
    description:
      "AutoNews — огляди електромобілів, тест-драйви, новини автоспорту та тренди автомобільної індустрії.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoNews - Автомобільні новини та огляди ринку",
    description:
      "AutoNews — огляди електромобілів, тест-драйви, новини автоспорту та тренди автомобільної індустрії."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="uk">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
