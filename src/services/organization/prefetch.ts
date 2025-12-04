import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.organization.getOrganizationsFromUser>;

export const prefetchOrganizationsFromUser = (input: Input) => {
  return prefetch(
    trpc.organization.getOrganizationsFromUser.queryOptions(input)
  );
};
