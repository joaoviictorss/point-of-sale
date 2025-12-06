import type { ITableProps } from './data';
import { Table as Layout } from './layout';

export function Table<T = Record<string, unknown>>(props: ITableProps<T>) {
  const layoutProps = {
    ...props,
  };

  return <Layout {...layoutProps} />;
}
