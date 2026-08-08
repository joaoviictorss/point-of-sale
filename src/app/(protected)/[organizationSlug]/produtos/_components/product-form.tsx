import type { UseFormReturn } from 'react-hook-form';
import { Input, Select } from '@/components';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/shadcn/card';
import { cn } from '@/lib/utils';
import type {
  ProductFormInput,
  ProductFormSchema,
} from '@/services/product/schemas';
import { productTypeOptions, stockUnitOptions } from '@/utils/constants';
import { applyCurrencyMask, removeCurrencyMask } from '@/utils/functions';
import { MediaUploadSection } from './media-upload-section';

interface FormSectionProps {
  title: string;
  hint: string;
  children: React.ReactNode;
}

function FormSection({ title, hint, children }: FormSectionProps) {
  return (
    <Card className="gap-5">
      <CardHeader className="gap-0.5">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-[13px]">{hint}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">{children}</CardContent>
    </Card>
  );
}

interface ProductFormProps {
  form: UseFormReturn<ProductFormInput, unknown, ProductFormSchema>;
  loading: boolean;
  onSubmit: (values: ProductFormSchema) => void;
  initialMedias?: { id: string; url: string }[];
  onCoverChange?: (url: string | null) => void;
}

export function ProductForm({
  form,
  loading,
  onSubmit,
  initialMedias,
  onCoverChange,
}: ProductFormProps) {
  const {
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;

  const costPrice = Number(watch('costPrice')) || 0;
  const salePrice = Number(watch('salePrice')) || 0;
  const margin =
    salePrice > 0 ? ((salePrice - costPrice) / salePrice) * 100 : null;

  return (
    <form
      className="flex flex-col gap-4"
      id="product-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormSection
        hint="Como o produto aparece no caixa e na busca."
        title="Identificação"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[220px_1fr]">
          <Input
            className="font-mono"
            disabled={loading}
            error={errors.code?.message}
            label="Código"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue('code', e.target.value)
            }
            placeholder="7891234"
            required
            value={watch('code') as string}
          />

          <Input
            disabled={loading}
            error={errors.name?.message}
            label="Nome do produto"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue('name', e.target.value)
            }
            placeholder="Fone de ouvido Bluetooth"
            required
            value={watch('name') as string}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            disabled={loading}
            error={errors.category?.message}
            label="Categoria"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue('category', e.target.value)
            }
            placeholder="Eletrônicos"
            required
            value={watch('category') as string}
          />

          <Select
            disabled={loading}
            error={errors.productType?.message}
            label="Tipo de produto"
            onValueChange={(value: string) =>
              setValue('productType', value as 'UNIT' | 'WEIGHT' | 'VOLUME')
            }
            options={productTypeOptions}
            placeholder="Selecione o tipo"
            required
            value={watch('productType') as string}
          />
        </div>
      </FormSection>

      <FormSection hint="A margem é calculada automaticamente." title="Preços">
        <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_160px]">
          <Input
            className="font-mono"
            disabled={loading}
            error={errors.costPrice?.message}
            label="Preço de custo"
            onChange={(e) => {
              setValue('costPrice', Number(removeCurrencyMask(e.target.value)));
            }}
            placeholder="R$ 0,00"
            type="text"
            value={applyCurrencyMask(costPrice)}
          />

          <Input
            className="font-mono"
            disabled={loading}
            error={errors.salePrice?.message}
            label="Preço de venda"
            onChange={(e) => {
              setValue('salePrice', Number(removeCurrencyMask(e.target.value)));
            }}
            placeholder="R$ 0,00"
            required
            type="text"
            value={applyCurrencyMask(salePrice)}
          />

          <div className="flex h-9 items-center justify-between rounded-md border border-border bg-gray-50 px-3">
            <span className="text-[13px] text-text-muted">Margem</span>
            <span
              className={cn(
                'font-mono font-semibold text-sm',
                margin === null && 'text-text-muted',
                margin !== null && margin >= 0 && 'text-success',
                margin !== null && margin < 0 && 'text-error'
              )}
            >
              {margin === null
                ? '—'
                : `${margin.toLocaleString('pt-BR', {
                    minimumFractionDigits: 1,
                    maximumFractionDigits: 1,
                  })}%`}
            </span>
          </div>
        </div>
      </FormSection>

      <FormSection
        hint="Mínimo e máximo são opcionais e geram alertas na lista."
        title="Controle de estoque"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            className="font-mono"
            disabled={loading}
            error={errors.stock?.message}
            label="Estoque atual"
            min="0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue('stock', Number(e.target.value))
            }
            placeholder="0"
            required
            type="number"
            value={watch('stock') as number}
          />

          <Select
            disabled={loading}
            error={errors.stockUnit?.message}
            label="Unidade"
            onValueChange={(value: string) =>
              setValue(
                'stockUnit',
                value as
                  | 'UNITS'
                  | 'GRAMS'
                  | 'KILOGRAMS'
                  | 'LITERS'
                  | 'MILLILITERS'
              )
            }
            options={stockUnitOptions}
            placeholder="Selecione a unidade"
            required
            value={watch('stockUnit') as string}
          />

          <Input
            className="font-mono"
            disabled={loading}
            error={errors.minStock?.message}
            label="Estoque mínimo"
            min="0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(
                'minStock',
                e.target.value === '' ? 0 : Number(e.target.value)
              )
            }
            placeholder="0"
            type="number"
            value={(watch('minStock') as number) || ''}
          />

          <Input
            className="font-mono"
            disabled={loading}
            error={errors.maxStock?.message}
            label="Estoque máximo"
            min="0"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue(
                'maxStock',
                e.target.value === '' ? 0 : Number(e.target.value)
              )
            }
            placeholder="0"
            type="number"
            value={(watch('maxStock') as number) || ''}
          />
        </div>
      </FormSection>

      <FormSection
        hint="A primeira imagem é usada como miniatura na lista."
        title="Mídia"
      >
        <MediaUploadSection
          disabled={loading}
          form={form}
          initialMedias={initialMedias}
          onCoverChange={onCoverChange}
        />
      </FormSection>
    </form>
  );
}
