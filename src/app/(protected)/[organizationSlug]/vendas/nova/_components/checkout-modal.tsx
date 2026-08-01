'use client';

import { Check, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, Input } from '@/components/shadcn';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/shadcn/dialog';
import { cn } from '@/lib/utils';
import { applyCurrencyMask, removeCurrencyMask } from '@/utils/functions';
import { PaymentTiles } from './payment-tiles';
import {
  PAYMENT_LABEL,
  PAYMENT_METHODS,
  type SalePaymentMethod,
} from './payments';

export interface ConfirmedSale {
  orderNumber: number;
}

export interface CheckoutPayment {
  method: SalePaymentMethod;
  installments: number;
}

interface CheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  total: number;
  sellerName: string;
  isSubmitting: boolean;
  onConfirm: (payment: CheckoutPayment) => Promise<ConfirmedSale | null>;
  onNewSale: () => void;
}

const INSTALLMENT_OPTIONS = [1, 2, 3, 6, 12];

function quickCashAmounts(total: number) {
  const candidates = [
    total,
    Math.ceil(total / 1000) * 1000,
    Math.ceil(total / 5000) * 5000,
    Math.ceil(total / 10_000) * 10_000,
  ];
  return candidates
    .filter(
      (value, index, self) => value >= total && self.indexOf(value) === index
    )
    .slice(0, 3);
}

interface ConfirmedSnapshot {
  orderNumber: number;
  total: number;
  change: number;
  method: SalePaymentMethod;
}

