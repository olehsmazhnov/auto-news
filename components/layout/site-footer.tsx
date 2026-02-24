"use client";

import { useNewsletterForm } from "@/hooks/use-newsletter-form";

export function SiteFooter() {
  const { email, setEmail, message, status, submit } = useNewsletterForm();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <section>
          <h2 className="brand footer-brand">
            <span className="brand-accent">AUTO</span>
            <span>NEWS</span>
          </h2>
          <p>
            Автоновини, тест-драйви, прем'єри електромобілів та тренди індустрії в
            одній стрічці.
          </p>
        </section>

        <section>
          <h3>Розсилка</h3>
          <p>Отримуйте короткий щоденний дайджест з найважливішими автоновинами.</p>
          <form className="newsletter-form" onSubmit={submit}>
            <input
              aria-label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <button type="submit">Підписатися</button>
          </form>
          {message ? (
            <p className={status === "error" ? "status-error" : "status-success"}>{message}</p>
          ) : null}
        </section>
      </div>

      <div className="container footer-bottom">© {new Date().getFullYear()} AutoNews.</div>
    </footer>
  );
}
