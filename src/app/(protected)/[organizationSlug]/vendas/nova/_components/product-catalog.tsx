'use client';

import { Search } from 'lucide-react';
import type { RefObject } from 'react';
import { Input } from '@/components/shadcn';
import type { CatalogProduct } from '@/hooks/sales/use-sale-catalog';
import { cn } from '@/lib/utils';
import { applyCurrencyMask } from '@/utils/functions';

interface ProductCatalogProps {
  products: CatalogProduct[];
  categories: string[];
  search: string;
  setSearch: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  isFetching: boolean;
  quantityById: Record<string, number>;
  onAdd: (product: CatalogProduct) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

export function ProductCatalog({
  products,
  categories,
  search,
  setSearch,
  activeCategory,
  setActiveCategory,
  isFetching,
  quantityById,
  onAdd,
  searchInputRef,
}: ProductCatalogProps) {
  // Enter na busca: leitor de código de barras / atalho rápido.
  const handleSearchEnter = () => {
    if (products.length === 0) {
      return;
    }
    const term = search.trim().toLowerCase();
    const exact = products.find((p) => p.code.toLowerCase() === term);
    const target = exact ?? (products.length === 1 ? products[0] : null);
    if (target) {
      onAdd(target);
      setSearch('');
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3.5 overflow-hidden p-5">
      <div className="relative">
        <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          onChange={(event) => setSearch(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              handleSearchEnter();
            }
            if (event.key === 'Escape' && search) {
              event.preventDefault();
              setSearch('');
            }
          }}
          placeholder="Buscar produto pelo nome ou código  ( / )"
          ref={searchInputRef}
          value={search}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const selected = category === activeCategory;
          return (
            <button
              className={cn(
                'h-8 rounded-full border px-3.5 font-medium text-sm transition-all',
                selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              )}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          'grid flex-1 content-start gap-3 overflow-y-auto pr-0.5',
          'grid-cols-[repeat(auto-fill,minmax(168px,1fr))]',
          isFetching && 'opacity-70'
        )}
      >
        {products.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 py-16 text-center text-muted-foreground">
            <Search className="size-7" />
            <span className="text-sm">Nenhum produto encontrado</span>
          </div>
        ) : (
          products.map((product) => {
            const inCart = quantityById[product.id] ?? 0;
            return (
              <button
                className={cn(
                  'relative flex min-h-[110px] flex-col gap-2 rounded-lg border bg-card p-3.5 text-left shadow-xs transition-all hover:shadow-sm',
                  inCart > 0 ? 'border-primary' : 'border-border'
                )}
                key={product.id}
                onClick={() => onAdd(product)}
                type="button"
              >
                {inCart > 0 ? (
                  <span className="absolute top-2.5 right-2.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 font-mono font-semibold text-primary-foreground text-xs">
                    {inCart}
                  </span>
                ) : null}
                <span className="text-muted-foreground text-xs">
                  {product.category ?? 'Sem categoria'}
                </span>
                <span className="flex-1 font-medium text-foreground text-sm leading-snug">
                  {product.name}
                </span>
                <span className="flex items-center justify-between">
                  <span className="font-semibold text-base text-primary">
                    {applyCurrencyMask(product.salePrice)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {product.stock} un.
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
