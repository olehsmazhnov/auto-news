import Link from "next/link";
import { TrendingUpIcon } from "@/components/auto/icons";
import { ImageWithFallback } from "@/components/auto/figma/image-with-fallback";

interface PopularNewsItem {
  title: string;
  image: string;
  views: string;
  href: string;
}

interface SidebarProps {
  popularNews: PopularNewsItem[];
}

export function Sidebar({ popularNews }: SidebarProps) {
  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUpIcon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Популярне</h3>
        </div>
        <div className="space-y-4">
          {popularNews.map((item) => (
            <Link href={item.href} key={item.href} className="group flex gap-3">
              <div className="relative overflow-hidden rounded w-20 h-14 flex-shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h4>
                {/* <p className="hidden sm:block text-xs text-gray-500">{item.views} переглядів</p> */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}