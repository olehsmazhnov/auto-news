import Link from "next/link";

type SiteHeaderProps = {
  categories: string[];
};

export function SiteHeader({ categories }: SiteHeaderProps) {
  return (
    <header className="site-header">
      <div className="container header-row">
        <Link href="/" className="brand" aria-label="Auto News home">
          <span className="brand-accent">AUTO</span>
          <span>NEWS</span>
        </Link>

        <nav aria-label="Primary" className="main-nav">
          {categories.slice(0, 6).map((category) => (
            <Link key={category} href={`/category/${encodeURIComponent(category)}`}>
              {category}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
