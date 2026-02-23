import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="container not-found">
      <h1>Page not found</h1>
      <p>The story you requested does not exist or has been removed.</p>
      <Link href="/">Return to homepage</Link>
    </main>
  );
}
