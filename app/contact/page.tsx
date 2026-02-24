import type { Metadata } from "next";
import { Header } from "@/components/auto/header";

export const metadata: Metadata = {
  title: "Контакти AutoNews",
  description: "Контактна інформація редакції AutoNews для запитів, партнерств та виправлень.",
  alternates: {
    canonical: "/contact"
  }
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <section className="bg-white border rounded-lg p-6 md:p-8 space-y-5 text-gray-800">
          <h1 className="text-3xl font-bold text-gray-900">Контакти</h1>
          <p>Для запитів щодо матеріалів, співпраці або уточнень звертайтеся:</p>
          <ul className="space-y-2">
            <li>
              Email редакції: <a href="mailto:editor@autonews.ua" className="text-blue-600 hover:underline">editor@autonews.ua</a>
            </li>
            <li>
              Партнерства: <a href="mailto:partners@autonews.ua" className="text-blue-600 hover:underline">partners@autonews.ua</a>
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            Час відповіді зазвичай до 2 робочих днів.
          </p>
        </section>
      </main>
    </div>
  );
}
