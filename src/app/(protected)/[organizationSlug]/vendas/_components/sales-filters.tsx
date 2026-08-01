import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components';
import { useEntitySearch } from '@/hooks/entitys/use-entity-search';
import { useSalesParams } from '@/hooks/sales/use-sales-params';
import { PeriodFilter } from './period-filter';

export const SalesFilters = () => {
  const [params, setParams] = useSalesParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <>
      <Input
        icon={<MagnifyingGlassIcon className={'size-4'} />}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Pesquisar venda"
        type="text"
        value={searchValue}
      />
      <PeriodFilter />
    </>
  );
};
