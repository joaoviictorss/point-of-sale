'use client';

import { Minus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuantityStepperProps {
  quantity: number;
  onInc: () => void;
  onDec: () => void;
  onChange: (quantity: number) => void;
  /** ex.: "kg", "L" — exibido ao lado do campo pra produtos por peso/volume */
  unitLabel?: string;
}

const buttonClass =
  'inline-flex size-7 cursor-pointer items-center justify-center rounded-sm border border-border bg-card text-muted-foreground transition-colors hover:bg-muted';

function parseQuantity(value: string) {
  const parsed = Number.parseFloat(value.replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
}

export function QuantityStepper({
  quantity,
  onInc,
  onDec,
  onChange,
  unitLabel,
}: QuantityStepperProps) {
  // buffer local em texto — evita que o ponto decimal "suma" a cada
  // re-render enquanto o usuário ainda está digitando (ex.: "1.")
  const [draft, setDraft] = useState(String(quantity));

  useEffect(() => {
    setDraft(String(quantity));
  }, [quantity]);

  const commit = () => {
    const parsed = parseQuantity(draft);
    if (parsed !== null && parsed > 0) {
      onChange(parsed);
    } else {
      setDraft(String(quantity));
    }
  };

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
      <span className="inline-flex items-baseline gap-1">
        <input
          aria-label="Quantidade"
          className="w-12 bg-transparent text-center font-medium font-mono text-foreground text-sm tabular-nums outline-none"
          inputMode="decimal"
          onBlur={commit}
          onChange={(event) =>
            setDraft(event.target.value.replace(/[^0-9.,]/g, ''))
          }
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              commit();
              event.currentTarget.blur();
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault();
              onInc();
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              onDec();
            }
          }}
          value={draft}
        />
        {unitLabel ? (
          <span className="text-[11px] text-muted-foreground">{unitLabel}</span>
        ) : null}
      </span>
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
