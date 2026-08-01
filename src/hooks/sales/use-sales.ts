import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useOrganization } from '@/contexts/organization-context';
import { useTRPC } from '@/trpc/client';
import { useSalesParams } from './use-sales-params';

export const useSuspenseSales = () => {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();
  const [params] = useSalesParams();

  return useSuspenseQuery(
    trpc.sale.getAllFromOrganization.queryOptions({
      organizationSlug,
      ...params,
    })
  );
};

export const useSuspenseSaleById = (id: string) => {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();

  return useSuspenseQuery(
    trpc.sale.getById.queryOptions({ organizationSlug, id })
  );
};

export const useCreateSale = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { slug: organizationSlug } = useOrganization();

  return useMutation(
    trpc.sale.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.sale.getAllFromOrganization.queryOptions({ organizationSlug })
        );
        // a venda baixa estoque, então a listagem de produtos também muda
        queryClient.invalidateQueries(
          trpc.product.getAllFromOrganization.queryOptions({ organizationSlug })
        );
      },
    })
  );
};
