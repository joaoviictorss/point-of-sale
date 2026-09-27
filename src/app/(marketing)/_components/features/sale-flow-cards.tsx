import {
  BanknotesIcon,
  BoltIcon,
  CreditCardIcon,
  DocumentCheckIcon,
} from '@heroicons/react/24/outline';
import type { ReactNode } from 'react';
import { Badge } from '@/components/shadcn/badge';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';

// The four cards of the sale flow (cart, payment, receipt, stock) and the step tabs above them.
// Presentational only: SaleFlow decides which card is in front.

const CART = [
  { name: 'Camiseta Básica Algodão', price: 'R$ 39,90' },
  { name: 'Café em Grãos Torrado', price: 'R$ 25,00' },
  { name: 'Vinho Tinto Reserva', price: 'R$ 59,90' },
];

const PAY_TILES = [
  { icon: BoltIcon, label: 'PIX', selected: true },
  { icon: CreditCardIcon, label: 'Crédito' },
  { icon: CreditCardIcon, label: 'Débito' },
  { icon: BanknotesIcon, label: 'Dinheiro' },
];

const STOCK_AFTER = [
  { name: 'Camiseta Básica Algodão', from: '1', to: '0 un.', low: true },
  { name: 'Café em Grãos Torrado', from: '15', to: '14 un.', low: false },
  { name: 'Vinho Tinto Reserva', from: '30', to: '29 un.', low: false },
];

// Depth in the stack, 0 = front card. The last one is hidden behind the others.
const STACK = [
  { opacity: 1, transform: 'translateY(0) scale(1)', zIndex: 4 },
  { opacity: 1, transform: 'translateY(-15px) scale(.94)', zIndex: 3 },
  { opacity: 0.75, transform: 'translateY(-29px) scale(.88)', zIndex: 2 },
  { opacity: 0, transform: 'translateY(-40px) scale(.82)', zIndex: 1 },
];

export function FlowCard({
  depth,
  children,
}: {
  depth: number;
  children: ReactNode;
}) {
  return (
    <div
      aria-hidden={depth !== 0}
      className={cn(
        'col-start-1 row-start-1 flex origin-top flex-col gap-3.5 rounded-[14px] bg-white p-4.5 text-foreground shadow-[0_14px_32px_-14px_rgba(17,24,39,.45),0_0_0_1px_rgba(17,24,39,.04)] transition-[opacity,transform] duration-600 ease-[cubic-bezier(.16,1,.3,1)]',
        depth !== 0 && 'pointer-events-none'
      )}
      style={STACK[depth]}
    >
      {children}
    </div>
  );
}

function PrimaryBar({ children }: { children: ReactNode }) {
  return (
    <div className="mt-auto flex h-9.5 items-center justify-center rounded-lg bg-primary font-medium text-sm text-white">
      {children}
    </div>
  );
}

function TotalRow() {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-text-muted">Total</span>
      <span className="font-semibold text-lg">R$ 124,80</span>
    </div>
  );
}

export function FlowTabs({
  labels,
  step,
  cycle,
  durationMs,
  onPick,
}: {
  labels: string[];
  step: number;
  /** Bumped on a manual pick so the active progress bar restarts. */
  cycle: number;
  durationMs: number;
  onPick: (k: number) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-1">
      {labels.map((label, k) => (
        <button
          aria-current={k === step ? 'step' : undefined}
          className={cn(
            'flex cursor-pointer flex-col gap-2 px-1.5 py-1 text-sm transition-colors duration-250',
            k === step && 'font-semibold text-white',
            k < step && 'text-white/85',
            k > step && 'text-white/60'
          )}
          key={label}
          onClick={() => onPick(k)}
          type="button"
        >
          <span className="flex items-center gap-2.5">
            {label}
            {k < labels.length - 1 && (
              <span aria-hidden className="text-white/50">
                →
              </span>
            )}
          </span>
          <span
            className={cn(
              'block h-0.5 overflow-hidden rounded-xs bg-white/20',
              k < labels.length - 1 ? 'w-[calc(100%-24px)]' : 'w-full'
            )}
          >
            <span
              className={cn(
                'block h-full rounded-xs bg-white',
                k < step ? 'w-full' : 'w-0'
              )}
              key={k === step ? `on-${step}-${cycle}` : 'off'}
              style={
                k === step
                  ? { animation: `lp-fill ${durationMs}ms linear forwards` }
                  : undefined
              }
            />
          </span>
        </button>
      ))}
    </div>
  );
}

