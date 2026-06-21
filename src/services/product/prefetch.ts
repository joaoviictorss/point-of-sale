import type { inferInput } from '@trpc/tanstack-react-query';
import { prefetch, trpc } from '@/trpc/server';

type GetAllFromOrganizationInput = inferInput<
  typeof trpc.product.getAllFromOrganization
>;

type GetByIdInput = inferInput<typeof trpc.product.getById>;

export const prefetchProductsFromOrganization = (
  input: GetAllFromOrganizationInput
) => {
  return prefetch(trpc.product.getAllFromOrganization.queryOptions(input));
};

export const prefetchProductById = (input: GetByIdInput) => {
  return prefetch(trpc.product.getById.queryOptions(input));
};
