import { useMutation, useQueryClient } from "@tanstack/react-query";

// TODO: Implementar serviços de vendas
// import { createSale, updateSale, deleteSale } from "@/services/sales";

interface UseSalesMutationsParams {
  organizationSlug: string;
}

export function useSalesMutations({
  organizationSlug,
}: UseSalesMutationsParams) {
  const queryClient = useQueryClient();

  const createSaleMutation = useMutation({
    mutationFn: () => {
      // TODO: Implementar quando o serviço estiver pronto
      // return createSale(organizationSlug, saleData);
      throw new Error("Serviço de vendas não implementado ainda");
    },
    onSuccess: () => {
      // Invalida a lista de vendas
      queryClient.invalidateQueries({
        queryKey: ["sales", organizationSlug],
      });
      // Invalida produtos (estoque pode ter mudado)
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
    },
    onError: (error) => {
      // TODO: Implementar toast de erro
      throw error;
    },
  });

  return {
    createSale: createSaleMutation,
  };
}
