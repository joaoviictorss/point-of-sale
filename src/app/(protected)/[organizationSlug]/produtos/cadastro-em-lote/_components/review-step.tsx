'use client';

import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  DataTable,
  type RowAction,
  RowActions,
} from '@/components/entity-components/data-table';
import { Badge } from '@/components/shadcn/badge';
import { Button } from '@/components/shadcn/button';
import { useOrganization } from '@/contexts/organization-context';
import { useCreateProductsBatch } from '@/hooks/product/use-products';
import { cn } from '@/lib/utils';
import type { ImportRowResult } from '@/services/product/import-schemas';
import type { ProductFormSchema } from '@/services/product/schemas';
import { applyCurrencyMask } from '@/utils/functions';
import { CorrectRowPage } from './correct-row-page';

const UNIT_LABEL: Record<string, string> = {
  UNITS: 'un.',
  GRAMS: 'g',
  KILOGRAMS: 'kg',
  LITERS: 'L',
  MILLILITERS: 'ml',
};

function RowStatusCell({ row }: { row: ImportRowResult }) {
  if (row.status === 'valid') {
    return <Badge variant="success">Pronto para cadastro</Badge>;
  }

  return (
    <div className="flex flex-col gap-1">
      <Badge variant="destructive-soft">Precisa de correção</Badge>
    </div>
  );
}

const columnHelper = createColumnHelper<ImportRowResult>();

interface ReviewStepProps {
  fileName: string;
  rows: ImportRowResult[];
  onRowsChange: (rows: ImportRowResult[]) => void;
  onReset: () => void;
}

