'use client';

import {
  ArrowRight,
  ShoppingBag,
  StickyNote,
  Tag,
  Trash2,
  UserPlus,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Badge, Button, Input } from '@/components/shadcn';
import type { UseCartReturn } from '@/hooks/sales/use-cart';
import { applyCurrencyMask, removeCurrencyMask } from '@/utils/functions';
import { QuantityStepper } from './quantity-stepper';

const NAME_SPLIT = /\s+/;

export interface CustomerDraft {
  name: string;
  phone: string;
  email: string;
}

interface CartPanelProps {
  cart: UseCartReturn;
  sellerName: string;
  discountInput: string;
  onDiscountInputChange: (value: string) => void;
  discountValue: number;
  total: number;
  customer: CustomerDraft;
  onCustomerChange: (customer: CustomerDraft) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onCheckout: () => void;
}

function initials(name: string) {
  return name
    .trim()
    .split(NAME_SPLIT)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function CartPanel({
  cart,
  sellerName,
  discountInput,
  onDiscountInputChange,
  discountValue,
  total,
  customer,
  onCustomerChange,
  notes,
  onNotesChange,
  onCheckout,
}: CartPanelProps) {
  const empty = cart.count === 0;

  return (
    <aside className="flex w-[360px] shrink-0 flex-col border-border border-l bg-card">
      {/* header + vendedor */}
      <div className="flex flex-col gap-2.5 border-border border-b p-4">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2 font-semibold text-base text-foreground">
            <ShoppingBag className="size-[18px]" /> Venda atual
          </span>
          {cart.count > 0 ? (
            <Badge>
              {cart.count} {cart.count === 1 ? 'item' : 'itens'}
            </Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2.5 rounded-md border border-border bg-card px-2.5 py-2">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground text-xs">
            {initials(sellerName)}
          </span>
          <span className="flex flex-col">
            <span className="font-semibold text-foreground text-sm">
              {sellerName}
            </span>
            <span className="text-muted-foreground text-xs">Vendedor</span>
          </span>
        </div>
      </div>

      {/* items */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center text-muted-foreground">
            <ShoppingBag className="size-8" />
            <span className="text-sm">
              Busque um produto
              <br />
              para adicionar à venda
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {cart.items.map((item) => (
              <div
                className="flex items-center gap-2.5 border-border border-b pb-2.5"
                key={item.id}
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-foreground text-sm">
                    {item.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {applyCurrencyMask(item.salePrice)}
                  </div>
                </div>
                <QuantityStepper
                  onChange={(quantity) => cart.setQuantity(item.id, quantity)}
                  onDec={() => cart.dec(item.id)}
                  onInc={() => cart.inc(item.id)}
                  quantity={item.quantity}
                />
                <div className="w-[68px] text-right font-semibold text-foreground text-sm tabular-nums">
                  {applyCurrencyMask(item.salePrice * item.quantity)}
                </div>
                <button
                  aria-label={`Remover ${item.name}`}
                  className="text-muted-foreground transition-colors hover:text-error"
                  onClick={() => cart.remove(item.id)}
                  type="button"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}

            <ClienteBlock customer={customer} onChange={onCustomerChange} />
            <ObsBlock notes={notes} onChange={onNotesChange} />
          </div>
        )}
      </div>

      {/* footer totals */}
      <div className="flex flex-col gap-3 border-border border-t p-4">
        <DiscountRow
          disabled={empty}
          onChange={onDiscountInputChange}
          value={discountInput}
        />
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">
              {applyCurrencyMask(cart.subtotal)}
            </span>
          </div>
          {discountValue > 0 ? (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Desconto</span>
              <span className="text-success tabular-nums">
                − {applyCurrencyMask(discountValue)}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex items-baseline justify-between">
          <span className="text-foreground text-sm">Total</span>
          <span className="font-semibold text-3xl text-foreground tabular-nums tracking-tight">
            {applyCurrencyMask(total)}
          </span>
        </div>
        <Button
          className="h-12 w-full text-[15px]"
          disabled={empty}
          onClick={onCheckout}
          type="button"
        >
          Finalizar venda
          <ArrowRight className="size-[18px]" />
        </Button>
      </div>
    </aside>
  );
}

function DiscountRow({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (next: string) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);

  if (!(open || value)) {
    return (
      <button
        className="inline-flex items-center justify-center gap-1.5 font-medium text-primary text-sm disabled:opacity-50"
        disabled={disabled}
        onClick={() => setOpen(true)}
        type="button"
      >
        <Tag className="size-4" /> Aplicar desconto
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Tag className="size-4 text-muted-foreground" />
      <Input
        className="h-9"
        inputMode="decimal"
        onChange={(event) => {
          const digits = removeCurrencyMask(event.target.value);
          onChange(digits ? applyCurrencyMask(digits) : '');
        }}
        placeholder="R$ 0,00 de desconto"
        value={value}
      />
      <button
        aria-label="Remover desconto"
        className="text-muted-foreground"
        onClick={() => {
          onChange('');
          setOpen(false);
        }}
        type="button"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}

function ClienteBlock({
  customer,
  onChange,
}: {
  customer: CustomerDraft;
  onChange: (next: CustomerDraft) => void;
}) {
  const hasData = Boolean(customer.name || customer.phone || customer.email);
  const [open, setOpen] = useState(false);

  if (!(open || hasData)) {
    return (
      <GhostRow
        icon={<UserPlus className="size-4" />}
        onClick={() => setOpen(true)}
      >
        Adicionar cliente
      </GhostRow>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-md bg-muted p-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-foreground text-xs">Cliente</span>
        <button
          aria-label="Remover cliente"
          className="text-muted-foreground"
          onClick={() => {
            onChange({ name: '', phone: '', email: '' });
            setOpen(false);
          }}
          type="button"
        >
          <X className="size-3.5" />
        </button>
      </div>
      <Input
        className="h-9"
        onChange={(event) =>
          onChange({ ...customer, name: event.target.value })
        }
        placeholder="Nome do cliente"
        value={customer.name}
      />
      <div className="flex gap-2">
        <Input
          className="h-9 min-w-0"
          inputMode="tel"
          onChange={(event) =>
            onChange({ ...customer, phone: event.target.value })
          }
          placeholder="Celular"
          value={customer.phone}
        />
        <Input
          className="h-9 min-w-0"
          inputMode="email"
          onChange={(event) =>
            onChange({ ...customer, email: event.target.value })
          }
          placeholder="E-mail"
          value={customer.email}
        />
      </div>
    </div>
  );
}

function ObsBlock({
  notes,
  onChange,
}: {
  notes: string;
  onChange: (next: string) => void;
}) {
  const [open, setOpen] = useState(false);

  if (!(open || notes)) {
    return (
      <GhostRow
        icon={<StickyNote className="size-4" />}
        onClick={() => setOpen(true)}
      >
        Adicionar observação
      </GhostRow>
    );
  }

  return (
    <textarea
      className="min-h-[60px] w-full resize-none rounded-sm border border-input bg-card px-3 py-2 text-foreground text-sm shadow-xs outline-none focus-visible:border-ring"
      onChange={(event) => onChange(event.target.value)}
      placeholder="Observação da venda (ex.: troca até 7 dias, embrulho para presente…)"
      value={notes}
    />
  );
}

function GhostRow({
  icon,
  onClick,
  children,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="flex w-full items-center gap-2 rounded-md border border-border border-dashed px-2.5 py-2 font-medium text-muted-foreground text-sm transition-colors hover:bg-muted"
      onClick={onClick}
      type="button"
    >
      {icon}
      <span>{children}</span>
    </button>
  );
}
