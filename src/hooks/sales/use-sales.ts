import { useQuery } from "@tanstack/react-query";

// TODO: Implementar serviço de vendas
// import { getSales } from "@/services/sales/get-sales";

interface UseSalesParams {
  organizationSlug: string;
  enabled?: boolean;
  limit?: number;
  page?: number;
}

export function useSales({
  organizationSlug,
  enabled = true,
  limit = 10,
  page = 1,
}: UseSalesParams) {
  return useQuery({
    queryKey: ["sales", organizationSlug, { limit, page }],
    queryFn: () => {
      // TODO: Implementar quando o serviço estiver pronto
      // return getSales(organizationSlug, { limit, page });
      throw new Error("Serviço de vendas não implementado ainda");
    },
    enabled: enabled && !!organizationSlug,
  });
}
