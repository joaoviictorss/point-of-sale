import {
  ChartBarIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import type { UseFormReturn } from 'react-hook-form';
import type {
  ProductFormInput,
  ProductFormSchema,
} from '@/services/product/schemas';
import { stockUnitOptions } from '@/utils/constants';
import { applyCurrencyMask, getLabelFromValue } from '@/utils/functions';

interface ProductPreviewProps {
  form: UseFormReturn<ProductFormInput, unknown, ProductFormSchema>;
  coverUrl?: string | null;
}

export function ProductPreview({ form, coverUrl }: ProductPreviewProps) {
  const { watch } = form;

  const name = (watch('name') as string) || 'Nome do produto';
  const code = (watch('code') as string) || '—';
  const category = (watch('category') as string) || 'Sem categoria';
  const stock = (watch('stock') as number) || 0;
  const minStock = watch('minStock') as number | undefined;
  const maxStock = watch('maxStock') as number | undefined;
  const stockUnitLabel =
    getLabelFromValue(watch('stockUnit') as string, stockUnitOptions) ||
    'unidades';

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-base text-foreground">
        Como vai aparecer
      </h3>

      <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-[10px] bg-muted">
        {coverUrl ? (
          <Image
            alt={name}
            className="h-full w-full object-cover"
            height={320}
            src={coverUrl}
            width={320}
          />
        ) : (
          <PhotoIcon className="size-10 text-text-muted" />
        )}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-base text-foreground">{name}</span>
        <span className="font-mono text-[13px] text-text-muted">
          #{code} · {category}
        </span>
      </div>

      <div className="flex flex-col border-border border-t">
        <div className="flex items-center justify-between border-border border-b py-3">
          <span className="text-[13px] text-text-muted">Preço de venda</span>
          <span className="font-mono font-semibold text-foreground text-sm">
            {applyCurrencyMask((watch('salePrice') as number) || 0)}
          </span>
        </div>

        <div className="flex items-center justify-between py-3">
          <span className="text-[13px] text-text-muted">Estoque</span>
          <span className="font-medium font-mono text-foreground text-sm">
            {stock} {stockUnitLabel}
          </span>
        </div>
      </div>

      {Boolean(minStock) && stock <= Number(minStock) && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3">
          <ExclamationTriangleIcon className="size-4 shrink-0 text-destructive" />
          <span className="text-destructive text-sm">
            Estoque baixo! Abaixo do mínimo.
          </span>
        </div>
      )}

      {Boolean(maxStock) && stock >= Number(maxStock) && (
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
          <ChartBarIcon className="size-4 shrink-0 text-primary" />
          <span className="text-primary text-sm">
            Estoque no limite máximo.
          </span>
        </div>
      )}
    </div>
  );
}
