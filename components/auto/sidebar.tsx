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
  const categories = [
    { name: "News", count: 1247 },
    { name: "Test drives", count: 523 },
    { name: "EV", count: 456 },
    { name: "Sports cars", count: 389 },
    { name: "SUV", count: 312 },
    { name: "Technology", count: 298 }
  ];

  return (
    <aside className="space-y-6">
      <div className="bg-white rounded-lg border p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUpIcon className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Popular</h3>
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
                <p className="text-xs text-gray-500">{item.views} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="flex items-center justify-between py-2 hover:text-blue-600 transition-colors"
            >
              <span className="text-sm">{category.name}</span>
              <span className="text-xs text-gray-500">{category.count}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <p className="text-xs mb-2 opacity-80">AD</p>
        <h4 className="text-lg font-semibold mb-2">Subscribe to our newsletter</h4>
        <p className="text-sm mb-4 opacity-90">Get the latest auto news in one digest.</p>
        <button className="w-full bg-white text-blue-600 py-2 rounded hover:bg-gray-100 transition-colors text-sm">
          Subscribe
        </button>
      </div>
    </aside>
  );
}
