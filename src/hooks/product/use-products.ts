import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { useOrganization } from '@/contexts/organization-context';
import { useTRPC } from '@/trpc/client';
import { useProductsParams } from './use-products-params';

export const useSuspenseProducts = () => {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();
  const [params] = useProductsParams();

  return useSuspenseQuery(
    trpc.product.getAllFromOrganization.queryOptions({
      organizationSlug,
      ...params,
    })
  );
};

export const useSuspenseProductById = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.product.getById.queryOptions({ id }));
};

export const useCreateProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { slug: organizationSlug } = useOrganization();

  return useMutation(
    trpc.product.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.product.getAllFromOrganization.queryOptions({ organizationSlug })
        );
      },
    })
  );
};

export const useUpdateProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { slug: organizationSlug } = useOrganization();

  return useMutation(
    trpc.product.update.mutationOptions({
      onSuccess: (data) => {
        queryClient.invalidateQueries(
          trpc.product.getAllFromOrganization.queryOptions({ organizationSlug })
        );
        queryClient.invalidateQueries(
          trpc.product.getById.queryOptions({ id: data.id })
        );
      },
    })
  );
};

export const useDeleteProduct = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { slug: organizationSlug } = useOrganization();

  return useMutation(
    trpc.product.delete.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(
          trpc.product.getAllFromOrganization.queryOptions({ organizationSlug })
        );
      },
    })
  );
};
