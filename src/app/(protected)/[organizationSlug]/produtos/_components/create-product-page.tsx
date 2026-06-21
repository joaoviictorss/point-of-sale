"use client";

import { ArrowLeftIcon, CheckIcon } from "@heroicons/react/24/outline";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/Shadcn";
import { Card, CardContent } from "@/components/Shadcn/card";
import { useOrganization } from "@/contexts/organization-context";
import { useCreateProduct } from "@/hooks/product/use-products";
import {
  type ProductFormInput,
  type ProductFormSchema,
  productFormSchema,
} from "@/services/product/schemas";
import { ProductForm } from "./product-form";
import { ProductPreview } from "./product-preview";

const defaultValues: ProductFormInput = {
  code: "",
  name: "",
  costPrice: 0,
  salePrice: 0,
  category: "",
  productType: "UNIT",
  stock: 0,
  stockUnit: "UNITS",
  minStock: undefined,
  maxStock: undefined,
  medias: [],
};

export function CreateProductPage() {
  const router = useRouter();
  const { slug: organizationSlug } = useOrganization();
  const createProduct = useCreateProduct();

  const form = useForm<ProductFormInput, unknown, ProductFormSchema>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  const onSubmit = (values: ProductFormSchema) => {
    createProduct.mutate(
      { organizationSlug, ...values },
      {
        onSuccess: () => {
          toast.success("Produto criado com sucesso");
          router.push(`/${organizationSlug}/produtos`);
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="h-full w-full">
      <div className="flex flex-1 flex-col">
        <div className="space-y-8 overflow-y-auto px-4 py-6">
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between bg-white">
            <div className="flex items-center gap-4">
              <Button onClick={handleCancel} size="icon" variant="outline">
                <ArrowLeftIcon />
              </Button>
              <h3 className="font-bold text-2xl text-slate-900">
                Novo Produto
              </h3>
            </div>

            <Button
              disabled={createProduct.isPending}
              form="product-form"
              type="submit"
            >
              <CheckIcon className="size-4" />
              {createProduct.isPending ? "Criando..." : "Criar Produto"}
            </Button>
          </div>

          {/* Content */}
          <div className="flex h-full w-full flex-1 gap-4">
            <Card className="flex-1 p-0">
              <CardContent className="p-0">
                <ProductForm
                  form={form}
                  loading={createProduct.isPending}
                  onSubmit={onSubmit}
                />
              </CardContent>
            </Card>

            <Card className="h-fit">
              <CardContent>
                <div className="hidden w-80 lg:block">
                  <ProductPreview form={form} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
