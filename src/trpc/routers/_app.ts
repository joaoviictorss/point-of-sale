import { organizationRouter } from "@/services/organization";
import { productRouter } from "@/services/product";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  organization: organizationRouter,
  product: productRouter,
});

export type AppRouter = typeof appRouter;
