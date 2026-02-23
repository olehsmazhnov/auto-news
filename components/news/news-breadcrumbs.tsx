import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type NewsBreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function NewsBreadcrumbs({ items }: NewsBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`}>
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
          {index < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </nav>
  );
}
