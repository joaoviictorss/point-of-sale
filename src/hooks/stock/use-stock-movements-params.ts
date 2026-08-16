import { useQueryStates } from 'nuqs';
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';
import { PAGINATION } from '@/utils/constants';

export const STOCK_MOVEMENT_TYPE_FILTERS = [
  'SALE',
  'RETURN',
  'ADJUSTMENT',
  'PURCHASE',
] as const;

export type StockMovementTypeFilter =
  (typeof STOCK_MOVEMENT_TYPE_FILTERS)[number];

export const stockMovementsParams = {
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
  productId: parseAsString.withOptions({ clearOnDefault: true }),
  type: parseAsStringEnum<StockMovementTypeFilter>([
    ...STOCK_MOVEMENT_TYPE_FILTERS,
  ]).withOptions({ clearOnDefault: true }),
};

export const useStockMovementsParams = () => {
  return useQueryStates(stockMovementsParams);
};

export const stockMovementsParamsLoader = createLoader(stockMovementsParams);
