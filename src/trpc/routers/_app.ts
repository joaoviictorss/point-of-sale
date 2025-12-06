import { organizationRouter } from '@/services/organization';
import { createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
});

export type AppRouter = typeof appRouter;
