'use client';

import { useQuery } from '@tanstack/react-query';
import { ChevronsUpDown, Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/shadcn';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover';
import { useOrganization } from '@/contexts/organization-context';
import { useDebounce } from '@/hooks/common/use-debounce';
import { cn } from '@/lib/utils';
import { useTRPC } from '@/trpc/client';

export type ProductOption = {
  id: string;
  name: string;
  code: string;
  stock: number;
};

interface ProductComboboxProps {
  product: ProductOption | null;
  onSelect: (product: ProductOption) => void;
  disabled?: boolean;
  error?: string;
}

export function ProductCombobox({
  product,
  onSelect,
  disabled,
  error,
}: ProductComboboxProps) {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce({ value: query, delay: 300 });

  const { data, isFetching } = useQuery({
    ...trpc.product.getAllFromOrganization.queryOptions({
      organizationSlug,
      page: 1,
      pageSize: 8,
      search: debouncedQuery,
    }),
    enabled: open,
  });

  const products = data?.items ?? [];

  return (
    <div className="flex flex-col gap-1">
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              'flex h-9 w-full items-center justify-between gap-2 rounded-md border border-border bg-card px-3 text-left text-sm transition-colors hover:bg-muted',
              disabled && 'pointer-events-none opacity-50',
              error && 'border-destructive'
            )}
            disabled={disabled}
            type="button"
          >
            <span
              className={cn('truncate', !product && 'text-muted-foreground')}
            >
              {product
                ? `${product.name} · #${product.code}`
                : 'Selecione um produto'}
            </span>
            <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[320px] p-0">
          <div className="relative border-border border-b p-2">
            <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 size-4 text-muted-foreground" />
            <Input
              autoFocus
              className="pl-8"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por nome ou código"
              value={query}
            />
          </div>
          <div className="max-h-[240px] overflow-y-auto p-1">
            {isFetching && (
              <div className="px-3 py-2.5 text-center text-muted-foreground text-sm">
                Buscando...
              </div>
            )}
            {!isFetching && products.length === 0 && (
              <div className="px-3 py-2.5 text-center text-muted-foreground text-sm">
                Nenhum produto encontrado
              </div>
            )}
            {!isFetching &&
              products.map((item) => (
                <button
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                    item.id === product?.id
                      ? 'bg-blue-50 font-semibold text-primary hover:bg-blue-50'
                      : 'text-foreground'
                  )}
                  key={item.id}
                  onClick={() => {
                    onSelect({
                      id: item.id,
                      name: item.name,
                      code: item.code,
                      stock: item.stock,
                    });
                    setQuery('');
                    setOpen(false);
                  }}
                  type="button"
                >
                  <span className="truncate">{item.name}</span>
                  <span className="shrink-0 font-mono text-muted-foreground text-xs">
                    {item.stock} em estoque
                  </span>
                </button>
              ))}
          </div>
        </PopoverContent>
      </Popover>
      {error ? <span className="text-destructive text-xs">{error}</span> : null}
    </div>
  );
}
