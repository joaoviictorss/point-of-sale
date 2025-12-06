import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.product.getAllFromOrganization>;

export const prefetchProductsFromOrganization = (input: Input) => {
  return prefetch(trpc.product.getAllFromOrganization.queryOptions(input));
};
