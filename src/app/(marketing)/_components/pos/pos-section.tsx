'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';
import { Noise } from '../ui/noise';
import { WIDTH } from '../ui/widths';
import {
  FloatingCard,
  InvoiceAuthorized,
  PaymentStatus,
  type SaleStep,
  SaleSteps,
  StockUpdated,
} from './pos-sale-cards';
import { PosTerminal3D } from './pos-terminal';
import { formatAmount, type SaleState } from './sale';

const STEPS: SaleStep[] = [
  {
    n: '01',
    title: 'Registre a venda',
    description:
      'Produtos, valor e forma de pagamento em poucos toques, no computador ou no celular.',
  },
  {
    n: '02',
    title: 'Receba como quiser',
    description:
      'PIX, cartão, dinheiro ou transferência. Cada pagamento fica registrado na venda.',
  },
  NOTA_FISCAL_DISPONIVEL
    ? {
        n: '03',
        title: 'Nota e estoque, na hora',
        description:
          'A NFC-e sai com os dados da venda e o estoque baixa sozinho.',
      }
    : {
        n: '03',
        title: 'Recibo e estoque, na hora',
        description:
          'O recibo sai com os dados da venda e o estoque baixa sozinho.',
      },
];

const PHASE_STEP: Record<SaleState['phase'], number> = {
  typing: 0,
  pix: 1,
  printed: 2,
};

/** "Uma venda no VNS": the card terminal sale drives the step list and the floating cards. */
export function PosSection() {
  const [phase, setPhase] = useState<SaleState['phase'] | null>(null);
  const [amount, setAmount] = useState('124,80');

  const step = phase ? PHASE_STEP[phase] : 0;
  const paid = phase === 'printed';

  return (
    <section aria-labelledby="maq-title" className="relative px-6">
      <div
        className={cn(
          'relative mx-auto flex min-h-[min(92vh,820px)] items-center overflow-hidden rounded-[28px] bg-[linear-gradient(160deg,#3b82f6_0%,#2563eb_45%,#1e40af_100%)] text-white',
          WIDTH.frame
        )}
      >
        <Noise className="opacity-[.05]" />
        <div
          className={cn(
            'relative mx-auto grid w-full grid-cols-1 content-center items-center gap-2 px-[clamp(16px,4vw,40px)] py-[clamp(48px,6vw,80px)] md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-[clamp(32px,5vw,72px)]',
            WIDTH.content
          )}
        >
          <div className="order-1 flex min-w-0 max-w-[460px] flex-col md:gap-8">
            <div className="hidden flex-col gap-3.5 md:flex">
              <span className="font-medium text-blue-50 text-sm">
                Uma venda no VNS
              </span>
              <h2
                className="text-balance font-semibold text-[clamp(30px,3.6vw,46px)] leading-[1.08] tracking-[-0.03em]"
                id="maq-title"
              >
                Você registra a venda. O resto o VNS faz.
              </h2>
            </div>
            <SaleSteps active={step} steps={STEPS} />
          </div>

          <div className="order-first flex min-w-0 justify-center md:order-2">
            <div className="relative w-[min(86vw,56vh)] md:w-[min(100%,620px,80vh)]">
              <PosTerminal3D
                onSaleChange={(sale) => {
                  setPhase(sale.phase);
                  setAmount(formatAmount(sale.digits));
                }}
              />
              <FloatingCard
                className="-left-[20%] top-[2%] w-52.5 flex-col gap-2 px-4 py-3.5"
                delay={0}
                dx={-16}
                visible={phase === 'pix' || paid}
              >
                <PaymentStatus amount={amount} paid={paid} />
              </FloatingCard>
              <FloatingCard
                className="-right-[4%] top-[66%] w-55 items-center gap-3 px-4 py-3.5"
                delay={250}
                dx={16}
                visible={paid}
              >
                <StockUpdated />
              </FloatingCard>
              {NOTA_FISCAL_DISPONIVEL && (
                <FloatingCard
                  className="-left-[16%] bottom-[4%] w-52.5 items-center gap-2.5 px-3.5 py-3"
                  delay={650}
                  dx={-16}
                  visible={paid}
                >
                  <InvoiceAuthorized />
                </FloatingCard>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
