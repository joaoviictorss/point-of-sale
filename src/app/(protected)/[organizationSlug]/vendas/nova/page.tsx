import { HydrateClient } from '@/trpc/server';
import { NewSaleScreen } from './_components/new-sale-screen';

const NewSalePage = () => {
  return (
    <HydrateClient>
      <div className="flex h-[calc(100svh-72px)] flex-col overflow-hidden">
        <NewSaleScreen />
      </div>
    </HydrateClient>
  );
};

export default NewSalePage;
