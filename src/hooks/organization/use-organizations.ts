import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export const useSuspenseOrganizations = () => {
  const trpc = useTRPC();

  return useSuspenseQuery(
    trpc.organization.getOrganizationsFromUser.queryOptions()
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
