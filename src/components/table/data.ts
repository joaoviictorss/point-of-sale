import type { ReactNode } from 'react';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: unknown, record: T, index: number) => ReactNode;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface ITableProps<T = Record<string, unknown>> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyText?: string;
  rowKey?: keyof T;
  className?: string;
}

export interface ITableData<T = Record<string, unknown>>
  extends ITableProps<T> {}
