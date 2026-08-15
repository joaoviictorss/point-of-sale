'use client';

import {
  ArchiveBoxIcon,
  ArrowUturnLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';
import { Modal } from '@/components';
import {
  DataTable,
  type RowAction,
  RowActions,
} from '@/components/entity-components/data-table';
import { useOrganization } from '@/contexts/organization-context';
import {
  useDeleteSeller,
  useSuspenseSellers,
  useUpdateSeller,
} from '@/hooks/seller/use-sellers';
import { useSellersParams } from '@/hooks/seller/use-sellers-params';
import { SellerFormModal } from './seller-form-modal';

type SellerItem = ReturnType<
  typeof useSuspenseSellers
>['data']['items'][number];

const columnHelper = createColumnHelper<SellerItem>();

interface SellersListProps {
  isLoading?: boolean;
}

export const SellersList = ({ isLoading }: SellersListProps) => {
  const { slug: organizationSlug } = useOrganization();
  const sellers = useSuspenseSellers();
  const [, setParams] = useSellersParams();

  const updateSeller = useUpdateSeller();
  const deleteSeller = useDeleteSeller();

  const [sellerToEdit, setSellerToEdit] = useState<SellerItem | null>(null);
  const [sellerToDelete, setSellerToDelete] = useState<SellerItem | null>(null);

  const toggleActive = (seller: SellerItem) => {
    updateSeller.mutate(
      {
        organizationSlug,
        id: seller.id,
        name: seller.name,
        code: seller.code ?? undefined,
        active: !seller.active,
      },
      {
        onSuccess: () =>
          toast.success(
            seller.active ? 'Vendedor arquivado' : 'Vendedor reativado'
          ),
        onError: (error) => toast.error(error.message),
      }
    );
  };

  const handleConfirmDelete = () => {
    if (!sellerToDelete) {
      return;
    }

    deleteSeller.mutate(
      { organizationSlug, id: sellerToDelete.id },
      {
        onSuccess: () => {
          toast.success('Vendedor excluído');
          setSellerToDelete(null);
        },
        onError: (error) => toast.error(error.message),
      }
    );
  };

  const rowActions = (seller: SellerItem): RowAction[] => [
    {
      label: 'Editar vendedor',
      icon: PencilIcon,
      onClick: () => setSellerToEdit(seller),
    },
    {
      label: seller.active ? 'Arquivar vendedor' : 'Reativar vendedor',
      icon: seller.active ? ArchiveBoxIcon : ArrowUturnLeftIcon,
      onClick: () => toggleActive(seller),
      disabled: updateSeller.isPending,
    },
    {
      label: 'Excluir vendedor',
      icon: TrashIcon,
      onClick: () => setSellerToDelete(seller),
      variant: 'destructive',
    },
  ];

  const columns = [
    columnHelper.accessor('name', {
      header: 'Vendedor',
      meta: { className: 'min-w-[220px]' },
      cell: ({ getValue }) => <span className="font-medium">{getValue()}</span>,
    }),

    columnHelper.accessor('code', {
      header: 'Código',
      meta: { className: 'min-w-[120px]' },
      cell: ({ getValue }) => {
        const code = getValue();
        return code ? (
          <span className="font-mono">{code}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    }),

    columnHelper.accessor('active', {
      header: 'Status',
      meta: { expand: true, align: 'right' },
      cell: ({ getValue }) =>
        getValue() ? (
          <span className="text-success">Ativo</span>
        ) : (
          <span className="text-muted-foreground">Arquivado</span>
        ),
    }),

    columnHelper.display({
      id: 'actions',
      header: () => null,
      meta: { align: 'right', skeletonClassName: 'ml-auto w-8' },
      cell: ({ row }) => <RowActions actions={rowActions(row.original)} />,
    }),
  ];

  const items = sellers.data.items ?? [];
  const isFetching = sellers.isFetching || isLoading;

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        emptyMessage="Nenhum vendedor encontrado."
        isFetching={isFetching}
        onRowClick={(seller) => setSellerToEdit(seller)}
        pagination={{
          page: sellers.data.page,
          totalPages: sellers.data.totalPages,
          onPageChange: (page) => setParams({ page }),
        }}
        renderMobileCard={(seller) => (
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="truncate font-medium text-foreground text-sm">
                {seller.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {seller.code ? `#${seller.code}` : 'Sem código'} ·{' '}
                <span className={seller.active ? 'text-success' : ''}>
                  {seller.active ? 'Ativo' : 'Arquivado'}
                </span>
              </span>
            </div>
            <RowActions actions={rowActions(seller)} />
          </div>
        )}
      />

      <SellerFormModal
        onOpenChange={(open) => {
          if (!open) {
            setSellerToEdit(null);
          }
        }}
        open={Boolean(sellerToEdit)}
        seller={sellerToEdit}
      />

      <Modal
        actions={[
          {
            label: 'Cancelar',
            onClick: () => setSellerToDelete(null),
            variant: 'outline',
            disabled: deleteSeller.isPending,
          },
          {
            label: 'Excluir',
            onClick: handleConfirmDelete,
            variant: 'destructive',
            disabled: deleteSeller.isPending,
            loading: deleteSeller.isPending,
          },
        ]}
        description={
          sellerToDelete
            ? `Tem certeza que deseja excluir "${sellerToDelete.name}"? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este vendedor?'
        }
        onOpenChange={(open) => {
          if (!open) {
            setSellerToDelete(null);
          }
        }}
        open={Boolean(sellerToDelete)}
        title="Excluir vendedor"
      />
    </>
  );
};
