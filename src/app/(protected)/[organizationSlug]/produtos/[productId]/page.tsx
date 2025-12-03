"use client";

import {
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Modal } from "@/components";
import type { FileWithPreview } from "@/components/file-input/data";
import { Button } from "@/components/Shadcn";
import { Card, CardContent } from "@/components/Shadcn/card";
import { useProducts } from "@/hooks";
import type { ProductFormSchema as ProductFormType } from "@/lib/validations/product";
import { ProductFormSchema } from "@/lib/validations/product";
import { createMedia, updateMedia } from "@/services/media";
import type { CreateProductRequest } from "@/types/api/product";
import { ProductForm } from "./_components/product-form";
import { ProductPreview } from "./_components/product-preview";

export default function ProductPage() {
  const { organizationSlug, productId } = useParams<{
    organizationSlug: string;
    productId: string;
  }>();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const isCreate = productId === "novo";
  const isEdit = !isCreate;

  const {
    productData: productResponse,
    isFetchingProduct: isFetching,
    productError: error,
  } = useProducts({
    organizationSlug,
    productId: isEdit ? productId : undefined,
    enabled: isEdit,
  });

  const form = useForm({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      code: "",
      name: "",
      costPrice: undefined,
      salePrice: 0,
      imageUrl: "",
      category: "",
      productType: "UNIT" as const,
      stock: 0,
      stockUnit: "UNITS" as const,
      minStock: 0,
      maxStock: 0,
      media: [],
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (isEdit && productResponse?.data) {
      reset({
        code: productResponse.data.code,
        name: productResponse.data.name,
        costPrice: productResponse.data.costPrice
          ? productResponse.data.costPrice
          : undefined,
        salePrice: productResponse.data.salePrice,
        imageUrl: productResponse.data.imageUrl || undefined,
        category: productResponse.data.category || "",
        productType: productResponse.data.productType,
        stock: productResponse.data.stock,
        stockUnit: productResponse.data.stockUnit,
        minStock: productResponse.data.minStock || undefined,
        maxStock: productResponse.data.maxStock || undefined,
        media: productResponse.data.media || [],
      });
    }
  }, [productResponse, reset, isEdit]);

  const { updateProduct, createProduct, deleteProduct } = useProducts({
    organizationSlug,
  });

  const handleCreateProduct = async (values: CreateProductRequest) => {
    const createdProduct = await createProduct.mutateAsync(values);

    // Atualizar medias com o productId
    if (createdProduct.data?.id && allMediaIds.length > 0) {
      await Promise.all(
        allMediaIds.map((mediaId) =>
          updateMedia(organizationSlug, mediaId, {
            productId: createdProduct.data.id,
          })
        )
      );
    }
  };

  const onSubmit = async (values: ProductFormType) => {
    try {
      setLoading(true);

      if (isEdit) {
        if (!productResponse?.data?.id) {
          toast.error("Produto não encontrado");
          return;
        }

        await updateProduct.mutateAsync({
          productId: productResponse.data.id,
          data: values,
        });
      } else {
        await handleCreateProduct(values);
      }

      router.push(`/${organizationSlug}/produtos`);
    } catch {
      // Erro já foi tratado acima ou será tratado pelo toast
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!productResponse?.data?.id) {
      toast.error("Produto não encontrado");
      return;
    }

    try {
      await deleteProduct.mutateAsync(productResponse.data.id);
      router.push(`/${organizationSlug}/produtos`);
    } catch {
      // Error handling can be improved with proper error reporting
    }
  };

  if (isEdit && isFetching) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Carregando produto...</div>
      </div>
    );
  }

  if (isEdit && error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-600">Erro: {error.message}</div>
      </div>
    );
  }

  if (isEdit && !productResponse?.data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Produto não encontrado</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {/* Conteúdo Principal */}
      <div className="flex flex-1 flex-col ">
        <div className="space-y-8 overflow-y-auto px-4 py-6">
          <div className="flex flex-shrink-0 items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <Button onClick={handleCancel} size="icon" variant="outline">
                <ArrowLeftIcon />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-2xl text-slate-900">
                    {isEdit ? "Editar Produto" : "Novo Produto"}
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isEdit && (
                <Button onClick={handleOpenDeleteModal} variant="destructive">
                  <TrashIcon className="size-4" />
                  Excluir
                </Button>
              )}
              <Button form="product-form" type="submit">
                <CheckIcon className="size-4" />
                {isEdit ? "Salvar Alterações" : "Criar Produto"}
              </Button>
            </div>
          </div>

          <div className="flex h-full w-full flex-1 gap-4">
            <Card className="flex-1 p-0">
              <CardContent className="p-0">
                <ProductForm
                  form={form as UseFormReturn<ProductFormType>}
                  loading={loading}
                  onSubmit={onSubmit}
                />
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardContent>
                <div className="hidden w-80 lg:block">
                  <div className="h-full overflow-y-auto">
                    <ProductPreview
                      form={form as UseFormReturn<ProductFormType>}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isEdit && productResponse?.data && (
        <Modal
          actions={[
            {
              label: "Cancelar",
              onClick: () => setIsDeleteModalOpen(false),
              variant: "outline",
              shouldRender: true,
              disabled: deleteProduct.isPending,
            },
            {
              label: "Excluir",
              onClick: handleConfirmDelete,
              variant: "destructive",
              shouldRender: true,
              disabled: deleteProduct.isPending,
              loading: deleteProduct.isPending,
            },
          ]}
          description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
          onOpenChange={setIsDeleteModalOpen}
          open={isDeleteModalOpen}
          title="Excluir Produto"
        />
      )}
    </div>
  );
}
