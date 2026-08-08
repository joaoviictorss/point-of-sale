'use client';

import {
  BanknotesIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import type { PaymentMethod } from '@prisma/client';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/shadcn';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { useSuspenseSales } from '@/hooks/sales/use-sales';
import { useSalesParams } from '@/hooks/sales/use-sales-params';
import { cn } from '@/lib/utils';
import { applyCurrencyMask } from '@/utils/functions';
import { SalesEmptyState } from './sales-empty-state';

type SaleItem = ReturnType<typeof useSuspenseSales>['data']['items'][number];

const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  CASH: 'Dinheiro',
  CREDIT_CARD: 'Cartão de crédito',
  DEBIT_CARD: 'Cartão de débito',
  PIX: 'Pix',
  BANK_TRANSFER: 'Transferência',
};

const RIGHT_COLUMNS = new Set(['actions']);
const SKELETON_KEYS = ['sk-0', 'sk-1', 'sk-2', 'sk-3', 'sk-4'];
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
    return <span className="text-muted-foreground text-sm">—</span>;
  }

  if (methods.length > 1) {
    return (
      <span className="font-medium text-muted-foreground text-sm">
        Múltiplos
      </span>
    );
  }

  const method = methods[0];

  if (method === 'CASH') {
    return (
      <span className="inline-flex items-center gap-2 font-medium text-muted-foreground text-sm">
        <BanknotesIcon className="size-[18px]" />
        {PAYMENT_METHOD_LABEL[method]}
      </span>
    );
  }

  return (
    <span className="font-medium text-green-600 text-sm">
      {PAYMENT_METHOD_LABEL[method]}
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
        <span className="font-mono text-foreground text-sm">
          #{String(getValue()).padStart(3, '0')}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'seller',
      header: 'Vendedor',
      cell: ({ row }) => (
        <span className="text-foreground text-sm">
          {row.original.employee?.name ?? '—'}
        </span>
      ),
    }),

    columnHelper.accessor('finalAmount', {
      header: 'Total',
      cell: ({ getValue }) => (
        <span className="font-medium font-mono text-foreground text-sm">
          {applyCurrencyMask(getValue())}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'payment',
      header: 'Método de pagamento',
      cell: ({ row }) => <PaymentCell payments={row.original.payments} />,
    }),

    columnHelper.accessor('createdAt', {
      header: 'Data e hora',
      cell: ({ getValue }) => (
        <span className="text-foreground text-sm">
          {formatSaleDateTime(getValue())}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'actions',
      size: 120,
      header: () => null,
      // TODO: ligar às ações de detalhe/edição/cancelamento da venda quando
      // essas telas existirem.
      cell: () => (
        <div className="flex justify-end gap-1">
          <Button
            className="size-8 text-muted-foreground hover:text-foreground"
            size="icon"
            type="button"
            variant="ghost"
          >
            <EyeIcon className="size-[18px]" />
          </Button>
          <Button
            className="size-8 text-muted-foreground hover:text-foreground"
            size="icon"
            type="button"
            variant="ghost"
          >
            <PencilIcon className="size-[18px]" />
          </Button>
          <Button
            className="size-8 text-muted-foreground hover:text-destructive"
            size="icon"
            type="button"
            variant="ghost"
          >
            <TrashIcon className="size-[18px]" />
          </Button>
        </div>
      ),
    }),
  ];

  const items = sales.data.items ?? [];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isFetching = sales.isFetching;
  const hasSearch = params.search.trim().length > 0;
  const hasPeriod = Boolean(params.from || params.to);
  const hasActiveFilter = hasSearch || hasPeriod;

  const showOnboarding = !isFetching && items.length === 0 && !hasActiveFilter;

  const emptyMessage = hasPeriod
    ? 'Nenhuma venda neste período.'
    : 'Nenhuma venda encontrada para essa busca.';

  const skeletonRow = (key: string) => (
    <TableRow className="hover:bg-transparent" key={key}>
      {SKELETON_KEYS.slice(0, columns.length).map((cellKey) => (
        <TableCell
          className="border-border border-b px-4 py-3.5"
          key={`${key}-${cellKey}`}
        >
          <div className="h-4 w-24 animate-pulse rounded bg-secondary" />
        </TableCell>
      ))}
    </TableRow>
  );

  const renderBody = () => {
    if (isFetching) {
      return SKELETON_KEYS.map(skeletonRow);
    }
    if (table.getRowModel().rows.length === 0) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell
            className="py-10 text-center text-muted-foreground text-sm"
            colSpan={columns.length}
          >
            {emptyMessage}
          </TableCell>
        </TableRow>
      );
    }
    return table.getRowModel().rows.map((row) => (
      <TableRow
        className="border-border border-b transition-colors hover:bg-muted/50"
        key={row.id}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            className={cn(
              'px-4 py-3.5 align-middle',
              RIGHT_COLUMNS.has(cell.column.id) && 'text-right'
            )}
            key={cell.id}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <div className={cn('flex flex-col gap-4', showOnboarding && 'flex-1')}>
      <div
        className={cn(
          'overflow-hidden',
          showOnboarding
            ? 'flex flex-1 flex-col justify-center'
            : 'rounded-lg border border-border bg-card shadow-xs'
        )}
      >
        {showOnboarding ? (
          <SalesEmptyState />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className={cn(
                        'whitespace-nowrap border-border border-b px-4 py-3 font-medium text-muted-foreground text-sm',
                        RIGHT_COLUMNS.has(header.id) && 'text-right'
                      )}
                      key={header.id}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>{renderBody()}</TableBody>
          </Table>
        )}
      </div>

      <div
        className={cn(
          'flex items-center justify-end gap-1.5',
          showOnboarding && 'hidden'
        )}
      >
        <Button
          className="gap-1.5 text-muted-foreground"
          disabled={!sales.data.hasPreviousPage || isFetching}
          onClick={() => setParams({ page: params.page - 1 })}
          size="sm"
          type="button"
          variant="ghost"
        >
          <ChevronLeftIcon className="size-4" />
          Página anterior
        </Button>
        <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border bg-card px-2 font-medium text-foreground text-sm shadow-xs">
          {sales.data.page}
        </span>
        <Button
          className="gap-1.5 text-muted-foreground"
          disabled={!sales.data.hasNextPage || isFetching}
          onClick={() => setParams({ page: params.page + 1 })}
          size="sm"
          type="button"
          variant="ghost"
        >
          Próxima
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
};
