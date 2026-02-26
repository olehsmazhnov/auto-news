import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/auto/header";

const pageTitle = "Авторське право AutoNews";
const pageDescription =
  "Політика AutoNews щодо авторських прав і прав на зображення, а також контакти для оперативного розгляду звернень.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: {
    canonical: "/copyright"
  },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: "/copyright",
    type: "website"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function CopyrightPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <article className="bg-white border rounded-lg p-6 md:p-8 space-y-5 text-gray-800">
          <h1 className="text-3xl font-bold text-gray-900">Авторське право</h1>
          <p>
            Цей блог не має на меті порушувати авторські права чи права на портрети. Якщо у вас
            виникли будь-які питання щодо авторських прав або права на портрети, будь ласка,
            зв&rsquo;яжіться з нами на{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              сторінці контактів
            </Link>
            . Ми оперативно відповімо.
          </p>
        </article>
      </main>
    </div>
  );
}
