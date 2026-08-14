'use client';

import { ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Input } from '@/components/shadcn';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/shadcn/popover';
import { cn } from '@/lib/utils';

const NAME_SPLIT = /\s+/;

function initials(name: string) {
  return name
    .trim()
    .split(NAME_SPLIT)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export type SellerOption = {
  id: string;
  name: string;
  code: string | null;
};

interface SellerSelectProps {
  sellers: SellerOption[];
  isLoading: boolean;
  selectedSellerId: string | null;
  onSelect: (sellerId: string) => void;
  fallbackName: string;
}

export function SellerSelect({
  sellers,
  isLoading,
  selectedSellerId,
  onSelect,
  fallbackName,
}: SellerSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selectedSeller = sellers.find(
    (seller) => seller.id === selectedSellerId
  );
  const displayName = selectedSeller?.name ?? fallbackName;

  const filteredSellers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return sellers;
    }
    return sellers.filter(
      (seller) =>
        seller.name.toLowerCase().includes(normalized) ||
        seller.code?.toLowerCase().includes(normalized)
    );
  }, [sellers, query]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2">
        <span className="size-8 animate-pulse rounded-full bg-muted" />
        <span className="flex flex-col gap-1">
          <span className="h-3.5 w-24 animate-pulse rounded-full bg-muted" />
          <span className="h-3 w-14 animate-pulse rounded-full bg-muted" />
        </span>
      </div>
    );
  }

  if (sellers.length === 0) {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2">
        <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs">
          {initials(displayName)}
        </span>
        <span className="flex flex-col">
          <span className="font-semibold text-foreground text-sm">
            {displayName}
          </span>
          <span className="text-muted-foreground text-xs">Vendedor</span>
        </span>
      </div>
    );
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2 text-left transition-colors hover:bg-muted"
          type="button"
        >
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs">
            {initials(displayName)}
          </span>
          <span className="flex flex-1 flex-col">
            <span className="font-semibold text-foreground text-sm">
              {displayName}
            </span>
            <span className="text-muted-foreground text-xs">Vendedor</span>
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[280px] p-0">
        <div className="border-border border-b p-2">
          <Input
            autoFocus
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar por nome ou código"
            value={query}
          />
        </div>
        <div className="max-h-[240px] overflow-y-auto p-1">
          {filteredSellers.length === 0 ? (
            <div className="px-3 py-2.5 text-center text-muted-foreground text-sm">
              Nenhum vendedor encontrado
            </div>
          ) : (
            filteredSellers.map((seller) => (
              <button
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent',
                  seller.id === selectedSellerId
                    ? 'bg-blue-50 font-semibold text-primary hover:bg-blue-50'
                    : 'text-foreground'
                )}
                key={seller.id}
                onClick={() => {
                  onSelect(seller.id);
                  setQuery('');
                  setOpen(false);
                }}
                type="button"
              >
                {seller.name}
                {seller.code ? (
                  <span className="font-mono text-muted-foreground text-xs">
                    {seller.code}
                  </span>
                ) : null}
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
