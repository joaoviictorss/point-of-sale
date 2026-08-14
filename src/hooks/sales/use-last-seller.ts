import { useEffect, useState } from 'react';

const storageKey = (organizationSlug: string) =>
  `pos:last-seller:${organizationSlug}`;

// lido após o mount pra evitar mismatch de hidratação (localStorage não existe no server)
export const useLastSellerId = (organizationSlug: string) => {
  const [lastSellerId, setLastSellerIdState] = useState<string | null>(null);

  useEffect(() => {
    setLastSellerIdState(localStorage.getItem(storageKey(organizationSlug)));
  }, [organizationSlug]);

  const setLastSellerId = (id: string | null) => {
    setLastSellerIdState(id);
    if (id) {
      localStorage.setItem(storageKey(organizationSlug), id);
    } else {
      localStorage.removeItem(storageKey(organizationSlug));
    }
  };

  return [lastSellerId, setLastSellerId] as const;
};
