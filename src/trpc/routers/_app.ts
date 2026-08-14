import { organizationRouter } from '@/services/organization';
import { productRouter } from '@/services/product';
import { salesRouter } from '@/services/sales';
import { sellerRouter } from '@/services/seller';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  product: productRouter,
  sale: salesRouter,
  seller: sellerRouter,
});

export type AppRouter = typeof appRouter;
