import Link from "next/link";

type PaginationNavProps = {
  currentPage: number;
  totalPages: number;
  buildHref: (page: number) => string;
};

function getVisiblePages(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set<number>([1, totalPages, currentPage, currentPage - 1, currentPage + 1]);

  for (const page of [...pages]) {
    if (page < 1 || page > totalPages) {
      pages.delete(page);
    }
  }

  return [...pages].sort((a, b) => a - b);
}

export function PaginationNav({ currentPage, totalPages, buildHref }: PaginationNavProps) {
  if (totalPages <= 1) {
    return null;
  }

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <nav className="pt-6" aria-label="Pagination">
      <div className="flex items-center justify-center gap-2">
        {currentPage > 1 ? (
          <Link
            href={buildHref(currentPage - 1)}
            className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <span className="sm:hidden">Назад</span>
            <span className="hidden sm:inline">Попередня</span>
          </Link>
        ) : (
          <span className="rounded border px-3 py-2 text-sm text-gray-400">
            <span className="sm:hidden">Назад</span>
            <span className="hidden sm:inline">Попередня</span>
          </span>
        )}

        <span className="rounded border px-3 py-2 text-sm text-gray-700 sm:hidden">
          {currentPage} / {totalPages}
        </span>

        <div className="hidden sm:flex items-center gap-2">
          {visiblePages.map((page, index) => {
            const previousPage = visiblePages[index - 1];
            const showGap = typeof previousPage === "number" && page - previousPage > 1;

            return (
              <div key={page} className="flex items-center gap-2">
                {showGap ? <span className="px-1 text-sm text-gray-400">...</span> : null}
                {page === currentPage ? (
                  <span className="rounded border border-blue-600 bg-blue-600 px-3 py-2 text-sm text-white">
                    {page}
                  </span>
                ) : (
                  <Link
                    href={buildHref(page)}
                    className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {page}
                  </Link>
                )}
              </div>
            );
          })}
        </div>

        {currentPage < totalPages ? (
          <Link
            href={buildHref(currentPage + 1)}
            className="rounded border px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <span className="sm:hidden">Далі</span>
            <span className="hidden sm:inline">Наступна</span>
          </Link>
        ) : (
          <span className="rounded border px-3 py-2 text-sm text-gray-400">
            <span className="sm:hidden">Далі</span>
            <span className="hidden sm:inline">Наступна</span>
          </span>
        )}
      </div>
    </nav>
  );
}