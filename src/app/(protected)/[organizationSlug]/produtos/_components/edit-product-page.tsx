'use client';

import {
  ArrowLeftIcon,
  CheckIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Modal } from '@/components';
import { Button } from '@/components/shadcn';
import { Card, CardContent } from '@/components/shadcn/card';
import { useOrganization } from '@/contexts/organization-context';
import {
  useDeleteProduct,
  useSuspenseProductById,
  useUpdateProduct,
} from '@/hooks/product/use-products';
import {
  type ProductFormInput,
  type ProductFormSchema,
  productFormSchema,
} from '@/services/product/schemas';
import { ProductForm } from './product-form';
import { ProductPreview } from './product-preview';

interface EditProductPageProps {
  productId: string;
}

export function EditProductPage({ productId }: EditProductPageProps) {
  const router = useRouter();
  const { slug: organizationSlug } = useOrganization();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Suspense query - sempre executa pois este componente só renderiza quando tem productId
  const { data: product } = useSuspenseProductById(productId);

  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const form = useForm<ProductFormInput, unknown, ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      code: product.code,
      name: product.name,
      costPrice: product.costPrice,
      salePrice: product.salePrice,
      category: product.category ?? '',
      productType: product.productType,
      stock: product.stock,
      stockUnit: product.stockUnit,
      minStock: product.minStock ?? undefined,
      maxStock: product.maxStock ?? undefined,
      medias: product.medias?.map((m) => m.id) ?? [],
    },
  });

  const onSubmit = (values: ProductFormSchema) => {
    updateProduct.mutate(
      { id: productId, organizationSlug, ...values },
      {
        onSuccess: () => {
          toast.success('Produto atualizado com sucesso');
          router.push(`/${organizationSlug}/produtos`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const handleConfirmDelete = () => {
    deleteProduct.mutate(
      { id: productId, organizationSlug },
      {
        onSuccess: () => {
          toast.success('Produto excluído com sucesso');
          router.push(`/${organizationSlug}/produtos`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const isLoading = updateProduct.isPending || deleteProduct.isPending;

  return (
    <div className="h-full w-full">
      <div className="flex flex-1 flex-col">
        <div className="space-y-8 overflow-y-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <Button
                disabled={isLoading}
                onClick={handleCancel}
                size="icon"
                variant="outline"
              >
                <ArrowLeftIcon />
              </Button>
              <h3 className="font-bold text-2xl text-slate-900">
                Editar Produto
              </h3>
            </div>

            <div className="flex items-center gap-4">
              <Button
                disabled={isLoading}
                onClick={() => setIsDeleteModalOpen(true)}
                variant="destructive"
              >
                <TrashIcon className="size-4" />
                Excluir
              </Button>
              <Button disabled={isLoading} form="product-form" type="submit">
                <CheckIcon className="size-4" />
                {updateProduct.isPending ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex h-full w-full flex-1 gap-4">
            <Card className="flex-1 p-0">
              <CardContent className="p-0">
                <ProductForm
                  form={form}
                  initialMedias={
                    product.medias?.map((m) => ({ id: m.id, url: m.url })) ?? []
                  }
                  loading={isLoading}
                  onSubmit={onSubmit}
                />
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardContent>
                <div className="hidden w-80 lg:block">
                  <ProductPreview form={form} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de Delete */}
      <Modal
        actions={[
          {
            label: 'Cancelar',
            onClick: () => setIsDeleteModalOpen(false),
            variant: 'outline',
            shouldRender: true,
            disabled: deleteProduct.isPending,
          },
          {
            label: 'Excluir',
            onClick: handleConfirmDelete,
            variant: 'destructive',
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
    </div>
  );
}
