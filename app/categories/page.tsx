import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/auto/header";
import { toCategorySlug } from "@/lib/news/category";
import { getCategoryCounts } from "@/lib/news/news-repository";

export const metadata: Metadata = {
  title: "Категорії новин",
  description: "Оберіть категорію автоновин для перегляду матеріалів за темою.",
  alternates: {
    canonical: "/categories"
  }
};

export const revalidate = 120;

export default async function CategoriesPage() {
  const categories = await getCategoryCounts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <section className="bg-white border rounded-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Категорії</h1>
          <p className="text-gray-600 mb-6">Переглядайте новини за тематичними розділами.</p>
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.category}>
                <Link
                  href={`/category/${toCategorySlug(category.category)}`}
                  className="flex items-center justify-between rounded border px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <span className="text-sm text-gray-500">{category.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
