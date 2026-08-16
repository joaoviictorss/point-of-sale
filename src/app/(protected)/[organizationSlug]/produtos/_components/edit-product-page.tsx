'use client';

import {
  ArrowLeftIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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

  const { data: product } = useSuspenseProductById(productId);

  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [coverUrl, setCoverUrl] = useState<string | null>(
    product.medias?.[0]?.url ?? null
  );

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

  const isLoading = updateProduct.isPending || deleteProduct.isPending;

  return (
    <div className="flex flex-1 flex-col gap-5 bg-gray-50 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Voltar"
            disabled={isLoading}
            onClick={handleCancel}
            size="icon"
            variant="outline"
          >
            <ArrowLeftIcon />
          </Button>

          <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            Editar produto
          </h1>
        </div>

        <div className="hidden gap-3 sm:flex sm:items-center">
          <Button disabled={isLoading} form="product-form" type="submit">
            <CheckIcon className="size-4" />
            {updateProduct.isPending ? 'Salvando...' : 'Salvar produto'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProductForm
          form={form}
          initialMedias={
            product.medias?.map((m) => ({ id: m.id, url: m.url })) ?? []
          }
          loading={isLoading}
          onCoverChange={setCoverUrl}
          onSubmit={onSubmit}
        />

        <Card className="sticky top-[88px] hidden xl:block">
          <CardContent>
            <ProductPreview coverUrl={coverUrl} form={form} />
          </CardContent>
        </Card>
      </div>

      <Button disabled={isLoading} form="product-form" type="submit" className="flex-1 sm:flex-none sm:hidden">
        <CheckIcon className="size-4" />
        {updateProduct.isPending ? 'Salvando...' : 'Salvar produto'}
      </Button>

    </div>
  );
}