export function CartCard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Carrinho</span>
        <Badge variant="info">3 itens</Badge>
      </div>
      <div className="flex flex-col">
        {CART.map((item) => (
          <div
            className="flex justify-between gap-3 border-border border-b py-2.25 text-[13px]"
            key={item.name}
          >
            <span className="text-foreground/80">{item.name}</span>
            <span className="whitespace-nowrap font-medium">{item.price}</span>
          </div>
        ))}
        <div className="pt-2.5">
          <TotalRow />
        </div>
      </div>
      <PrimaryBar>Ir para pagamento</PrimaryBar>
    </>
  );
}

export function PaymentCard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Pagamento</span>
        <span className="text-text-muted text-xs">3 itens</span>
      </div>
      <div className="flex flex-col gap-0.5 py-3">
        <span className="text-text-muted text-xs">Total a receber</span>
        <span className="font-semibold text-[30px] tracking-tight">
          R$ 124,80
        </span>
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {PAY_TILES.map((tile) => (
          <div
            className={cn(
              'flex flex-col items-center gap-1 rounded-lg border px-1 py-2.5 font-medium text-[11px]',
              tile.selected
                ? 'border-primary bg-blue-50 text-primary'
                : 'border-border bg-white text-text-muted'
            )}
            key={tile.label}
          >
            <tile.icon className="size-4.5" />
            {tile.label}
          </div>
        ))}
      </div>
      <PrimaryBar>Finalizar venda</PrimaryBar>
    </>
  );
}

export function ReceiptCard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-semibold">
          Recibo{' '}
          <span className="font-medium font-mono text-text-muted">#0143</span>
        </span>
        <Badge className="text-[11px]" variant="success">
          Pago · PIX
        </Badge>
      </div>
      <span className="-mt-1.5 text-text-muted text-xs">Hoje - 18:30</span>
      <div className="flex flex-col border-gray-300 border-y border-dashed py-1.5">
        {CART.map((item) => (
          <div
            className="flex justify-between gap-3 py-1.25 text-[13px]"
            key={item.name}
          >
            <span className="text-foreground/80">1× {item.name}</span>
            <span className="whitespace-nowrap font-mono">{item.price}</span>
          </div>
        ))}
      </div>
      <TotalRow />
      {NOTA_FISCAL_DISPONIVEL && (
        <div className="flex items-center gap-2 rounded-lg bg-green-50 px-2.5 py-2 font-medium text-green-700 text-xs">
          <DocumentCheckIcon className="size-4 shrink-0" />
          NFC-e nº 000.143 autorizada
        </div>
      )}
      <div className="mt-auto grid grid-cols-2 gap-2">
        <div className="flex h-9.5 items-center justify-center rounded-lg border border-border font-medium text-sm text-text-muted">
          Imprimir
        </div>
        <div className="flex h-9.5 items-center justify-center rounded-lg bg-primary font-medium text-sm text-white">
          Enviar comprovante
        </div>
      </div>
    </>
  );
}

export function StockCard() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Estoque atualizado</span>
        <Badge className="text-[11px]" variant="success">
          Automático
        </Badge>
      </div>
      <div className="flex flex-col">
        {STOCK_AFTER.map((row) => (
          <div
            className="flex items-center gap-2.5 border-border border-b py-2.5 text-[13px]"
            key={row.name}
          >
            <span className="min-w-0 flex-1 truncate text-foreground/80">
              {row.name}
            </span>
            <span className="whitespace-nowrap font-mono text-text-muted">
              {row.from} →{' '}
              <span className="font-medium text-foreground">{row.to}</span>
            </span>
            {row.low && (
              <Badge className="text-[11px]" variant="destructive-soft">
                Repor agora
              </Badge>
            )}
          </div>
        ))}
      </div>
      <span className="mt-auto text-text-muted text-xs">
        Venda #0143 · 3 saídas registradas
      </span>
    </>
  );
}
