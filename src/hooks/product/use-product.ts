import { useQuery } from "@tanstack/react-query";
import { getProduct } from "@/services/product/get-product";

interface UseProductParams {
  organizationSlug: string;
  productId: string;
  enabled?: boolean;
}

export function useProduct({
  organizationSlug,
  productId,
  enabled = true,
}: UseProductParams) {
  return useQuery({
    queryKey: ["product", organizationSlug, productId],
    queryFn: () => getProduct(organizationSlug, productId),
    enabled: enabled && !!organizationSlug && !!productId,
  });
}
