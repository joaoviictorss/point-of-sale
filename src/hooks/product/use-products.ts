import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import type { getAllProductsFromOrganizationSchema } from "@/services/product/schemas";
import { useTRPC } from "@/trpc/client";

export const useSuspenseProducts = (
  input: getAllProductsFromOrganizationSchema
) => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.product.getAllFromOrganization.queryOptions({
      organizationSlug: input.organizationSlug,
      page: input.page,
      pageSize: input.pageSize,
      search: input.search,
    })
  );
};

export const useCreateOrganization = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.organization.create.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["organizations"],
        });
      },
    })
  );
};
