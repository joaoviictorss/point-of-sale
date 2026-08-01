import { Banknote, CreditCard, type LucideIcon, QrCode } from 'lucide-react';

export type SalePaymentMethod = 'CASH' | 'PIX' | 'CREDIT_CARD' | 'DEBIT_CARD';

export interface PaymentMethodMeta {
  id: SalePaymentMethod;
  label: string;
  icon: LucideIcon;
}

/** Ordem importa: define os atalhos 1–4 no checkout. */
export const PAYMENT_METHODS: PaymentMethodMeta[] = [
  { id: 'CASH', label: 'Dinheiro', icon: Banknote },
  { id: 'PIX', label: 'Pix', icon: QrCode },
  { id: 'CREDIT_CARD', label: 'Crédito', icon: CreditCard },
  { id: 'DEBIT_CARD', label: 'Débito', icon: CreditCard },
];

export const PAYMENT_LABEL: Record<SalePaymentMethod, string> =
  Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label])) as Record<
    SalePaymentMethod,
    string
  >;
