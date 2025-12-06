'use client';

import {
  Table as ShadTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/Shadcn/table';
import { cn } from '@/lib/utils';
import type { ITableData, TableColumn } from '../data';

export function Table<T = Record<string, unknown>>({
  data,
  columns,
  loading = false,
  emptyText = 'Nenhum dado encontrado',
  rowKey = 'id' as keyof T,
  className,
}: ITableData<T>) {
  const renderCell = (column: TableColumn<T>, record: T, index: number) => {
    const value = column.dataIndex
      ? (record as Record<string, unknown>)[column.dataIndex as string]
      : record;

    if (column.render) {
      return column.render(value, record, index);
    }

    return value;
  };

  const renderSkeletonCell = () => {
    return <div className="h-4 w-full animate-pulse rounded bg-border" />;
  };

  return (
    <div className="w-full overflow-auto">
      <ShadTable className={cn('w-full', className)}>
        <TableHeader>
          <TableRow>
            {columns.map((column: TableColumn<T>) => (
              <TableHead
                className={cn(
                  'text-left',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  'border-border border-b bg-white px-4 py-3 font-medium text-sm text-text-muted'
                )}
                key={column.key}
                style={{ width: column.width }}
              >
                {column.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {(() => {
            if (loading) {
              return Array.from({ length: 5 }, (_, index) => {
                const rowId = `skeleton-row-${index}`;
                return (
                  <TableRow className="hover:bg-white" key={rowId}>
                    {columns.map((column: TableColumn<T>) => (
                      <TableCell
                        className="border-border border-b p-4"
                        key={`${rowId}-${column.key}`}
                      >
                        {renderSkeletonCell()}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              });
            }

            if (data.length === 0) {
              return (
                <TableRow className="border-border border-b bg-white hover:bg-white">
                  <TableCell
                    className="py-8 text-center text-muted-foreground"
                    colSpan={columns.length}
                  >
                    {emptyText}
                  </TableCell>
                </TableRow>
              );
            }

            return data.map((record: T, index: number) => (
              <TableRow
                className="hover:bg-white"
                key={String(
                  (record as Record<string, unknown>)[rowKey as string] || index
                )}
              >
                {columns.map((column: TableColumn<T>) => (
                  <TableCell
                    className={cn(
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right',
                      'border-border border-b p-4'
                    )}
                    key={column.key}
                  >
                    {renderCell(column, record, index) as React.ReactNode}
                  </TableCell>
                ))}
              </TableRow>
            ));
          })()}
        </TableBody>
      </ShadTable>
    </div>
  );
}
