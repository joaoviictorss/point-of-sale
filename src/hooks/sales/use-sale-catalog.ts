import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useOrganization } from '@/contexts/organization-context';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useTRPC } from '@/trpc/client';

const CATALOG_PAGE_SIZE = 20;

export function useSaleCatalog() {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();

  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce({ value: search, delay: 300 });

  const query = useQuery(
    trpc.product.getAllFromOrganization.queryOptions(
      {
        organizationSlug,
        search: debouncedSearch,
        page: 1,
        pageSize: CATALOG_PAGE_SIZE,
      },
      { placeholderData: keepPreviousData }
    )
  );

  const products = useMemo(() => query.data?.items ?? [], [query.data]);

  return {
    products,
    totalCount: query.data?.totalCount ?? 0,
    search,
    setSearch,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}

export type UseSaleCatalogReturn = ReturnType<typeof useSaleCatalog>;
export type CatalogProduct = UseSaleCatalogReturn['products'][number];
