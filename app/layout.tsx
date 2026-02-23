import type { Metadata } from "next";
import "@/app/globals.css";
import { env } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: "AutoNews - Automotive News and Market Insights",
    template: "%s | AutoNews"
  },
  description:
    "AutoNews tracks EV launches, vehicle reviews, motorsport highlights, and automotive industry trends.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    siteName: "AutoNews",
    title: "AutoNews - Automotive News and Market Insights",
    description:
      "AutoNews tracks EV launches, vehicle reviews, motorsport highlights, and automotive industry trends.",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoNews - Automotive News and Market Insights",
    description:
      "AutoNews tracks EV launches, vehicle reviews, motorsport highlights, and automotive industry trends."
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
