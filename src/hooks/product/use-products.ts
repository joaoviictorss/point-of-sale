import { useQuery } from "@tanstack/react-query";
import type { GetProductsParams } from "@/services/product/get-products";
import { getProducts } from "@/services/product/get-products";

interface UseProductsParams extends GetProductsParams {
  organizationSlug: string;
  enabled?: boolean;
}

export function useProducts({
  organizationSlug,
  enabled = true,
  ...params
}: UseProductsParams) {
  return useQuery({
    queryKey: ["products", organizationSlug, params],
    queryFn: () => getProducts(organizationSlug, params),
    enabled: enabled && !!organizationSlug,
  });
}
