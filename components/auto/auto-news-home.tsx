"use client";

import { useState } from "react";
import { Header } from "@/components/auto/header";
import { NewsCard } from "@/components/auto/news-card";
import { Sidebar } from "@/components/auto/sidebar";

type CardNews = {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  mobileDate?: string;
  views: string;
  category: string;
  href: string;
};

type PopularNewsItem = {
  title: string;
  image: string;
  views: string;
  href: string;
};

type AutoNewsHomeProps = {
  featuredNews: CardNews | null;
  newsList: CardNews[];
  popularNews: PopularNewsItem[];
};

export function AutoNewsHome({ featuredNews, newsList, popularNews }: AutoNewsHomeProps) {
  const INITIAL_VISIBLE_NEWS = 9;
  const LOAD_MORE_STEP = 6;
  const [visibleNewsCount, setVisibleNewsCount] = useState(INITIAL_VISIBLE_NEWS);
  const visibleNews = newsList.slice(0, visibleNewsCount);
  const hasMoreNews = visibleNewsCount < newsList.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {featuredNews ? <NewsCard {...featuredNews} featured /> : null}

            <div className="border-t pt-8">
              <h2 className="text-xl font-semibold mb-6">Останні новини</h2>
              <div className="space-y-4">
                {visibleNews.map((news) => (
                  <NewsCard key={news.href} {...news} />
                ))}
              </div>
            </div>

            {hasMoreNews ? (
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setVisibleNewsCount((current) => Math.min(current + LOAD_MORE_STEP, newsList.length));
                  }}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Завантажити ще
                </button>
              </div>
            ) : null}
          </div>

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
            {/* <div>
              <h4 className="font-semibold mb-4">Підписка</h4>
              <p className="text-sm text-gray-400 mb-4">Отримуйте останні новини на пошту</p>
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full px-4 py-2 rounded bg-gray-800 border border-gray-700 text-sm focus:outline-none focus:border-blue-500"
              />
            </div> */}
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 AutoNews. Всі права захищено.
          </div>
        </div>
      </footer>
    </div>
  );
}
