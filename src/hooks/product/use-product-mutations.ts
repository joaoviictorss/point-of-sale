import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      toast.success("Produto atualizado com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao atualizar produto";
      toast.error(errorMessage);
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
      toast.success("Produto deletado com sucesso");
    },
    onError: (error) => {
      const errorMessage = error.message || "Erro ao deletar produto";
      toast.error(errorMessage);
      throw error;
    },
  });

  return {
    createProduct: createProductMutation,
    updateProduct: updateProductMutation,
    deleteProduct: deleteProductMutation,
  };
}
