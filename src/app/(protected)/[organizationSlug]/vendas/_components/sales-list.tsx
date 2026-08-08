'use client';

import {
  BanknotesIcon,
  BuildingLibraryIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { OrderStatus, PaymentMethod } from '@prisma/client';
import { createColumnHelper } from '@tanstack/react-table';
import type { ComponentType, SVGProps } from 'react';
import {
  DataTable,
  RowActions,
} from '@/components/entity-components/data-table';
import { useSuspenseSales } from '@/hooks/sales/use-sales';
import { useSalesParams } from '@/hooks/sales/use-sales-params';
import { applyCurrencyMask } from '@/utils/functions';
import { SalesEmptyState } from './sales-empty-state';

type SaleItem = ReturnType<typeof useSuspenseSales>['data']['items'][number];

const PAYMENT_METHOD: Record<
  PaymentMethod,
  { label: string; icon: ComponentType<SVGProps<SVGSVGElement>> }
> = {
  CASH: { label: 'Dinheiro', icon: BanknotesIcon },
  CREDIT_CARD: { label: 'Cartão de crédito', icon: CreditCardIcon },
  DEBIT_CARD: { label: 'Cartão de débito', icon: CreditCardIcon },
  PIX: { label: 'Pix', icon: CurrencyDollarIcon },
  BANK_TRANSFER: { label: 'Transferência', icon: BuildingLibraryIcon },
};

const ORDER_STATUS: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: { label: 'Pendente', className: 'text-warning' },
    COMPLETED: { label: 'Concluída', className: 'text-muted-foreground' },
    CANCELLED: { label: 'Cancelada', className: 'text-destructive' },
  };

const columnHelper = createColumnHelper<SaleItem>();

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

function formatSaleDateTime(value: Date | string) {
  const date = new Date(value);
  const time = date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dayDiff = Math.round(
    (startOfDay(new Date()).getTime() - startOfDay(date).getTime()) / 86_400_000
  );

  if (dayDiff === 0) {
    return `Hoje - ${time}`;
  }
  if (dayDiff === 1) {
    return `Ontem - ${time}`;
  }
  return `${date.toLocaleDateString('pt-BR')} - ${time}`;
}

function PaymentCell({ payments }: { payments: SaleItem['payments'] }) {
  const methods = [...new Set(payments.map((payment) => payment.method))];

  if (methods.length === 0) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (methods.length > 1) {
    return <span className="text-muted-foreground">Múltiplos</span>;
  }

  const { label, icon: Icon } = PAYMENT_METHOD[methods[0]];

  return (
    <span className="inline-flex items-center gap-2.5 text-success">
      <Icon className="size-6" />
      {label}
    </span>
  );
}

export const SalesList = () => {
  const sales = useSuspenseSales();
  const [params, setParams] = useSalesParams();

  const columns = [
    columnHelper.accessor('orderNumber', {
      header: 'Venda',
      cell: ({ getValue }) => (
        <span className="font-medium">
          #{String(getValue()).padStart(3, '0')}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'customer',
      header: 'Cliente',
      meta: { expand: true },
      cell: ({ row }) =>
        row.original.customer?.name ?? (
          <span className="text-muted-foreground">Não identificado</span>
        ),
    }),

    columnHelper.display({
      id: 'seller',
      header: 'Vendedor',
      cell: ({ row }) => row.original.employee?.name ?? '—',
    }),

    columnHelper.display({
      id: 'items',
      header: 'Itens',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-8' },
      cell: ({ row }) => row.original._count.items,
    }),

    columnHelper.accessor('finalAmount', {
      header: 'Total',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-20' },
      cell: ({ getValue }) => (
        <span className="tabular-nums">{applyCurrencyMask(getValue())}</span>
      ),
    }),

    columnHelper.display({
      id: 'payment',
      header: 'Método de pagamento',
      cell: ({ row }) => <PaymentCell payments={row.original.payments} />,
    }),

    columnHelper.accessor('createdAt', {
      header: 'Data e hora',
      cell: ({ getValue }) => formatSaleDateTime(getValue()),
    }),

    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => {
        const status = ORDER_STATUS[getValue()];
        return <span className={status.className}>{status.label}</span>;
      },
    }),

    columnHelper.display({
      id: 'actions',
      header: () => null,
      meta: { align: 'right', skeletonClassName: 'ml-auto w-8' },
      // TODO: ligar às ações de detalhe/edição/cancelamento da venda quando
      // essas telas existirem.
      cell: () => (
        <RowActions
          actions={[
            { label: 'Ver detalhes', icon: EyeIcon },
            { label: 'Editar venda', icon: PencilIcon },
            {
              label: 'Excluir venda',
              icon: TrashIcon,
              variant: 'destructive',
            },
          ]}
        />
      ),
    }),
  ];

  const items = sales.data.items ?? [];
  const isFetching = sales.isFetching;
  const hasSearch = params.search.trim().length > 0;
  const hasPeriod = Boolean(params.from || params.to);
  const hasActiveFilter = hasSearch || hasPeriod;

  const showOnboarding = !isFetching && items.length === 0 && !hasActiveFilter;

  if (showOnboarding) {
    return (
      <div className="flex flex-1 flex-col justify-center overflow-hidden">
        <SalesEmptyState />
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={items}
      emptyMessage={
        hasPeriod
          ? 'Nenhuma venda neste período.'
          : 'Nenhuma venda encontrada para essa busca.'
      }
      isFetching={isFetching}
      pagination={{
        page: sales.data.page,
        totalPages: sales.data.totalPages,
        onPageChange: (page) => setParams({ page }),
      }}
    />
  );
};
