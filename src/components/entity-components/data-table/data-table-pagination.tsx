'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/shadcn';
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
  pageSize: number;
  totalCount: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  itemLabel?: string;
};

const PILL_CLASSNAME = 'size-8 rounded-lg';

export const DataTablePagination = ({
  page,
  pageSize,
  totalCount,
  totalPages,
  onPageChange,
  disabled,
  itemLabel = 'itens',
}: DataTablePaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const items = getPageItems(page, totalPages);
  const rangeStart = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, totalCount);

  return (
    <nav
      aria-label="Paginação"
      className="flex items-center justify-between gap-4 border-border border-t px-5 py-3"
    >
      <span className="text-muted-foreground text-xs">
        Mostrando {rangeStart}–{rangeEnd} de {totalCount} {itemLabel}
      </span>

      <div className="flex items-center gap-1">
        <Button
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ChevronLeftIcon className="size-3.5" />
        </Button>

        {items.map((item, index) =>
          item === ELLIPSIS ? (
            <span
              className="flex size-8 items-center justify-center text-muted-foreground text-sm"
              // biome-ignore lint/suspicious/noArrayIndexKey: reticências não têm id estável
              key={`${ELLIPSIS}-${index}`}
            >
              …
            </span>
          ) : (
            <Button
              aria-current={item === page ? 'page' : undefined}
              className={cn(PILL_CLASSNAME)}
              disabled={disabled}
              key={item}
              onClick={() => onPageChange(item)}
              size="icon"
              type="button"
              variant={item === page ? 'default' : 'ghost'}
            >
              {item}
            </Button>
          )
        )}

        <Button
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          size="sm"
          type="button"
          variant="outline"
        >
          <ChevronRightIcon className="size-3.5" />
        </Button>
      </div>
    </nav>
  );
};
