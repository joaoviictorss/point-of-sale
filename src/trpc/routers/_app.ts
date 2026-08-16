import { organizationRouter } from '@/services/organization';
import { productRouter } from '@/services/product';
import { salesRouter } from '@/services/sales';
import { sellerRouter } from '@/services/seller';
import { stockRouter } from '@/services/stock';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  product: productRouter,
  sale: salesRouter,
  seller: sellerRouter,
  stock: stockRouter,
});

export type AppRouter = typeof appRouter;
