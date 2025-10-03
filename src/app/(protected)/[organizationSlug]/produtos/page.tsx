"use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";
import { Input } from "@/components";
import { Button } from "@/components/Shadcn";
import { useProducts } from "@/hooks";

const ProductsPage = () => {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();

  const { data: products } = useProducts({
    organizationSlug,
    limit: 2,
  });

  return (
    <main className="flex flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Input
            icon={<MagnifyingGlassIcon className={"size-4"} />}
            placeholder="Pesquisar produto"
            type="text"
          />
          <Button className="gap-3" type="button" variant={"outline"}>
            <FunnelIcon className={"size-4"} />
            Filtrar
          </Button>
        </div>
        <Button type="button">Criar novo produto</Button>
      </div>
      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  );
};

export default ProductsPage;
