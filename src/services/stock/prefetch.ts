import type { inferInput } from '@trpc/tanstack-react-query';
import { prefetch, trpc } from '@/trpc/server';

type GetAllFromOrganizationInput = inferInput<
  typeof trpc.stock.getAllFromOrganization
>;

export const prefetchStockMovementsFromOrganization = (
  input: GetAllFromOrganizationInput
) => {
  return prefetch(trpc.stock.getAllFromOrganization.queryOptions(input));
};
