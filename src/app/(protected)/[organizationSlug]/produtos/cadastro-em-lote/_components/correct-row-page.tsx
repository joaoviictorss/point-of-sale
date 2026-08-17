'use client';

import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/shadcn/button';
import type { ImportRowResult } from '@/services/product/import-schemas';
import {
  type ProductFormInput,
  type ProductFormSchema,
  productFormSchema,
} from '@/services/product/schemas';
import { ProductForm } from '../../_components/product-form';

interface CorrectRowPageProps {
  row: ImportRowResult;
  onCancel: () => void;
  onSave: (rowNumber: number, data: ProductFormSchema) => void;
}

export function CorrectRowPage({ row, onCancel, onSave }: CorrectRowPageProps) {
  const form = useForm<ProductFormInput, unknown, ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { ...row.data, medias: [] },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: só roda uma vez ao montar — cada linha ganha uma instância nova desta página
  useEffect(() => {
    for (const [field, message] of Object.entries(row.errors)) {
      form.setError(field as keyof ProductFormSchema, {
        message,
        type: 'manual',
      });
    }
  }, []);

  const handleSubmit = (values: ProductFormSchema) => {
    onSave(row.rowNumber, values);
  };

  return (
    <div className="flex flex-1 flex-col gap-5 bg-gray-50 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Voltar"
            onClick={onCancel}
            size="icon"
            variant="outline"
          >
            <ArrowLeftIcon />
          </Button>
          <div>
            <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
              Corrigir produto
            </h1>
            <p className="text-muted-foreground text-sm">
              Dados vindos da planilha (linha {row.rowNumber}). Corrija os
              campos destacados para liberar o cadastro.
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-3 sm:flex">
          <Button form="product-form" type="submit">
            <CheckIcon className="size-4" />
            Salvar e validar
          </Button>
        </div>
      </div>

      <ProductForm form={form} loading={false} onSubmit={handleSubmit} />

      <Button className="sm:hidden" form="product-form" type="submit">
        <CheckIcon className="size-4" />
        Salvar e validar
      </Button>
    </div>
  );
}
