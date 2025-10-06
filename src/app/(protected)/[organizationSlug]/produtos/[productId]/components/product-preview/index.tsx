import {
  ChartBarIcon,
  CubeIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  TagIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import type { UseFormReturn } from "react-hook-form";
import type { ProductFormSchema } from "@/lib/validations/product";
import { stockUnitOptions } from "@/utils/constants";
import { applyCurrencyMask, getLabelFromValue } from "@/utils/functions";

interface ProductPreviewProps {
  form: UseFormReturn<ProductFormSchema>;
}

export function ProductPreview({ form }: ProductPreviewProps) {
  const { watch } = form;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-foreground text-lg">
          Preview do Produto
        </h3>
      </div>

      <div className="space-y-4">
        {/* Imagem do Produto */}
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
          {watch("imageUrl") ? (
            <div className="relative h-full w-full">
              <Image
                alt={(watch("name") as string) || "Produto"}
                className="h-full w-full object-cover"
                height={400}
                src={watch("imageUrl") as string}
                width={400}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <PhotoIcon className="h-12 w-12 text-text-muted" />
            </div>
          )}
        </div>

        {/* Informações do Produto */}
        <div className="space-y-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <TagIcon className="h-4 w-4 text-text-muted" />
              <h4 className="font-semibold text-foreground text-lg">
                {(watch("name") as string) || "Nome do produto"}
              </h4>
            </div>
            <p className="ml-6 text-sm text-text-muted">
              Código: {(watch("code") as string) || "N/A"}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-muted">Preço de venda:</span>
            </div>
            <span className="font-semibold text-lg text-success">
              R$ {applyCurrencyMask((watch("salePrice") as number) || 0)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CubeIcon className="h-4 w-4 text-text-muted" />
              <span className="text-sm text-text-muted">Estoque:</span>
            </div>
            <span className="font-medium text-foreground text-sm">
              {(watch("stock") as number) || 0}{" "}
              {getLabelFromValue(
                watch("stockUnit") as string,
                stockUnitOptions
              ) || "unidades"}
            </span>
          </div>

          {/* Alertas de Estoque */}
          {(watch("minStock") as number) &&
            Number(watch("stock")) <= Number(watch("minStock") as number) && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3">
                <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />
                <span className="text-destructive text-sm">
                  Estoque baixo! Abaixo do mínimo.
                </span>
              </div>
            )}

          {(watch("maxStock") as number) &&
            Number(watch("stock")) >= Number(watch("maxStock") as number) && (
              <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
                <ChartBarIcon className="h-4 w-4 text-primary" />
                <span className="text-primary text-sm">
                  Estoque no limite máximo.
                </span>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
