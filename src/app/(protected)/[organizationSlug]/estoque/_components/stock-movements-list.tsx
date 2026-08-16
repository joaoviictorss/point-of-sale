'use client';

import type { StockMovementType } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/entity-components/data-table';
import { useSuspenseStockMovements } from '@/hooks/stock/use-stock-movements';
import { useStockMovementsParams } from '@/hooks/stock/use-stock-movements-params';
import { cn } from '@/lib/utils';

type MovementItem = ReturnType<
  typeof useSuspenseStockMovements
>['data']['items'][number];

const TYPE_LABEL: Record<StockMovementType, string> = {
  SALE: 'Venda',
  RETURN: 'Devolução',
  PURCHASE: 'Entrada',
  ADJUSTMENT: 'Ajuste',
};

function formatDateTime(value: Date | string) {
  return new Date(value).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function QuantityCell({ movement }: { movement: MovementItem }) {
  const positive = movement.quantity > 0;
  return (
    <span
      className={cn(
        'font-mono tabular-nums',
        positive ? 'text-success' : 'text-destructive'
      )}
    >
      {positive ? '+' : ''}
      {movement.quantity}
    </span>
  );
}

const columnHelper = createColumnHelper<MovementItem>();

interface StockMovementsListProps {
  isLoading?: boolean;
}

export const StockMovementsList = ({ isLoading }: StockMovementsListProps) => {
  const movements = useSuspenseStockMovements();
  const [, setParams] = useStockMovementsParams();

  const columns = [
    columnHelper.accessor('createdAt', {
      header: 'Data e hora',
      cell: ({ getValue }) => formatDateTime(getValue()),
    }),

    columnHelper.display({
      id: 'product',
      header: 'Produto',
      meta: { expand: true },
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.product.name}</span>
          <span className="text-muted-foreground text-xs">
            #{row.original.product.code}
          </span>
        </div>
      ),
    }),

    columnHelper.accessor('type', {
      header: 'Tipo',
      cell: ({ getValue }) => TYPE_LABEL[getValue()],
    }),

    columnHelper.display({
      id: 'quantity',
      header: 'Quantidade',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-14' },
      cell: ({ row }) => <QuantityCell movement={row.original} />,
    }),

    columnHelper.display({
      id: 'detail',
      header: 'Detalhe',
      cell: ({ row }) =>
        row.original.order ? (
          <span>
            Venda #{String(row.original.order.orderNumber).padStart(3, '0')}
          </span>
        ) : (
          (row.original.reason ?? (
            <span className="text-muted-foreground">—</span>
          ))
        ),
    }),

    columnHelper.display({
      id: 'createdBy',
      header: 'Usuário',
      cell: ({ row }) =>
        row.original.createdBy?.name ?? (
          <span className="text-muted-foreground">—</span>
        ),
    }),
  ];

  const items = movements.data.items ?? [];
  const isFetching = movements.isFetching || isLoading;

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage="Nenhuma movimentação encontrada."
      isFetching={isFetching}
      pagination={{
        page: movements.data.page,
        pageSize: movements.data.pageSize,
        totalCount: movements.data.totalCount,
        totalPages: movements.data.totalPages,
        onPageChange: (page) => setParams({ page }),
        itemLabel: 'movimentações',
      }}
    />
  );
};
