import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/services/product";
import type {
  CreateProductRequest,
  UpdateProductRequest,
} from "@/types/api/product";

interface UseProductMutationsParams {
  organizationSlug: string;
}

export function useProductMutations({
  organizationSlug,
}: UseProductMutationsParams) {
  const queryClient = useQueryClient();

  const createProductMutation = useMutation({
    mutationFn: (data: CreateProductRequest) =>
      createProduct(organizationSlug, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
    },
    onError: (error) => {
      // TODO: Implementar toast de erro
      throw error;
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: string;
      data: UpdateProductRequest;
    }) => updateProduct(organizationSlug, productId, data),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
      queryClient.invalidateQueries({
        queryKey: ["product", organizationSlug, productId],
      });
    },
    onError: (error) => {
      // TODO: Implementar toast de erro
      throw error;
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId: string) =>
      deleteProduct(organizationSlug, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products", organizationSlug],
      });
    },
    onError: (error) => {
      // TODO: Implementar toast de erro
      throw error;
    },
  });

  return {
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deleteProduct: deleteProductMutation,
  };
}
