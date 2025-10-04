import { getProducts } from "@/services/product/get-products";
import type { GetProductsResponse } from "@/types/api/product";
import { usePagination } from "../common/use-pagination";
import { useQueryWithSearch } from "../common/use-query";

interface UseProductsParams {
  organizationSlug: string;
  searchTerm?: string;
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  category?: string;
  productType?: string;
  enabled?: boolean;
}

export function useProducts({
  organizationSlug,
  searchTerm = "",
  page = 1,
  limit = 20,
  order = "desc",
  category,
  productType,
  enabled = true,
}: UseProductsParams) {
  const pagination = usePagination({ initialPage: page, initialLimit: limit });

  const query = useQueryWithSearch<GetProductsResponse>({
    queryKey: [
      "products",
      organizationSlug,
      pagination.page,
      pagination.limit,
      order,
      category,
      productType,
    ],
    queryFn: async () => {
      const response = await getProducts(organizationSlug, {
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
        order,
        category,
        productType,
      });
      return response.data;
    },
    searchTerm,
    enabled: enabled && !!organizationSlug,
  });

  // Estados da paginação baseados na resposta
  const data = query.data;
  const paginationInfo = data?.pagination;
  const hasNextPage = paginationInfo?.hasNextPage ?? false;
  const hasPrevPage = paginationInfo?.hasPrevPage ?? false;
  const totalPages = paginationInfo?.totalPages ?? 0;
  const totalDocs = paginationInfo?.totalDocs ?? 0;
  const currentCount = paginationInfo?.count ?? 0;

  return {
    // Dados da query
    ...query,

    // Estados da paginação
    currentPage: pagination.page,
    currentLimit: pagination.limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalDocs,
    currentCount,

    // Handlers da paginação
    goToPage: pagination.goToPage,
    nextPage: pagination.nextPage,
    prevPage: pagination.prevPage,
    changeLimit: pagination.changeLimit,
    resetPagination: pagination.reset,

    // Estados de loading
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
