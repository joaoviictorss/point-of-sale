import type { inferInput } from '@trpc/tanstack-react-query';
import { prefetch, trpc } from '@/trpc/server';

type GetAllFromOrganizationInput = inferInput<
  typeof trpc.seller.getAllFromOrganization
>;

type GetActiveOptionsInput = inferInput<typeof trpc.seller.getActiveOptions>;

type GetByIdInput = inferInput<typeof trpc.seller.getById>;

export const prefetchSellersFromOrganization = (
  input: GetAllFromOrganizationInput
) => {
  return prefetch(trpc.seller.getAllFromOrganization.queryOptions(input));
};

export const prefetchActiveSellers = (input: GetActiveOptionsInput) => {
  return prefetch(trpc.seller.getActiveOptions.queryOptions(input));
};

export const prefetchSellerById = (input: GetByIdInput) => {
  return prefetch(trpc.seller.getById.queryOptions(input));
};
