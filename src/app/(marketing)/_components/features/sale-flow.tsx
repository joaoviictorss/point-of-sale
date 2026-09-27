'use client';

import { useCallback, useEffect, useState } from 'react';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';
import {
  CartCard,
  FlowCard,
  FlowTabs,
  PaymentCard,
  ReceiptCard,
  StockCard,
} from './sale-flow-cards';

const STEP_MS = 3600;

const FLOW = [
  'Carrinho',
  'Pagamento',
  NOTA_FISCAL_DISPONIVEL ? 'Recibo e nota' : 'Recibo',
  'Estoque',
];

/** Cycles the sale cards on a timer; clicking a tab jumps there and restarts the timer. */
export function SaleFlow() {
  const [step, setStep] = useState(0);
  // Bumped on click so the active progress bar restarts even when the same step is picked again.
  const [cycle, setCycle] = useState(0);

  // biome-ignore lint/correctness/useExhaustiveDependencies: cycle restarts the timer after a manual pick
  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => (s + 1) % FLOW.length),
      STEP_MS
    );
    return () => clearInterval(id);
  }, [cycle]);

  const go = useCallback((k: number) => {
    setStep(k);
    setCycle((c) => c + 1);
  }, []);

  const depth = (k: number) => (k - step + FLOW.length) % FLOW.length;

  return (
    <div className="flex flex-col items-center gap-5">
      <FlowTabs
        cycle={cycle}
        durationMs={STEP_MS}
        labels={FLOW}
        onPick={go}
        step={step}
      />
      <div className="relative mt-2.5 box-border w-full max-w-[420px] rounded-[20px] border border-white/25 bg-white/15 p-2 shadow-[0_30px_60px_-24px_rgba(17,24,39,.5)]">
        <div className="grid pt-7.5">
          <FlowCard depth={depth(0)}>
            <CartCard />
          </FlowCard>
          <FlowCard depth={depth(1)}>
            <PaymentCard />
          </FlowCard>
          <FlowCard depth={depth(2)}>
            <ReceiptCard />
          </FlowCard>
          <FlowCard depth={depth(3)}>
            <StockCard />
          </FlowCard>
        </div>
      </div>
    </div>
  );
}
