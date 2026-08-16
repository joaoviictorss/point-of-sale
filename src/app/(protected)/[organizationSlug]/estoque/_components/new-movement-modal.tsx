'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Input, Modal } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { useOrganization } from '@/contexts/organization-context';
import { useCreateStockMovement } from '@/hooks/stock/use-stock-movements';
import {
  type CreateStockMovementInput,
  type CreateStockMovementSchema,
  createStockMovementSchema,
} from '@/services/stock/schemas';
import { applyCurrencyMask, removeCurrencyMask } from '@/utils/functions';
import { ProductCombobox, type ProductOption } from './product-combobox';

type MovementType = CreateStockMovementSchema['type'];

const TYPE_LABEL: Record<MovementType, string> = {
  PURCHASE: 'Entrada de compra / reposição',
  ADJUSTMENT: 'Ajuste manual',
};

const TYPE_HINT: Record<MovementType, string> = {
  PURCHASE: 'Quantidade recebida. Sempre soma ao estoque atual.',
  ADJUSTMENT:
    'Use um número positivo para adicionar ou negativo para remover (ex.: perda, quebra, contagem).',
};

const EMPTY_MOVEMENT: CreateStockMovementInput = {
  productId: '',
  type: 'PURCHASE',
  quantity: 0,
  reason: '',
  unitCost: undefined,
};

interface NewMovementModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialProduct?: ProductOption | null;
}

export const NewMovementModal = ({
  open,
  onOpenChange,
  initialProduct = null,
}: NewMovementModalProps) => {
  const { slug: organizationSlug } = useOrganization();
  const createMovement = useCreateStockMovement();
  const [selectedProduct, setSelectedProduct] = useState<ProductOption | null>(
    initialProduct
  );

  const form = useForm<
    CreateStockMovementInput,
    unknown,
    CreateStockMovementSchema
  >({
    resolver: zodResolver(createStockMovementSchema),
    defaultValues: EMPTY_MOVEMENT,
  });

  const {
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    if (!open) {
      return;
    }
    reset({ ...EMPTY_MOVEMENT, productId: initialProduct?.id ?? '' });
    setSelectedProduct(initialProduct);
  }, [open, initialProduct, reset]);

  const type = watch('type');

  const onSubmit = (values: CreateStockMovementSchema) => {
    createMovement.mutate(
      { organizationSlug, ...values },
      {
        onSuccess: () => {
          toast.success('Movimentação registrada');
          onOpenChange(false);
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  return (
    <Modal
      actions={[
        {
          label: 'Cancelar',
          onClick: () => onOpenChange(false),
          variant: 'outline',
          disabled: createMovement.isPending,
        },
        {
          label: 'Registrar movimentação',
          onClick: handleSubmit(onSubmit),
          disabled: createMovement.isPending,
          loading: createMovement.isPending,
        },
      ]}
      description="Lança uma entrada de estoque ou corrige a quantidade registrada."
      onOpenChange={onOpenChange}
      open={open}
      title="Nova movimentação"
    >
      <form
        className="flex flex-col gap-4"
        id="stock-movement-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <span className="font-medium text-sm">Produto</span>
          <ProductCombobox
            disabled={createMovement.isPending}
            error={errors.productId?.message}
            onSelect={(product) => {
              setSelectedProduct(product);
              setValue('productId', product.id);
            }}
            product={selectedProduct}
          />
        </div>

        <Select
          disabled={createMovement.isPending}
          onValueChange={(value) => {
            setValue('type', value as MovementType);
            if (value !== 'PURCHASE') {
              setValue('unitCost', undefined);
            }
          }}
          value={type}
        >
          <SelectTrigger className="w-full">
            <SelectValue>{TYPE_LABEL[type]}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PURCHASE">{TYPE_LABEL.PURCHASE}</SelectItem>
            <SelectItem value="ADJUSTMENT">{TYPE_LABEL.ADJUSTMENT}</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex flex-col gap-1">
          <Input
            className="font-mono"
            disabled={createMovement.isPending}
            error={errors.quantity?.message}
            label="Quantidade"
            onChange={(event) =>
              setValue('quantity', Number(event.target.value))
            }
            placeholder="0"
            step="any"
            type="number"
            value={watch('quantity') || ''}
          />
          <span className="text-muted-foreground text-xs">
            {TYPE_HINT[type]}
          </span>
        </div>

        {type === 'PURCHASE' ? (
          <Input
            className="font-mono"
            disabled={createMovement.isPending}
            error={errors.unitCost?.message}
            label="Custo unitário (opcional)"
            onChange={(event) => {
              setValue(
                'unitCost',
                Number(removeCurrencyMask(event.target.value))
              );
            }}
            placeholder="R$ 0,00"
            type="text"
            value={applyCurrencyMask(watch('unitCost') ?? 0)}
          />
        ) : null}

        <Input
          disabled={createMovement.isPending}
          error={errors.reason?.message}
          label={
            type === 'ADJUSTMENT' ? 'Motivo do ajuste' : 'Motivo (opcional)'
          }
          onChange={(event) => setValue('reason', event.target.value)}
          placeholder="Ex.: contagem de estoque, produto avariado"
          required={type === 'ADJUSTMENT'}
          value={watch('reason') ?? ''}
        />
      </form>
    </Modal>
  );
};
