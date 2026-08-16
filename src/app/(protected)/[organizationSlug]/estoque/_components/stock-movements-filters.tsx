'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import {
  type StockMovementTypeFilter,
  useStockMovementsParams,
} from '@/hooks/stock/use-stock-movements-params';
import { PAGINATION } from '@/utils/constants';

const TYPE_LABEL: Record<'all' | StockMovementTypeFilter, string> = {
  all: 'Todos os tipos',
  SALE: 'Vendas',
  RETURN: 'Devoluções',
  PURCHASE: 'Entradas',
  ADJUSTMENT: 'Ajustes',
};

export const StockMovementsFilters = () => {
  const [params, setParams] = useStockMovementsParams();
  const value = params.type ?? 'all';

  return (
    <Select
      onValueChange={(next) =>
        setParams({
          type: next === 'all' ? null : (next as StockMovementTypeFilter),
          page: PAGINATION.DEFAULT_PAGE,
        })
      }
      value={value}
    >
      <SelectTrigger className="w-full sm:w-fit">
        <SelectValue>{TYPE_LABEL[value]}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(TYPE_LABEL).map(([key, label]) => (
          <SelectItem key={key} value={key}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
