'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantityStepperProps {
  quantity: number;
  onInc: () => void;
  onDec: () => void;
  onChange: (quantity: number) => void;
}

const buttonClass =
  'inline-flex size-7 cursor-pointer items-center justify-center rounded-sm border border-border bg-card text-muted-foreground transition-colors hover:bg-muted';

export function QuantityStepper({
  quantity,
  onInc,
  onDec,
  onChange,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-1.5">
      <button
        aria-label="Diminuir quantidade"
        className={buttonClass}
        onClick={onDec}
        type="button"
      >
        <Minus className="size-3.5" />
      </button>
      <input
        aria-label="Quantidade"
        className="w-10 bg-transparent text-center font-medium font-mono text-foreground text-sm tabular-nums outline-none"
        inputMode="numeric"
        onChange={(event) => {
          const next = Number.parseInt(event.target.value, 10);
          onChange(Number.isNaN(next) ? 0 : next);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            onInc();
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            onDec();
          }
        }}
        value={quantity}
      />
      <button
        aria-label="Aumentar quantidade"
        className={buttonClass}
        onClick={onInc}
        type="button"
      >
        <Plus className="size-3.5" />
      </button>
    </div>
  );
}
