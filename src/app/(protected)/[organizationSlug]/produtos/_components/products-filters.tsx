import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components";
import { Button } from "@/components/Shadcn";
import { useEntitySearch } from "@/hooks/entitys/use-entity-search";
import { useProductsParams } from "@/hooks/product/use-products-params";

export const ProductsFilters = () => {
  const [params, setParams] = useProductsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });

  return (
    <>
      <Input
        icon={<MagnifyingGlassIcon className={"size-4"} />}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Pesquisar produto"
        type="text"
        value={searchValue}
      />
      <Button className="gap-3" type="button" variant={"outline"}>
        <FunnelIcon className={"size-4"} />
        Filtrar
      </Button>
    </>
  );
};
