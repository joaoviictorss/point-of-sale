import type { inferInput } from '@trpc/tanstack-react-query';
import { prefetch, trpc } from '@/trpc/server';

type GetAllFromOrganizationInput = inferInput<
  typeof trpc.sale.getAllFromOrganization
>;

type GetByIdInput = inferInput<typeof trpc.sale.getById>;

export const prefetchSalesFromOrganization = (
  input: GetAllFromOrganizationInput
) => {
  return prefetch(trpc.sale.getAllFromOrganization.queryOptions(input));
};

export const prefetchSaleById = (input: GetByIdInput) => {
  return prefetch(trpc.sale.getById.queryOptions(input));
};
