'use client';

import { Check, Search, X } from 'lucide-react';
import { type RefObject, useMemo, useRef, useState } from 'react';
import { Input } from '@/components/shadcn';
import type { CatalogProduct } from '@/hooks/sales/use-sale-catalog';
import { cn } from '@/lib/utils';
import { applyCurrencyMask } from '@/utils/functions';

const MAX_MATCHES = 6;

interface ProductQuickAddProps {
  products: CatalogProduct[];
  search: string;
  setSearch: (value: string) => void;
  onAdd: (product: CatalogProduct, quantity?: number) => void;
  searchInputRef: RefObject<HTMLInputElement | null>;
}

function matchProducts(products: CatalogProduct[], query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  const codeExact: CatalogProduct[] = [];
  const codeStarts: CatalogProduct[] = [];
  const codeContains: CatalogProduct[] = [];
  const nameContains: CatalogProduct[] = [];

  for (const product of products) {
    const code = product.code.toLowerCase();
    const name = product.name.toLowerCase();
    if (code === normalized) {
      codeExact.push(product);
    } else if (code.startsWith(normalized)) {
      codeStarts.push(product);
    } else if (code.includes(normalized)) {
      codeContains.push(product);
    } else if (name.includes(normalized)) {
      nameContains.push(product);
    }
  }

  return [...codeExact, ...codeStarts, ...codeContains, ...nameContains].slice(
    0,
    MAX_MATCHES
  );
}

function parseQuantity(product: CatalogProduct, rawValue: string) {
  const parsed = Number.parseFloat(rawValue.replace(',', '.'));
  const rawQuantity = Number.isNaN(parsed) || parsed <= 0 ? 1 : parsed;
  // produto por unidade não aceita fração, mesmo se o campo tiver uma
  return product.productType === 'UNIT'
    ? Math.round(rawQuantity) || 1
    : rawQuantity;
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-[10.5px]">
      {children}
    </span>
  );
}

export function ProductQuickAdd({
  products,
  search,
  setSearch,
  onAdd,
  searchInputRef,
}: ProductQuickAddProps) {
  // produto confirmado com Enter/clique no código — trava o campo e passa o
  // foco pra quantidade, só volta a editar com Esc
  const [selected, setSelected] = useState<CatalogProduct | null>(null);
  const [qtyValue, setQtyValue] = useState('1');
  const [highlightIndex, setHighlightIndex] = useState(0);

  const qtyInputRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(
    () => (selected ? [] : matchProducts(products, search)),
    [products, search, selected]
  );

  const selectProduct = (product: CatalogProduct) => {
    setSelected(product);
    setQtyValue('1');
    setHighlightIndex(0);
    // o input de quantidade só existe/habilita depois do re-render
    requestAnimationFrame(() => {
      qtyInputRef.current?.focus();
      qtyInputRef.current?.select();
    });
  };

  const backToCode = () => {
    setSelected(null);
    setQtyValue('1');
    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    });
  };

  const confirmAdd = () => {
    if (!selected) {
      return;
    }
    onAdd(selected, parseQuantity(selected, qtyValue));
    setSelected(null);
    setSearch('');
    setQtyValue('1');
    setHighlightIndex(0);
    searchInputRef.current?.focus();
  };

  const handleCodeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && matches.length > 0) {
      event.preventDefault();
      setHighlightIndex((index) => Math.min(index + 1, matches.length - 1));
      return;
    }
    if (event.key === 'ArrowUp' && matches.length > 0) {
      event.preventDefault();
      setHighlightIndex((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const target = matches[highlightIndex];
      if (target) {
        selectProduct(target);
      }
      return;
    }
    if (event.key === 'Escape' && search) {
      event.preventDefault();
      setSearch('');
    }
  };

  const handleQtyKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      confirmAdd();
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      backToCode();
    }
  };

  const previewQuantity = selected ? parseQuantity(selected, qtyValue) : 0;

  return (
    <div className="relative shrink-0">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          {selected ? (
            <div className="flex h-9 items-center gap-2.5 rounded-sm border border-border bg-muted/40 pr-2 pl-3">
              <Check className="size-3.5 shrink-0 text-success" />
              <span className="shrink-0 rounded border border-border bg-card px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                {selected.code}
              </span>
              <span className="min-w-0 flex-1 truncate font-medium text-foreground text-sm">
                {selected.name}
              </span>
              <span className="shrink-0 text-muted-foreground text-xs">
                {applyCurrencyMask(selected.salePrice)}
              </span>
              <button
                aria-label="Trocar produto"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={backToCode}
                type="button"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ) : (
            <>
              <Search className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground" />
              <Input
                className="pl-9"
                onChange={(event) => {
                  setSearch(event.target.value);
                  setHighlightIndex(0);
                }}
                onKeyDown={handleCodeKeyDown}
                placeholder="Buscar produto pelo nome ou código  ( / )"
                ref={searchInputRef}
                value={search}
              />
            </>
          )}
        </div>
        <span className="shrink-0 text-muted-foreground text-sm">×</span>
        <Input
          aria-label="Quantidade"
          className="w-20 shrink-0 text-center"
          disabled={!selected}
          inputMode="decimal"
          onChange={(event) =>
            setQtyValue(event.target.value.replace(/[^0-9.,]/g, ''))
          }
          onKeyDown={handleQtyKeyDown}
          placeholder="1"
          ref={qtyInputRef}
          value={selected ? qtyValue : ''}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-3">
        <span className="flex items-center gap-1.5 text-muted-foreground text-xs">
          {selected ? (
            <>
              <Kbd>↵</Kbd> adiciona ao carrinho <Kbd>Esc</Kbd> volta ao código
            </>
          ) : (
            <>
              <Kbd>↵</Kbd> confirma o código e vai para a quantidade
            </>
          )}
        </span>
        {selected ? (
          <span className="shrink-0 text-foreground text-xs tabular-nums">
            {previewQuantity} × {applyCurrencyMask(selected.salePrice)} ={' '}
            <span className="font-medium">
              {applyCurrencyMask(
                Math.round(selected.salePrice * previewQuantity)
              )}
            </span>
          </span>
        ) : null}
      </div>

      {!selected && search && matches.length > 0 ? (
        <div className="absolute top-[42px] right-0 left-0 z-20 overflow-hidden rounded-md border border-border bg-card shadow-md">
          {matches.map((product, index) => {
            const active = index === highlightIndex;
            return (
              <button
                className={cn(
                  'flex w-full items-center gap-3 border-border border-t px-3.5 py-2.5 text-left first:border-t-0',
                  active ? 'bg-muted' : 'hover:bg-muted/60'
                )}
                key={product.id}
                onClick={() => selectProduct(product)}
                onMouseEnter={() => setHighlightIndex(index)}
                type="button"
              >
                <span className="shrink-0 font-mono text-muted-foreground text-xs">
                  {product.code}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-foreground text-sm">
                    {product.name}
                  </span>
                  <span className="block text-muted-foreground text-xs">
                    {product.category ?? 'Sem categoria'} · {product.stock} em
                    estoque
                  </span>
                </span>
                <span className="shrink-0 font-medium text-primary text-sm">
                  {applyCurrencyMask(product.salePrice)}
                </span>
                {active ? <Kbd>↵</Kbd> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
