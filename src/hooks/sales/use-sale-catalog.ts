import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useOrganization } from '@/contexts/organization-context';
import { useDebounce } from '@/hooks/common/use-debounce';
import { useTRPC } from '@/trpc/client';

const CATALOG_PAGE_SIZE = 100;
const ALL_CATEGORIES = 'Todos';

export function useSaleCatalog() {
  const trpc = useTRPC();
  const { slug: organizationSlug } = useOrganization();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_CATEGORIES);

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

  const items = useMemo(() => query.data?.items ?? [], [query.data]);

  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => item.category).filter(Boolean))
    ) as string[];
    return [ALL_CATEGORIES, ...unique];
  }, [items]);

  const products = useMemo(() => {
    if (activeCategory === ALL_CATEGORIES) {
      return items;
    }
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return {
    products,
    categories,
    totalCount: query.data?.totalCount ?? 0,
    search,
    setSearch,
    activeCategory,
    setActiveCategory,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
  };
}

export type UseSaleCatalogReturn = ReturnType<typeof useSaleCatalog>;
export type CatalogProduct = UseSaleCatalogReturn['products'][number];
