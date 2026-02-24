"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navItems = [
  { href: "/", label: "Головна" },
  { href: "/categories", label: "Категорії" },
  { href: "/news/page/2", label: "Архів" },
  { href: "/about", label: "Про нас" },
  { href: "/contact", label: "Контакти" }
] as const;

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">AUTO</div>
              <div className="text-2xl font-bold text-gray-900">NEWS</div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {/* <a href="/" className="text-sm hover:text-blue-600 transition-colors">
                Головна
              </a> */}
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm transition-colors hover:text-blue-600"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* <div className="flex items-center gap-4">
            <IconButton>
              <SearchIcon className="h-5 w-5" />
            </IconButton>
            <IconButton className="md:hidden">
              <MenuIcon className="h-5 w-5" />
            </IconButton>
          </div> */}
          <button
            type="button"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-900 transition-colors hover:bg-gray-100 md:hidden"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">
              {isMobileMenuOpen ? "Закрити меню" : "Відкрити меню"}
            </span>
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              aria-hidden="true"
              className="text-current"
            >
              <path
                d={
                  isMobileMenuOpen
                    ? "M6 6L18 18M18 6L6 18"
                    : "M4 7H20M4 12H20M4 17H20"
                }
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div id="mobile-menu" className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Закрити меню"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          <div className="relative z-10 flex h-full w-full flex-col bg-white px-6 py-5">
            <div className="flex items-center justify-between border-b pb-4">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="text-2xl font-bold text-blue-600">AUTO</div>
                <div className="text-2xl font-bold text-gray-900">NEWS</div>
              </Link>
              <button
                type="button"
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-900"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Закрити меню"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                  aria-hidden="true"
                  className="text-current"
                >
                  <path
                    d="M6 6L18 18M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="mt-8 flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={`mobile-${item.href}`}
                  href={item.href}
                  className="border-b py-4 text-2xl font-semibold text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