export function CheckoutModal({
  open,
  onOpenChange,
  total,
  sellerName,
  isSubmitting,
  onConfirm,
  onNewSale,
}: CheckoutModalProps) {
  const [method, setMethod] = useState<SalePaymentMethod>('CASH');
  const [received, setReceived] = useState('');
  const [installments, setInstallments] = useState(1);
  // snapshot dos valores no momento da confirmação (o carrinho é zerado depois)
  const [confirmed, setConfirmed] = useState<ConfirmedSnapshot | null>(null);

  const receivedValue = Number.parseInt(
    removeCurrencyMask(received) || '0',
    10
  );
  const change = method === 'CASH' ? Math.max(0, receivedValue - total) : 0;
  const missing = method === 'CASH' ? Math.max(0, total - receivedValue) : 0;
  const confirmDisabled = method === 'CASH' && missing > 0;

  const reset = () => {
    setMethod('CASH');
    setReceived('');
    setInstallments(1);
    setConfirmed(null);
  };

  const handleConfirm = async () => {
    if (confirmDisabled) {
      return;
    }
    const result = await onConfirm({
      method,
      installments: method === 'CREDIT_CARD' ? installments : 1,
    });
    if (result) {
      setConfirmed({ orderNumber: result.orderNumber, total, change, method });
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (confirmed) {
      return;
    }
    const onInput =
      event.target instanceof HTMLElement &&
      (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA');

    if (!onInput) {
      const index = Number.parseInt(event.key, 10) - 1;
      if (index >= 0 && index < PAYMENT_METHODS.length) {
        event.preventDefault();
        setMethod(PAYMENT_METHODS[index].id);
        return;
      }
    }
    if (event.key === 'Enter' && !confirmDisabled) {
      event.preventDefault();
      handleConfirm();
    }
  };

  return (
    <Dialog
      onOpenChange={(next) => {
        if (!next) {
          reset();
        }
        onOpenChange(next);
      }}
      open={open}
    >
      <DialogContent className="max-w-[460px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {confirmed ? 'Resumo da venda' : 'Finalizar venda'}
          </DialogTitle>
        </DialogHeader>

        {confirmed ? (
          <SaleCompleted
            change={confirmed.change}
            method={confirmed.method}
            onClose={() => onOpenChange(false)}
            onNewSale={() => {
              reset();
              onNewSale();
            }}
            orderNumber={confirmed.orderNumber}
            sellerName={sellerName}
            total={confirmed.total}
          />
        ) : (
          <PaymentStep
            change={change}
            confirmDisabled={confirmDisabled}
            installments={installments}
            isSubmitting={isSubmitting}
            method={method}
            missing={missing}
            onConfirm={handleConfirm}
            received={received}
            setInstallments={setInstallments}
            setMethod={setMethod}
            setReceived={setReceived}
            total={total}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

interface PaymentStepProps {
  total: number;
  method: SalePaymentMethod;
  setMethod: (method: SalePaymentMethod) => void;
  received: string;
  setReceived: (value: string) => void;
  installments: number;
  setInstallments: (value: number) => void;
  change: number;
  missing: number;
  confirmDisabled: boolean;
  isSubmitting: boolean;
  onConfirm: () => void;
}

function PaymentStep({
  total,
  method,
  setMethod,
  received,
  setReceived,
  installments,
  setInstallments,
  change,
  missing,
  confirmDisabled,
  isSubmitting,
  onConfirm,
}: PaymentStepProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between rounded-md bg-muted px-4 py-3.5">
        <span className="text-muted-foreground text-sm">Total a pagar</span>
        <span className="font-semibold text-3xl text-foreground tabular-nums tracking-tight">
          {applyCurrencyMask(total)}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="font-medium text-foreground text-sm">
          Forma de pagamento
        </span>
        <PaymentTiles onChange={setMethod} value={method} />
      </div>

      {method === 'CASH' ? (
        <CashPayment
          change={change}
          missing={missing}
          received={received}
          setReceived={setReceived}
          total={total}
        />
      ) : null}

      {method === 'CREDIT_CARD' ? (
        <div className="flex flex-col gap-1.5">
          <span className="font-medium text-foreground text-sm">
            Parcelamento
          </span>
          <div className="flex flex-wrap gap-2">
            {INSTALLMENT_OPTIONS.map((n) => {
              const selected = installments === n;
              return (
                <button
                  className={cn(
                    'rounded-md border px-3.5 py-2 font-medium text-sm transition-all',
                    selected
                      ? 'border-primary bg-blue-50 text-primary'
                      : 'border-border bg-card text-foreground hover:bg-muted'
                  )}
                  key={n}
                  onClick={() => setInstallments(n)}
                  type="button"
                >
                  {n}×{' '}
                  {n === 1
                    ? 'à vista'
                    : applyCurrencyMask(Math.round(total / n))}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {method === 'PIX' ? (
        <div className="rounded-md bg-muted px-4 py-3.5 text-foreground text-sm leading-relaxed">
          Cobrança Pix gerada — o cliente paga via QR Code. Confirme quando o
          pagamento cair.
        </div>
      ) : null}

      <Button
        className="h-11 w-full"
        disabled={confirmDisabled || isSubmitting}
        onClick={onConfirm}
        type="button"
      >
        {isSubmitting ? 'Registrando…' : 'Confirmar e finalizar'}
        {isSubmitting ? null : <Check className="size-[18px]" />}
      </Button>
    </div>
  );
}

function CashPayment({
  total,
  received,
  setReceived,
  change,
  missing,
}: {
  total: number;
  received: string;
  setReceived: (value: string) => void;
  change: number;
  missing: number;
}) {
  const quick = useMemo(() => quickCashAmounts(total), [total]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <span className="font-medium text-foreground text-sm">
          Valor recebido
        </span>
        <Input
          autoFocus
          inputMode="decimal"
          onChange={(event) => {
            const digits = removeCurrencyMask(event.target.value);
            setReceived(digits ? applyCurrencyMask(digits) : '');
          }}
          placeholder="R$ 0,00"
          value={received}
        />
      </div>
      <div className="flex gap-2">
        {quick.map((value) => (
          <button
            className="h-9 flex-1 rounded-sm border border-border bg-card font-medium text-foreground text-sm hover:bg-muted"
            key={value}
            onClick={() => setReceived(applyCurrencyMask(value))}
            type="button"
          >
            {applyCurrencyMask(value)}
          </button>
        ))}
      </div>
      <div
        className={cn(
          'flex justify-between rounded-md px-4 py-3',
          change > 0 ? 'bg-blue-50' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'font-medium text-sm',
            missing > 0 ? 'text-warning' : 'text-foreground'
          )}
        >
          {missing > 0 ? 'Falta receber' : 'Troco'}
        </span>
        <span
          className={cn(
            'font-semibold text-lg tabular-nums',
            missing > 0 ? 'text-warning' : 'text-primary'
          )}
        >
          {applyCurrencyMask(missing > 0 ? missing : change)}
        </span>
      </div>
    </div>
  );
}

function SaleCompleted({
  orderNumber,
  method,
  total,
  change,
  sellerName,
  onClose,
  onNewSale,
}: {
  orderNumber: number;
  method: SalePaymentMethod;
  total: number;
  change: number;
  sellerName: string;
  onClose: () => void;
  onNewSale: () => void;
}) {
  const rows: [string, string][] = [
    ['Total', applyCurrencyMask(total)],
    ...(change > 0
      ? ([['Troco', applyCurrencyMask(change)]] as [string, string][])
      : []),
    ['Pagamento', PAYMENT_LABEL[method]],
    ['Vendedor', sellerName],
  ];

  return (
    <div className="flex flex-col items-center gap-4 py-1 text-center">
      <div className="inline-flex size-16 items-center justify-center rounded-full bg-blue-50 text-success">
        <Check className="size-8" />
      </div>
      <div>
        <div className="font-bold text-foreground text-xl">
          Venda registrada!
        </div>
        <div className="mt-1 text-muted-foreground text-sm">
          Venda nº {String(orderNumber).padStart(4, '0')}
        </div>
      </div>
      <div className="flex w-full flex-col gap-2 rounded-md bg-muted px-4 py-4 text-left">
        {rows.map(([key, value]) => (
          <div className="flex justify-between text-sm" key={key}>
            <span className="text-muted-foreground">{key}</span>
            <span className="font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>
      <div className="flex w-full gap-2.5">
        <Button
          className="flex-1"
          onClick={onClose}
          type="button"
          variant="outline"
        >
          Fechar
        </Button>
        <Button className="flex-1" onClick={onNewSale} type="button">
          <Plus className="size-4" /> Nova venda
        </Button>
      </div>
    </div>
  );
}
