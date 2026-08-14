import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useOrganization } from '@/contexts/organization-context';
import { useTRPC } from '@/trpc/client';
import { useSellersParams } from './use-sellers-params';

export const useActiveSellers = () => {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();

  return useQuery(
    trpc.seller.getActiveOptions.queryOptions({ organizationSlug })
  );
};

export const useSuspenseSellers = () => {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();
  const [params] = useSellersParams();

  return useSuspenseQuery(
    trpc.seller.getAllFromOrganization.queryOptions({
      organizationSlug,
      ...params,
    })
  );
};

const useInvalidateSellers = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { slug: organizationSlug } = useOrganization();

  return () => {
    queryClient.invalidateQueries(
      trpc.seller.getAllFromOrganization.queryOptions({ organizationSlug })
    );
    queryClient.invalidateQueries(
      trpc.seller.getActiveOptions.queryOptions({ organizationSlug })
    );
  };
};

export const useCreateSeller = () => {
  const trpc = useTRPC();
  const invalidateSellers = useInvalidateSellers();

  return useMutation(
    trpc.seller.create.mutationOptions({ onSuccess: invalidateSellers })
  );
};

export const useUpdateSeller = () => {
  const trpc = useTRPC();
  const invalidateSellers = useInvalidateSellers();

  return useMutation(
    trpc.seller.update.mutationOptions({ onSuccess: invalidateSellers })
  );
};

export const useDeleteSeller = () => {
  const trpc = useTRPC();
  const invalidateSellers = useInvalidateSellers();

  return useMutation(
    trpc.seller.delete.mutationOptions({ onSuccess: invalidateSellers })
  );
};
