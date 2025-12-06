import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import { useDebounce } from './use-debounce';

interface UseQueryParams<T>
  extends Omit<UseQueryOptions<T>, 'queryFn' | 'queryKey'> {
  queryKey: string | unknown[];
  queryFn: () => Promise<T>;
  searchTerm?: string;
  searchDelay?: number;
}

export function useQueryWithSearch<T>({
  queryKey,
  queryFn,
  searchTerm = '',
  searchDelay = 300,
  ...options
}: UseQueryParams<T>) {
  const debouncedSearch = useDebounce({
    value: searchTerm,
    delay: searchDelay,
  });

  return useQuery({
    queryKey: [
      ...(Array.isArray(queryKey) ? queryKey : [queryKey]),
      debouncedSearch,
    ],
    queryFn,
    ...options,
  });
}
