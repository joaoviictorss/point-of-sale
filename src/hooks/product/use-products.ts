import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "@/services/product";
import type {
  CreateProductRequest,
  GetProductsResponse,
  UpdateProductRequest,
} from "@/types/api/product";
import type { ApiSuccessResponse } from "@/types/http";
import { usePagination } from "../common/use-pagination";
import { useQueryWithSearch } from "../common/use-query";

interface UseProductsParams {
  organizationSlug: string;
  // Parâmetros para lista de produtos
  searchTerm?: string;
  page?: number;
  limit?: number;
  order?: "asc" | "desc";
  category?: string;
  productType?: string;
  enabled?: boolean;
  // Parâmetros para produto individual
  productId?: string;
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
  productId,
}: UseProductsParams) {
  const queryClient = useQueryClient();
  const pagination = usePagination({ initialPage: page, initialLimit: limit });

  // Query para lista de produtos
  const productsQuery = useQueryWithSearch<GetProductsResponse>({
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

  // Query para produto individual
  const productQuery = useQuery({
    queryKey: ["product", organizationSlug, productId],
    queryFn: () => getProduct(organizationSlug, productId as string),
    enabled: enabled && !!organizationSlug && !!productId,
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductRequest) =>
      createProduct(organizationSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
      toast.success("Produto criado com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message ?? "Erro ao criar produto";
      toast.error(errorMessage);
      throw error;
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      productId: id,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => updateProduct(organizationSlug, id, data),
    onSuccess: (_, { productId: id }) => {
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", organizationSlug, id],
      });
      toast.success("Produto atualizado com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao atualizar produto";
      toast.error(errorMessage);
      throw error;
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(organizationSlug, id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
      toast.success("Produto deletado com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao deletar produto";
      toast.error(errorMessage);
      throw error;
    },
  });

  // Estados da paginação baseados na resposta
  const productsData = productsQuery.data;
  const paginationInfo = productsData?.pagination;
  const hasNextPage = paginationInfo?.hasNextPage ?? false;
  const hasPrevPage = paginationInfo?.hasPrevPage ?? false;
  const totalPages = paginationInfo?.totalPages ?? 0;
  const totalDocs = paginationInfo?.totalDocs ?? 0;
  const currentCount = paginationInfo?.count ?? 0;

  return {
    // Dados da lista de produtos
    ...productsQuery,
    data: productsData,
    products: productsData?.docs ?? [],

    // Dados do produto individual
    product: productQuery.data,
    productData: productQuery.data as
      | ApiSuccessResponse<import("@/types/api/product").GetProductResponse>
      | undefined,
    isFetchingProduct: productQuery.isFetching,
    productError: productQuery.error,

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

    // Mutations
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deleteProduct: deleteProductMutation,

    // Estados de loading
    isLoading: productsQuery.isLoading,
    isError: productsQuery.isError,
    error: productsQuery.error,
  };
}
