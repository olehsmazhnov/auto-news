import Link from "next/link";
import { ClockIcon, EyeIcon } from "@/components/auto/icons";
import { ImageWithFallback } from "@/components/auto/figma/image-with-fallback";
import { toCategorySlug } from "@/lib/news/category";

interface NewsCardProps {
  title: string;
  excerpt: string;
  image: string;
  date: string;
  mobileDate?: string;
  views: string;
  category: string;
  href: string;
  featured?: boolean;
}

export function NewsCard({
  title,
  excerpt,
  image,
  date,
  mobileDate,
  views,
  category,
  href,
  featured = false
}: NewsCardProps) {
  const categoryHref = `/category/${toCategorySlug(category)}`;

  if (featured) {
    return (
      <article className="group">
        <div className="relative overflow-hidden rounded-lg aspect-[16/9] mb-4">
          <ImageWithFallback
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <Link href={href} className="absolute inset-0" aria-label={title} />
          <div className="absolute top-4 left-4 z-10">
            <Link
              href={categoryHref}
              className="inline-block px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded"
            >
              {category}
            </Link>
          </div>
        </div>
        <h2 className="text-2xl mb-3 group-hover:text-blue-600 transition-colors">
          <Link href={href}>{title}</Link>
        </h2>
        <p className="text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
        <div className="flex items-center gap-3 sm:gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-4 w-4" />
            <span className="sm:hidden">{mobileDate ?? date}</span>
            <span className="hidden sm:inline">{date}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <EyeIcon className="h-4 w-4" />
            <span>{views} переглядів</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <Link
        href={href}
        className="relative overflow-hidden rounded-lg w-full h-44 sm:w-48 sm:h-32 flex-shrink-0"
      >
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </Link>
      <div className="flex-1 flex flex-col">
        <div className="mb-2">
          <Link
            href={categoryHref}
            className="inline-block px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            {category}
          </Link>
        </div>
        <h3 className="text-xl sm:text-lg mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          <Link href={href}>{title}</Link>
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2 flex-1">{excerpt}</p>
        <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <ClockIcon className="h-3 w-3" />
            <span className="sm:hidden">{mobileDate ?? date}</span>
            <span className="hidden sm:inline">{date}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <EyeIcon className="h-3 w-3" />
            <span>{views} переглядів</span>
          </div>
        </div>
      </div>
    </article>
  );
}
