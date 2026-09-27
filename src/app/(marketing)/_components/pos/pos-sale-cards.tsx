import { ArchiveBoxIcon, DocumentCheckIcon } from '@heroicons/react/24/outline';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Presentational pieces of the POS section: the step list beside the terminal and the cards that
// float around it as the demo sale goes from PIX to paid.

export type SaleStep = { n: string; title: string; description: string };

export function SaleSteps({
  steps,
  active,
}: {
  steps: SaleStep[];
  active: number;
}) {
  return (
    <ol className="flex flex-col gap-1.5">
      {steps.map((s, k) => {
        const on = k === active;
        return (
          <li
            className={cn(
              'flex gap-4 border-l-2 py-3.5 pl-5 transition-[opacity,border-color] duration-300 ease-out motion-reduce:flex motion-reduce:border-white motion-reduce:opacity-100',
              on
                ? 'border-white opacity-100'
                : 'border-white/30 opacity-45 max-md:hidden'
            )}
            key={s.n}
          >
            <div className="flex flex-col gap-1.5">
              <span className="font-mono text-[13px] text-blue-50">{s.n}</span>
              <span className="font-semibold text-[clamp(20px,1.9vw,24px)] tracking-[-0.015em]">
                {s.title}
              </span>
              <span className="text-pretty text-[15px] text-blue-50 leading-relaxed">
                {s.description}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function FloatingCard({
  visible,
  delay,
  dx,
  className,
  children,
}: {
  visible: boolean;
  delay: number;
  dx: number;
  className: string;
  children: ReactNode;
}) {
  const style: CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible
      ? 'translate(0,0) scale(1)'
      : `translate(${dx}px,14px) scale(.96)`,
    transitionDelay: visible ? `${delay}ms` : '0ms',
  };
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute hidden rounded-2xl bg-white text-foreground shadow-[0_18px_36px_-12px_rgba(17,24,39,.45),0_0_0_1px_rgba(17,24,39,.05)] transition-[opacity,transform] duration-450 ease-[cubic-bezier(.2,.8,.2,1)] min-[1000px]:flex',
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function PaymentStatus({
  paid,
  amount,
}: {
  paid: boolean;
  amount: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-gray-500 text-xs">Venda #0143</span>
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-medium text-[11px] transition-colors duration-300',
            paid ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'
          )}
        >
          {paid ? 'Pago · PIX' : 'Aguardando PIX'}
        </span>
      </div>
      <span className="font-semibold text-[22px] tracking-tight">
        R$ {amount}
      </span>
    </>
  );
}

export function StockUpdated() {
  return (
    <>
      <span className="grid size-8.5 shrink-0 place-items-center rounded-[10px] bg-blue-50">
        <ArchiveBoxIcon className="size-4.5 text-primary" />
      </span>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-semibold text-[13px]">Estoque atualizado</span>
        <span className="font-mono text-gray-500 text-xs">
          Camiseta Básica 12 → 11
        </span>
      </div>
    </>
  );
}

export function InvoiceAuthorized() {
  return (
    <>
      <span className="grid size-7.5 shrink-0 place-items-center rounded-full bg-green-50">
        <DocumentCheckIcon className="size-4 text-green-700" />
      </span>
      <div className="flex flex-col gap-px">
        <span className="font-semibold text-[13px]">NFC-e autorizada</span>
        <span className="text-gray-500 text-xs">Nº 000.143 · Série 1</span>
      </div>
    </>
  );
}
