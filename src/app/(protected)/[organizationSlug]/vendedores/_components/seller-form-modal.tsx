'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Checkbox, Input, Modal } from '@/components';
import { useOrganization } from '@/contexts/organization-context';
import { useCreateSeller, useUpdateSeller } from '@/hooks/seller/use-sellers';
import {
  type SellerFormInput,
  type SellerFormSchema,
  sellerFormSchema,
} from '@/services/seller/schemas';

export type EditableSeller = {
  id: string;
  name: string;
  code: string | null;
  active: boolean;
};

type SellerFormModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: EditableSeller | null;
};

const EMPTY_SELLER: SellerFormInput = {
  name: '',
  code: '',
  active: true,
};

export const SellerFormModal = ({
  open,
  onOpenChange,
  seller,
}: SellerFormModalProps) => {
  const { slug: organizationSlug } = useOrganization();
  const createSeller = useCreateSeller();
  const updateSeller = useUpdateSeller();

  const isEditing = Boolean(seller);
  const isPending = createSeller.isPending || updateSeller.isPending;

  const form = useForm<SellerFormInput, unknown, SellerFormSchema>({
    resolver: zodResolver(sellerFormSchema),
    defaultValues: EMPTY_SELLER,
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

    reset(
      seller
        ? { name: seller.name, code: seller.code ?? '', active: seller.active }
        : EMPTY_SELLER
    );
  }, [open, seller, reset]);

  const onSubmit = (values: SellerFormSchema) => {
    const onSuccess = () => {
      toast.success(
        isEditing ? 'Vendedor atualizado' : 'Vendedor criado com sucesso'
      );
      onOpenChange(false);
    };
    const onError = (error: { message: string }) => toast.error(error.message);

    if (seller) {
      updateSeller.mutate(
        { organizationSlug, id: seller.id, ...values },
        { onSuccess, onError }
      );
      return;
    }

    createSeller.mutate(
      { organizationSlug, ...values },
      { onSuccess, onError }
    );
  };

  return (
    <Modal
      actions={[
        {
          label: 'Cancelar',
          onClick: () => onOpenChange(false),
          variant: 'outline',
          disabled: isPending,
        },
        {
          label: isEditing ? 'Salvar' : 'Criar vendedor',
          onClick: handleSubmit(onSubmit),
          disabled: isPending,
          loading: isPending,
        },
      ]}
      description={
        isEditing
          ? 'Atualize os dados do vendedor.'
          : 'Cadastre quem atende no caixa ou no salão para creditar as vendas.'
      }
      onOpenChange={onOpenChange}
      open={open}
      title={isEditing ? 'Editar vendedor' : 'Novo vendedor'}
    >
      <form
        className="flex flex-col gap-4"
        id="seller-form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          autoFocus
          disabled={isPending}
          error={errors.name?.message}
          label="Nome"
          onChange={(event) => setValue('name', event.target.value)}
          placeholder="Digite o nome do vendedor"
          required
          value={watch('name')}
        />

        <Input
          className="font-mono"
          disabled={isPending}
          error={errors.code?.message}
          label="Código (opcional)"
          onChange={(event) => setValue('code', event.target.value)}
          placeholder="01"
          value={watch('code') ?? ''}
        />
        <span className="-mt-2 text-muted-foreground text-xs">
          Matrícula ou número do crachá. Serve para selecionar o vendedor
          digitando durante a venda.
        </span>

        <Checkbox
          checked={watch('active')}
          disabled={isPending}
          id="seller-active"
          label="Vendedor ativo"
          onCheckedChange={(checked) => setValue('active', checked === true)}
        />
      </form>
    </Modal>
  );
};
