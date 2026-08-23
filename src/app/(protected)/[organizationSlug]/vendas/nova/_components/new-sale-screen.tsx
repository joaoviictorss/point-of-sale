'use client';

import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/shadcn';
import { Card } from '@/components/shadcn/card';
import { useOrganization } from '@/contexts/organization-context';
import { useUser } from '@/contexts/user-context';
import { useCart } from '@/hooks/sales/use-cart';
import { useLastSellerId } from '@/hooks/sales/use-last-seller';
import { useSaleCatalog } from '@/hooks/sales/use-sale-catalog';
import { useCreateSale } from '@/hooks/sales/use-sales';
import { useActiveSellers } from '@/hooks/seller/use-sellers';
import { removeCurrencyMask } from '@/utils/functions';
import { CartItemsList } from './cart-items-list';
import { CartPanel, type CustomerDraft } from './cart-panel';
import {
  CheckoutModal,
  type CheckoutPayment,
  type ConfirmedSale,
} from './checkout-modal';
import { ProductQuickAdd } from './product-quick-add';

const EMPTY_CUSTOMER: CustomerDraft = { name: '', phone: '', email: '' };

export function NewSaleScreen() {
  const router = useRouter();
  const { slug: organizationSlug } = useOrganization();
  const { user } = useUser();
  const cart = useCart();
  const catalog = useSaleCatalog();
  const createSale = useCreateSale();
  const activeSellers = useActiveSellers();
  const [lastSellerId, setLastSellerId] = useLastSellerId(organizationSlug);

  const [discountInput, setDiscountInput] = useState('');
  const [customer, setCustomer] = useState<CustomerDraft>(EMPTY_CUSTOMER);
  const [notes, setNotes] = useState('');
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [sellerId, setSellerId] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  const sellers = activeSellers.data ?? [];

  useEffect(() => {
    if (sellerId || !lastSellerId) {
      return;
    }
    if (sellers.some((seller) => seller.id === lastSellerId)) {
      setSellerId(lastSellerId);
    }
  }, [sellerId, lastSellerId, sellers]);

  const handleSelectSeller = (id: string) => {
    setSellerId(id);
    setLastSellerId(id);
  };

  const sellerFallbackName = user?.name || user?.email || 'Vendedor';
  const sellerName =
    sellers.find((seller) => seller.id === sellerId)?.name ??
    sellerFallbackName;

  const rawDiscount = Number.parseInt(
    removeCurrencyMask(discountInput) || '0',
    10
  );
  const discountValue = Math.min(rawDiscount, cart.subtotal);
  const total = cart.subtotal - discountValue;

  const resetSale = () => {
    cart.clear();
    setDiscountInput('');
    setCustomer(EMPTY_CUSTOMER);
    setNotes('');
  };

  // Atalhos globais de teclado
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target instanceof HTMLElement &&
        (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');

      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      const finalize =
        event.key === 'F2' || (event.ctrlKey && event.key === 'Enter');
      if (finalize && cart.count > 0 && !checkoutOpen) {
        event.preventDefault();
        setCheckoutOpen(true);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cart.count, checkoutOpen]);

  const handleConfirm = async (
    payment: CheckoutPayment
  ): Promise<ConfirmedSale | null> => {
    const trimmedName = customer.name.trim();
    try {
      const order = await createSale.mutateAsync({
        organizationSlug,
        items: cart.items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        payments: [
          {
            method: payment.method,
            amount: total,
            installments: payment.installments,
          },
        ],
        discount: discountValue,
        discountType: 'FIXED',
        tax: 0,
        sellerId: sellerId ?? undefined,
        customer: trimmedName
          ? {
              name: trimmedName,
              phone: customer.phone.trim() || undefined,
              email: customer.email.trim() || undefined,
            }
          : undefined,
        notes: notes.trim() || undefined,
      });

      resetSale();
      toast.success(
        `Venda nº ${String(order.orderNumber).padStart(4, '0')} registrada`
      );
      return { orderNumber: order.orderNumber };
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Erro ao registrar venda'
      );
      return null;
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-hidden bg-gray-50 p-4 sm:p-6">
      <div className="flex shrink-0 items-center gap-3">
        <Button
          aria-label="Voltar"
          onClick={() => router.back()}
          size="icon"
          variant="outline"
        >
          <ArrowLeftIcon />
        </Button>
        <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
          Nova venda
        </h1>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-[minmax(0,1fr)_360px] lg:overflow-hidden">
        <Card className="min-h-0 gap-3.5 overflow-hidden p-5">
          <ProductQuickAdd
            onAdd={cart.add}
            products={catalog.products}
            search={catalog.search}
            searchInputRef={searchInputRef}
            setSearch={catalog.setSearch}
          />
          <CartItemsList cart={cart} />
        </Card>

        <CartPanel
          cart={cart}
          customer={customer}
          discountInput={discountInput}
          discountValue={discountValue}
          notes={notes}
          onCheckout={() => setCheckoutOpen(true)}
          onCustomerChange={setCustomer}
          onDiscountInputChange={setDiscountInput}
          onNotesChange={setNotes}
          onSelectSeller={handleSelectSeller}
          selectedSellerId={sellerId}
          sellerFallbackName={sellerFallbackName}
          sellers={sellers}
          sellersLoading={activeSellers.isLoading}
          total={total}
        />
      </div>

      <CheckoutModal
        isSubmitting={createSale.isPending}
        onConfirm={handleConfirm}
        onNewSale={() => {
          setCheckoutOpen(false);
          searchInputRef.current?.focus();
        }}
        onOpenChange={setCheckoutOpen}
        open={checkoutOpen}
        sellerName={sellerName}
        total={total}
      />
    </div>
  );
}
