import { useQuery } from "@tanstack/react-query";
import { getOrganizations } from "@/services/organization/get-organizations";

interface UseOrganizationsParams {
  enabled?: boolean;
}

export function useOrganizations({
  enabled = true,
}: UseOrganizationsParams = {}) {
  return useQuery({
    queryKey: ["organizations"],
    queryFn: getOrganizations,
    enabled,
    staleTime: 5 * 60 * 1000, // Organizações mudam menos frequentemente
  });
}
