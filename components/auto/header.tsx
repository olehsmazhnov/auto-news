import { IconButton } from "@/components/auto/icon-button";
import { MenuIcon, SearchIcon } from "@/components/auto/icons";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="text-2xl font-bold text-blue-600">AUTO</div>
              <div className="text-2xl font-bold text-gray-900">NEWS</div>
            </a>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">News</a>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">Test drives</a>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">Reviews</a>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">Tech</a>
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">EV</a>
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
        </div>
      </div>
    </header>
  );
}
