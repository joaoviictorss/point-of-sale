import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { prefetchProductById } from '@/services/product/prefetch';
import { HydrateClient } from '@/trpc/server';
import { CreateProductPage } from '../_components/create-product-page';
import { EditProductPage } from '../_components/edit-product-page';

interface PageProps {
  params: Promise<{ organizationSlug: string; productId: string }>;
}

function ProductPageSkeleton() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-lg text-muted-foreground">Carregando produto...</div>
    </div>
  );
}

function ProductPageError() {
  return (
    <div className="flex h-96 items-center justify-center">
      <div className="text-destructive text-lg">
        Erro ao carregar produto. Tente novamente.
      </div>
    </div>
  );
}

const Page = async ({ params }: PageProps) => {
  const { productId } = await params;

  const isNewProduct = productId === 'novo';

  // Criar produto - não precisa de prefetch nem Suspense
  if (isNewProduct) {
    return (
      <main className="flex-1">
        <CreateProductPage />
      </main>
    );
  }

  // Editar produto - precisa de prefetch e Suspense
  prefetchProductById({ id: productId });

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<ProductPageError />}>
        <Suspense fallback={<ProductPageSkeleton />}>
          <main className="flex-1">
            <EditProductPage productId={productId} />
          </main>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  );
};

export default Page;
