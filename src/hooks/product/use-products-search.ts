import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/hooks";
import type { GetProductsParams } from "@/services/product/get-products";
import { getProducts } from "@/services/product/get-products";

interface UseProductsSearchParams extends Omit<GetProductsParams, "search"> {
  organizationSlug: string;
  searchTerm: string;
  enabled?: boolean;
  searchDelay?: number;
}

export function useProductsSearch({
  organizationSlug,
  searchTerm,
  enabled = true,
  searchDelay = 300,
  ...params
}: UseProductsSearchParams) {
  const debouncedSearchTerm = useDebounce({
    value: searchTerm,
    delay: searchDelay,
  });

  return useQuery({
    queryKey: [
      "products",
      organizationSlug,
      { ...params, search: debouncedSearchTerm },
    ],
    queryFn: () =>
      getProducts(organizationSlug, { ...params, search: debouncedSearchTerm }),
    enabled: enabled && !!organizationSlug,
  });
}
