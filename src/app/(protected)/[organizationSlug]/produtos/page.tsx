"use client";

import { FunnelIcon } from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components";
import { Button } from "@/components/Shadcn";
import { useProducts } from "@/hooks";

const ProductsPage = () => {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: products,
    isLoading,
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    totalDocs,
    currentCount,
    nextPage,
    prevPage,
  } = useProducts({
    organizationSlug,
    searchTerm,
    page: 1,
    limit: 2,
  });

  return (
    <main className="flex flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Input
            icon={<MagnifyingGlassIcon className={"size-4"} />}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar produto"
            type="text"
            value={searchTerm}
          />
          <Button className="gap-3" type="button" variant={"outline"}>
            <FunnelIcon className={"size-4"} />
            Filtrar
          </Button>
        </div>
        <Button type="button">Criar novo produto</Button>
      </div>

      {isLoading && <p>Buscando...</p>}

      {/* Controles de paginação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button disabled={!hasPrevPage} onClick={prevPage} variant="outline">
            Anterior
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm">
              Página {currentPage} de {totalPages}
            </span>
            <span className="text-gray-500 text-sm">
              ({currentCount} de {totalDocs} produtos)
            </span>
          </div>

          <Button disabled={!hasNextPage} onClick={nextPage} variant="outline">
            Próxima
          </Button>
        </div>
      </div>

      <pre>{JSON.stringify(products, null, 2)}</pre>
    </main>
  );
};

export default ProductsPage;
