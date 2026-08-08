'use client';

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  type RowData,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { cn } from '@/lib/utils';
import { DataTablePagination } from './data-table-pagination';

declare module '@tanstack/react-table' {
  // biome-ignore lint/correctness/noUnusedVariables: assinatura exigida pelo module augmentation do TanStack
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'center' | 'right';
    skeletonClassName?: string;
    expand?: boolean;
  }
}

const ALIGN_CLASSNAME = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

const SKELETON_KEYS = ['sk-0', 'sk-1', 'sk-2', 'sk-3', 'sk-4'];

const edgePadding = (index: number, total: number) =>
  cn(index === 0 && 'pl-6', index === total - 1 && 'pr-6');

type DataTablePaginationState = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

// biome-ignore lint/suspicious/noExplicitAny: exigido pela variância do TanStack
type AnyColumnDef<TData> = ColumnDef<TData, any>;

type DataTableProps<TData> = {
  columns: AnyColumnDef<TData>[];
  data: TData[];
  isFetching?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: TData) => void;
  pagination?: DataTablePaginationState;
};

export function DataTable<TData>({
  columns,
  data,
  isFetching,
  emptyMessage = 'Nenhum registro encontrado.',
  onRowClick,
  pagination,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const alignOf = (align?: 'left' | 'center' | 'right') =>
    ALIGN_CLASSNAME[align ?? 'left'];

  const renderBody = () => {
    if (isFetching) {
      const leafColumns = table.getAllLeafColumns();

      return SKELETON_KEYS.map((rowKey) => (
        <TableRow className="hover:bg-transparent" key={rowKey}>
          {leafColumns.map((column, index) => (
            <TableCell
              className={cn(
                'px-4 py-4',
                edgePadding(index, leafColumns.length)
              )}
              key={`${rowKey}-${column.id}`}
            >
              <div
                className={cn(
                  'h-4 w-24 animate-pulse rounded bg-secondary',
                  column.columnDef.meta?.skeletonClassName
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ));
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
        className={cn(
          'transition-colors hover:bg-muted/50',
          onRowClick && 'cursor-pointer'
        )}
        key={row.id}
        onClick={onRowClick ? () => onRowClick(row.original) : undefined}
      >
        {row.getVisibleCells().map((cell, index, cells) => (
          <TableCell
            className={cn(
              'px-4 py-4 align-middle text-foreground text-sm',
              alignOf(cell.column.columnDef.meta?.align),
              cell.column.columnDef.meta?.expand && 'w-full',
              edgePadding(index, cells.length)
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
    <div className="overflow-hidden rounded bg-card">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="hover:bg-transparent" key={headerGroup.id}>
              {headerGroup.headers.map((header, index, headers) => (
                <TableHead
                  className={cn(
                    'h-12 whitespace-nowrap px-4 font-medium text-sm text-text-muted',
                    alignOf(header.column.columnDef.meta?.align),
                    header.column.columnDef.meta?.expand && 'w-full',
                    edgePadding(index, headers.length)
                  )}
                  key={header.id}
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

      {pagination ? (
        <DataTablePagination
          disabled={isFetching}
          onPageChange={pagination.onPageChange}
          page={pagination.page}
          totalPages={pagination.totalPages}
        />
      ) : null}
    </div>
  );
}

export { type RowAction, RowActions } from './row-actions';