export function ReviewStep({
  fileName,
  rows,
  onRowsChange,
  onReset,
}: ReviewStepProps) {
  const router = useRouter();
  const { slug: organizationSlug } = useOrganization();
  const createBatch = useCreateProductsBatch();
  const [rowToCorrect, setRowToCorrect] = useState<ImportRowResult | null>(
    null
  );

  const invalidCount = rows.filter((row) => row.status === 'invalid').length;
  const validCount = rows.length - invalidCount;

  const handleSaveRow = (rowNumber: number, data: ProductFormSchema) => {
    const duplicateCode = rows.some(
      (row) => row.rowNumber !== rowNumber && row.data.code === data.code
    );

    onRowsChange(
      rows.map((row) =>
        row.rowNumber === rowNumber
          ? {
              ...row,
              data,
              errors: duplicateCode
                ? { code: 'Código duplicado na planilha' }
                : {},
              status: duplicateCode ? ('invalid' as const) : ('valid' as const),
            }
          : row
      )
    );
  };

  const handleCommit = () => {
    const validProducts = rows
      .filter((row) => row.status === 'valid')
      .map((row) => row.data);

    createBatch.mutate(
      { organizationSlug, products: validProducts },
      {
        onSuccess: (result) => {
          toast.success(
            `${result.count} ${result.count === 1 ? 'produto cadastrado' : 'produtos cadastrados'} com sucesso`
          );
          router.push(`/${organizationSlug}/produtos`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleRemoveRow = (rowNumber: number) => {
    onRowsChange(rows.filter((row) => row.rowNumber !== rowNumber));
  };

  const rowActions = (row: ImportRowResult): RowAction[] => [
    ...(row.status === 'invalid'
      ? [
          {
            label: 'Corrigir',
            icon: PencilIcon,
            onClick: () => setRowToCorrect(row),
          },
        ]
      : []),
    {
      label: 'Remover',
      icon: TrashIcon,
      onClick: () => handleRemoveRow(row.rowNumber),
      variant: 'destructive' as const,
    },
  ];

  if (rowToCorrect) {
    return (
      <CorrectRowPage
        onCancel={() => setRowToCorrect(null)}
        onSave={(rowNumber, data) => {
          handleSaveRow(rowNumber, data);
          setRowToCorrect(null);
        }}
        row={rowToCorrect}
      />
    );
  }

  const sortedRows = [...rows].sort(
    (a, b) => Number(a.status === 'valid') - Number(b.status === 'valid')
  );

  const columns = [
    columnHelper.display({
      id: 'product',
      header: 'Produto',
      meta: { expand: true },
      cell: ({ row }) => (
        <span className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground">
            {row.original.data.name || 'Sem nome'}
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            #{row.original.data.code || '—'}
          </span>
        </span>
      ),
    }),

    columnHelper.display({
      id: 'category',
      header: 'Categoria',
      cell: ({ row }) => (
        <span
          className={cn(row.original.errors.category && 'text-destructive')}
        >
          {row.original.data.category || 'Sem categoria'}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'costPrice',
      header: 'Custo',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-16' },
      cell: ({ row }) => (
        <span className="text-muted-foreground tabular-nums">
          {applyCurrencyMask(row.original.data.costPrice)}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'salePrice',
      header: 'Venda',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-20' },
      cell: ({ row }) => (
        <span
          className={cn(
            'font-semibold tabular-nums',
            row.original.errors.salePrice && 'text-destructive'
          )}
        >
          {row.original.errors.salePrice
            ? '—'
            : applyCurrencyMask(row.original.data.salePrice)}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'stock',
      header: 'Estoque',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-16' },
      cell: ({ row }) =>
        row.original.errors.stock ? (
          <span className="text-destructive">—</span>
        ) : (
          <span>
            {row.original.data.stock}{' '}
            {UNIT_LABEL[row.original.data.stockUnit] ?? ''}
          </span>
        ),
    }),

    columnHelper.display({
      id: 'status',
      header: 'Status',
      meta: { skeletonClassName: 'w-24' },
      cell: ({ row }) => <RowStatusCell row={row.original} />,
    }),

    columnHelper.display({
      id: 'actions',
      header: () => null,
      meta: { align: 'right', skeletonClassName: 'ml-auto w-8' },
      cell: ({ row }) => <RowActions actions={rowActions(row.original)} />,
    }),
  ];

  return (
    <div className="flex flex-1 flex-col gap-5 bg-gray-50 p-4 sm:p-6">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Voltar"
          onClick={onReset}
          size="icon"
          variant="outline"
        >
          <ArrowLeftIcon />
        </Button>
        <div>
          <h1 className="font-semibold text-foreground text-xl tracking-tight sm:text-2xl">
            {rows.length} {rows.length === 1 ? 'produto' : 'produtos'} na
            planilha
          </h1>
          <p className="text-muted-foreground text-sm">
            {fileName} · {validCount} prontos para cadastro
            {invalidCount > 0 ? `, ${invalidCount} precisam de correção` : ''}
          </p>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={sortedRows}
        emptyMessage="Nenhum produto na planilha."
        renderMobileCard={(row) => (
          <div className="flex flex-col gap-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate font-medium text-foreground text-sm">
                  {row.data.name || 'Sem nome'}
                </div>
                <div className="truncate text-muted-foreground text-xs">
                  #{row.data.code || '—'} ·{' '}
                  {row.data.category || 'Sem categoria'}
                </div>
              </div>
              <RowActions actions={rowActions(row)} />
            </div>
            <RowStatusCell row={row} />
          </div>
        )}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          {invalidCount > 0 ? (
            <>
              <ExclamationTriangleIcon className="size-5 shrink-0" />
              <span>
                {invalidCount}{' '}
                {invalidCount === 1 ? 'produto precisa' : 'produtos precisam'}{' '}
                de correção antes do cadastro.
              </span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="size-5 shrink-0" />
              <span>Tudo certo com os {rows.length} produtos da planilha.</span>
            </>
          )}
        </div>

        <Button
          disabled={validCount === 0 || createBatch.isPending}
          onClick={handleCommit}
        >
          <CheckIcon className="size-4" />
          {createBatch.isPending
            ? 'Cadastrando...'
            : `Cadastrar ${validCount} ${validCount === 1 ? 'produto pronto' : 'produtos prontos'}`}
        </Button>
      </div>
    </div>
  );
}
