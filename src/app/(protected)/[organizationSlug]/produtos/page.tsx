import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { productsParamsLoader } from "@/hooks/product/use-products-params";
import { prefetchProductsFromOrganization } from "@/services/product/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ProductsContainer } from "./_components/products-container";
import { ProductsList } from "./_components/products-list";

type ProductsPageProps = {
  searchParams: Promise<SearchParams>;
  params: Promise<{ organizationSlug: string }>;
};

const ProductsPage = async ({ searchParams, params }: ProductsPageProps) => {
  const { organizationSlug } = await params;
  const queryParams = await productsParamsLoader(searchParams);

  prefetchProductsFromOrganization({ ...queryParams, organizationSlug });

  return (
    <ProductsContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<span>Error</span>}>
          <Suspense fallback={<ProductsList isLoading={true} />}>
            <ProductsList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </ProductsContainer>
  );
};

export default ProductsPage;
