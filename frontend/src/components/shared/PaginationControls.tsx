import Link from 'next/link';
import type { Pagination } from '@/types';

type Props = {
  pagination: Pagination;
  basePath: string;
};

function pageHref(basePath: string, page: number) {
  return `${basePath}?page=${page}`;
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('…');

  pages.push(total);
  return pages;
}

export function PaginationControls({ pagination, basePath }: Props) {
  const { page, pageCount } = pagination;
  const pages = getPageNumbers(page, pageCount);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">

      {/* Prev */}
      {page > 1 ? (
        <Link
          href={pageHref(basePath, page - 1)}
          className="px-4 py-2 text-sm font-sans text-[oklch(0.35_0.12_310)] border border-[oklch(0.35_0.12_310/0.3)] hover:border-[oklch(0.35_0.12_310)] transition-colors"
        >
          ← Prev
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-sans text-[oklch(0.45_0.04_280/0.3)] border border-[oklch(0.45_0.04_280/0.15)] cursor-not-allowed">
          ← Prev
        </span>
      )}

      {/* Page numbers */}
      <div className="flex items-center gap-1 mx-2">
        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-[oklch(0.45_0.04_280/0.4)] font-sans text-sm">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={pageHref(basePath, p)}
              aria-current={p === page ? 'page' : undefined}
              className={
                p === page
                  ? 'w-9 h-9 flex items-center justify-center text-sm font-sans bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)]'
                  : 'w-9 h-9 flex items-center justify-center text-sm font-sans text-[oklch(0.35_0.08_310)] hover:bg-[oklch(0.35_0.12_310/0.08)] transition-colors'
              }
            >
              {p}
            </Link>
          )
        )}
      </div>

      {/* Next */}
      {page < pageCount ? (
        <Link
          href={pageHref(basePath, page + 1)}
          className="px-4 py-2 text-sm font-sans text-[oklch(0.35_0.12_310)] border border-[oklch(0.35_0.12_310/0.3)] hover:border-[oklch(0.35_0.12_310)] transition-colors"
        >
          Next →
        </Link>
      ) : (
        <span className="px-4 py-2 text-sm font-sans text-[oklch(0.45_0.04_280/0.3)] border border-[oklch(0.45_0.04_280/0.15)] cursor-not-allowed">
          Next →
        </span>
      )}

    </nav>
  );
}
