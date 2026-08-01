import { prefetchProductsFromOrganization } from '@/services/product/prefetch';
import { HydrateClient } from '@/trpc/server';
import { NewSaleScreen } from './_components/new-sale-screen';

type NewSalePageProps = {
  params: Promise<{ organizationSlug: string }>;
};

const NewSalePage = async ({ params }: NewSalePageProps) => {
  const { organizationSlug } = await params;

  prefetchProductsFromOrganization({
    organizationSlug,
    search: '',
    page: 1,
    pageSize: 100,
  });

  return (
    <HydrateClient>
      <div className="flex h-[calc(100svh-72px)] flex-col overflow-hidden">
        <NewSaleScreen />
      </div>
    </HydrateClient>
  );
};

export default NewSalePage;
