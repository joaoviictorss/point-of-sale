import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrganization } from "@/services/organization/create-organization";
import type { CreateOrganizationRequest } from "@/types/api/organization";

export function useOrganizationMutations() {
  const queryClient = useQueryClient();

  const createOrganizationMutation = useMutation({
    mutationFn: (data: CreateOrganizationRequest) => createOrganization(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["organizations"],
      });
    },
    onError: (error) => {
      // TODO: Implementar toast de erro
      throw error;
    },
  });

  return {
    createOrganization: createOrganizationMutation,
  };
}
