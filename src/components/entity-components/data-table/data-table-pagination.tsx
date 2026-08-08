'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

const ELLIPSIS = 'ellipsis' as const;

type PageItem = number | typeof ELLIPSIS;

export const getPageItems = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];

  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);

  if (start > 2) {
    items.push(ELLIPSIS);
  }

  for (let current = start; current <= end; current++) {
    items.push(current);
  }

  if (end < totalPages - 1) {
    items.push(ELLIPSIS);
  }

  items.push(totalPages);

  return items;
};

type DataTablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export const DataTablePagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: DataTablePaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(page, totalPages);

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-end gap-1 border-border border-t bg-muted/30 p-3"
    >
      <button
        className="inline-flex items-center gap-1 rounded-md px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
        type="button"
      >
        <ChevronLeftIcon className="size-4" />
        Página anterior
      </button>

      {items.map((item, index) =>
        item === ELLIPSIS ? (
          <span
            className="flex size-10 items-center justify-center text-muted-foreground"
            // biome-ignore lint/suspicious/noArrayIndexKey: reticências não têm id estável
            key={`${ELLIPSIS}-${index}`}
          >
            <EllipsisHorizontalIcon className="size-4" />
          </span>
        ) : (
          <button
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              'size-10 rounded-lg font-medium text-foreground text-sm transition-colors',
              item === page
                ? 'border border-border bg-background shadow-xs'
                : 'hover:bg-accent'
            )}
            disabled={disabled}
            key={item}
            onClick={() => onPageChange(item)}
            type="button"
          >
            {item}
          </button>
        )
      )}

      <button
        className="inline-flex items-center gap-1 rounded-md px-4 py-2 font-medium text-foreground text-sm transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50"
        disabled={disabled || page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        type="button"
      >
        Próxima
        <ChevronRightIcon className="size-4" />
      </button>
    </nav>
  );
};
