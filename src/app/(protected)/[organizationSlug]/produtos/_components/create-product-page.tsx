'use client';

import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/shadcn';
import { Card, CardContent } from '@/components/shadcn/card';
import { useOrganization } from '@/contexts/organization-context';
import { useCreateProduct } from '@/hooks/product/use-products';
import {
  type ProductFormInput,
  type ProductFormSchema,
  productFormSchema,
} from '@/services/product/schemas';
import { ProductForm } from './product-form';
import { ProductPreview } from './product-preview';

const defaultValues: ProductFormInput = {
  code: '',
  name: '',
  costPrice: 0,
  salePrice: 0,
  category: '',
  productType: 'UNIT',
  stock: 0,
  stockUnit: 'UNITS',
  minStock: undefined,
  maxStock: undefined,
  medias: [],
};

export function CreateProductPage() {
  const router = useRouter();
  const { slug: organizationSlug } = useOrganization();
  const createProduct = useCreateProduct();
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  const form = useForm<ProductFormInput, unknown, ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ProductFormSchema) => {
    createProduct.mutate(
      { organizationSlug, ...values },
      {
        onSuccess: () => {
          toast.success('Produto criado com sucesso');
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

  return (
    <div className="flex flex-1 flex-col gap-5 bg-gray-50 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Voltar"
            disabled={createProduct.isPending}
            onClick={handleCancel}
            size="icon"
            variant="outline"
          >
            <ArrowLeftIcon />
          </Button>

          <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            Novo produto
          </h1>
        </div>

        <div className='hidden items-center gap-3 sm:flex'>
          <Button
            className="flex-1 sm:flex-none"
            disabled={createProduct.isPending}
            form="product-form"
            type="submit"
          >
            <CheckIcon className="size-4" />
            {createProduct.isPending ? 'Salvando...' : 'Salvar produto'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ProductForm
          form={form}
          loading={createProduct.isPending}
          onCoverChange={setCoverUrl}
          onSubmit={onSubmit}
        />

        <Card className="sticky top-[88px] hidden xl:block">
          <CardContent>
            <ProductPreview coverUrl={coverUrl} form={form} />
          </CardContent>
        </Card>
      </div>
      <Button
        className='flex-1 sm:hidden sm:flex-none'
        disabled={createProduct.isPending}
        form="product-form"
        type="submit"
      >
        <CheckIcon className="size-4" />
        {createProduct.isPending ? 'Salvando...' : 'Salvar produto'}
      </Button>
    </div>
  );
}
