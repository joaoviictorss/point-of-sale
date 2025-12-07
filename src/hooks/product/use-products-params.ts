import { useQueryStates } from "nuqs";
import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";
import { PAGINATION } from "@/utils/constants";

export const productsParams = {
  page: parseAsInteger.withDefault(PAGINATION.DEFAULT_PAGE).withOptions({
    clearOnDefault: true,
  }),
  pageSize: parseAsInteger
    .withDefault(PAGINATION.DEFAULT_PAGE_SIZE)
    .withOptions({
      clearOnDefault: true,
    }),
  search: parseAsString.withDefault("").withOptions({
    clearOnDefault: true,
  }),
};

export const useProductsParams = () => {
  return useQueryStates(productsParams);
};

export const productsParamsLoader = createLoader(productsParams);
