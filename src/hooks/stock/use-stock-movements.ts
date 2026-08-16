import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useOrganization } from '@/contexts/organization-context';
import { useTRPC } from '@/trpc/client';
import { useStockMovementsParams } from './use-stock-movements-params';

export const useSuspenseStockMovements = () => {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();
  const [params] = useStockMovementsParams();

  return useSuspenseQuery(
    trpc.stock.getAllFromOrganization.queryOptions({
      organizationSlug,
      page: params.page,
      pageSize: params.pageSize,
      productId: params.productId ?? undefined,
      type: params.type ?? undefined,
    })
  );
};

export const useCreateStockMovement = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { slug: organizationSlug } = useOrganization();

  return useMutation(
    trpc.stock.createMovement.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.stock.getAllFromOrganization.queryOptions({ organizationSlug })
        );
        // a movimentação altera o estoque do produto, então a listagem também muda
        queryClient.invalidateQueries(
          trpc.product.getAllFromOrganization.queryOptions({ organizationSlug })
        );
      },
    })
  );
};
