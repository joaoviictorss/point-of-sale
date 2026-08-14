'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from '@/components';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { useEntitySearch } from '@/hooks/entitys/use-entity-search';
import {
  type SellerStatusFilter,
  useSellersParams,
} from '@/hooks/seller/use-sellers-params';
import { PAGINATION } from '@/utils/constants';

const STATUS_LABEL: Record<SellerStatusFilter, string> = {
  all: 'Todos',
  active: 'Ativos',
  inactive: 'Arquivados',
};

export const SellersFilters = () => {
  const [params, setParams] = useSellersParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <>
      <Input
        icon={<MagnifyingGlassIcon className={'size-4'} />}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Pesquisar vendedor"
        type="text"
        value={searchValue}
      />
      <Select
        onValueChange={(value) =>
          setParams({
            status: value as SellerStatusFilter,
            page: PAGINATION.DEFAULT_PAGE,
          })
        }
        value={params.status}
      >
        <SelectTrigger>
          <SelectValue>{STATUS_LABEL[params.status]}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="inactive">Arquivados</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};
