'use client';

import { cn } from '@/lib/utils';
import { PAYMENT_METHODS, type SalePaymentMethod } from './payments';

interface PaymentTilesProps {
  value: SalePaymentMethod;
  onChange: (method: SalePaymentMethod) => void;
}

export function PaymentTiles({ value, onChange }: PaymentTilesProps) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {PAYMENT_METHODS.map((method, index) => {
        const Icon = method.icon;
        const selected = value === method.id;
        return (
          <button
            className={cn(
              'flex flex-col items-center justify-center gap-1.5 rounded-md border px-2 py-3 transition-all',
              selected
                ? 'border-primary bg-blue-50 text-primary shadow-[0_1px_4px_-1px_rgba(37,99,235,0.3)]'
                : 'border-border bg-card text-muted-foreground hover:bg-muted'
            )}
            key={method.id}
            onClick={() => onChange(method.id)}
            type="button"
          >
            <Icon className="size-6" />
            <span
              className={cn(
                'font-medium text-xs',
                selected ? 'text-primary' : 'text-foreground'
              )}
            >
              <span className="mr-1 text-[10px] opacity-50">{index + 1}</span>
              {method.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
