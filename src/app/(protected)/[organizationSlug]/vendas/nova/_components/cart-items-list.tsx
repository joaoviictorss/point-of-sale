'use client';

import { Trash2 } from 'lucide-react';
import type { UseCartReturn } from '@/hooks/sales/use-cart';
import { applyCurrencyMask } from '@/utils/functions';
import { BlankReceiptIcon } from './empty-state-illustrations';
import { QuantityStepper } from './quantity-stepper';

interface CartItemsListProps {
  cart: UseCartReturn;
}

const STOCK_UNIT_LABEL: Record<string, string> = {
  UNITS: 'un.',
  GRAMS: 'g',
  KILOGRAMS: 'kg',
  LITERS: 'L',
  MILLILITERS: 'ml',
};

export function CartItemsList({ cart }: CartItemsListProps) {
  if (cart.items.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-6 text-center">
        <BlankReceiptIcon />
        <h2 className="font-semibold text-base text-foreground tracking-tight">
          Nenhum item lançado
        </h2>
        <p className="max-w-[330px] text-muted-foreground text-sm leading-relaxed">
          Digite o código na barra acima e confirme com{' '}
          <span className="inline-flex h-5 min-w-5 items-center justify-center rounded border border-border bg-muted px-1 font-mono text-xs">
            ↵
          </span>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-2 overflow-y-auto pr-0.5">
      {cart.items.map((item) => (
        <div
          className="flex items-center gap-4 rounded-lg border border-border bg-card p-3.5 shadow-xs"
          key={item.id}
        >
          <div className="min-w-0 flex-1">
            <div className="truncate font-medium text-foreground text-sm">
              {item.name}
            </div>
            <div className="text-muted-foreground text-xs">
              <span className="font-mono">{item.code}</span> ·{' '}
              {applyCurrencyMask(item.salePrice)}
              {item.productType === 'UNIT'
                ? ''
                : `/${STOCK_UNIT_LABEL[item.stockUnit] ?? item.stockUnit}`}
            </div>
          </div>
          <QuantityStepper
            onChange={(quantity) => cart.setQuantity(item.id, quantity)}
            onDec={() => cart.dec(item.id)}
            onInc={() => cart.inc(item.id)}
            quantity={item.quantity}
            unitLabel={
              item.productType === 'UNIT'
                ? undefined
                : STOCK_UNIT_LABEL[item.stockUnit]
            }
          />
          <div className="w-24 shrink-0 text-right font-semibold text-foreground text-sm tabular-nums">
            {applyCurrencyMask(Math.round(item.salePrice * item.quantity))}
          </div>
          <button
            aria-label={`Remover ${item.name}`}
            className="shrink-0 text-muted-foreground transition-colors hover:text-error"
            onClick={() => cart.remove(item.id)}
            type="button"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
