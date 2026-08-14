import { useQueryStates } from 'nuqs';
import {
  createLoader,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server';
import { PAGINATION } from '@/utils/constants';

export const SELLER_STATUS_FILTERS = ['active', 'inactive', 'all'] as const;

export type SellerStatusFilter = (typeof SELLER_STATUS_FILTERS)[number];

export const sellersParams = {
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
  search: parseAsString.withDefault('').withOptions({
    clearOnDefault: true,
  }),
  status: parseAsStringEnum<SellerStatusFilter>([...SELLER_STATUS_FILTERS])
    .withDefault('all')
    .withOptions({
      clearOnDefault: true,
    }),
};

export const useSellersParams = () => {
  return useQueryStates(sellersParams);
};

export const sellersParamsLoader = createLoader(sellersParams);
