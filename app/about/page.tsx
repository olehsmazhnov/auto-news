import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/auto/header";

export const metadata: Metadata = {
  title: "Про редакцію AutoNews",
  description:
    "Дізнайтеся більше про редакцію AutoNews, підходи до перевірки фактів та стандарти публікації новин.",
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-10 max-w-3xl">
        <article className="bg-white border rounded-lg p-6 md:p-8 space-y-5 text-gray-800">
          <h1 className="text-3xl font-bold text-gray-900">Про редакцію AutoNews</h1>
          <p>
            AutoNews публікує новини автомобільної індустрії, огляди технологій та аналітику
            ринку. Наша команда дотримується редакційних стандартів прозорості, коректного
            цитування та регулярного оновлення матеріалів.
          </p>
          <h2 className="text-xl font-semibold text-gray-900">Принципи роботи</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Використовуємо першоджерела та вказуємо посилання на джерело у матеріалах.</li>
            <li>Оновлюємо новини, якщо зʼявляються нові офіційні дані.</li>
            <li>Відділяємо новини від коментарів та рекламних повідомлень.</li>
          </ul>
          <p>
            Питання щодо матеріалів або виправлення фактів можна надіслати через сторінку{" "}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Контакти
            </Link>
            .
          </p>
        </article>
      </main>
    </div>
  );
}
