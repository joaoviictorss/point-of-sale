import type { ProductType, StockUnit } from '@prisma/client';
import { useCallback, useMemo, useState } from 'react';

export interface CartProduct {
  id: string;
  code: string;
  name: string;
  /** preço de venda em centavos */
  salePrice: number;
  stock: number;
  category?: string | null;
  productType: ProductType;
  stockUnit: StockUnit;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

// produtos por peso/volume vendem fração (1,5 kg); por unidade, só inteiro
const FRACTIONAL_STEP = 0.1;
const QUANTITY_PRECISION = 3;

function roundQuantity(value: number) {
  const factor = 10 ** QUANTITY_PRECISION;
  return Math.round(value * factor) / factor;
}

function stepFor(productType: ProductType) {
  return productType === 'UNIT' ? 1 : FRACTIONAL_STEP;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((product: CartProduct, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: roundQuantity(item.quantity + quantity) }
            : item
        );
      }

      return [...current, { ...product, quantity: roundQuantity(quantity) }];
    });
  }, []);

  const inc = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: roundQuantity(
                item.quantity + stepFor(item.productType)
              ),
            }
          : item
      )
    );
  }, []);

  const dec = useCallback((id: string) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }
        const next = roundQuantity(item.quantity - stepFor(item.productType));
        return next <= 0 ? [] : [{ ...item, quantity: next }];
      })
    );
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }
        const next = roundQuantity(quantity);
        return next <= 0 ? [] : [{ ...item, quantity: next }];
      })
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + Math.round(item.salePrice * item.quantity),
        0
      ),
    [items]
  );

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  return {
    items,
    add,
    inc,
    dec,
    setQuantity,
    remove,
    clear,
    subtotal,
    count,
  };
}

export type UseCartReturn = ReturnType<typeof useCart>;
