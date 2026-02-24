import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="container not-found">
      <h1>Сторінку не знайдено</h1>
      <p>Новина, яку ви шукаєте, не існує або була видалена.</p>
      <Link href="/">Повернутися на головну</Link>
    </main>
  );
}
