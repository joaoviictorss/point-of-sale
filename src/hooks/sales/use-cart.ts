import { useCallback, useMemo, useState } from 'react';

export interface CartProduct {
  id: string;
  code: string;
  name: string;
  /** preço de venda em centavos */
  salePrice: number;
  stock: number;
  category?: string | null;
}

export interface CartItem extends CartProduct {
  quantity: number;
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const add = useCallback((product: CartProduct) => {
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }, []);

  const inc = useCallback((id: string) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }, []);

  const dec = useCallback((id: string) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }
        return item.quantity - 1 <= 0
          ? []
          : [{ ...item, quantity: item.quantity - 1 }];
      })
    );
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.id !== id) {
          return [item];
        }
        return quantity <= 0 ? [] : [{ ...item, quantity }];
      })
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.salePrice * item.quantity, 0),
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
