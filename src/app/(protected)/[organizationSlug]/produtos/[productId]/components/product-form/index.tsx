import type { UseFormReturn } from "react-hook-form";
import { Input, Select } from "@/components";
import type { ProductFormSchema } from "@/lib/validations/product";
import { productTypeOptions, stockUnitOptions } from "@/utils/constants";
import { applyCurrencyMask, removeCurrencyMask } from "@/utils/functions";

interface ProductFormProps {
  form: UseFormReturn<ProductFormSchema>;
  loading: boolean;
  onSubmit: (values: ProductFormSchema) => void;
}

export function ProductForm({ form, loading, onSubmit }: ProductFormProps) {
  const {
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
  } = form;
  return (
    <form id="product-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="">
        <div className="border-b p-6">
          <Input
            disabled={loading}
            error={errors.code?.message}
            label="Código do Produto"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("code", e.target.value)
            }
            placeholder="Digite o código do produto"
            required
            value={watch("code") as string}
          />
        </div>

        <div className="flex w-full flex-col gap-4 border-b p-6">
          <h2 className="font-semibold text-lg">Informações Básicas</h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Input
                disabled={loading}
                error={errors.name?.message}
                label="Nome do Produto"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue("name", e.target.value)
                }
                placeholder="Nome do produto"
                required
                value={watch("name") as string}
              />
            </div>

            <div>
              <Input
                disabled={loading}
                error={errors.category?.message}
                label="Categoria"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setValue("category", e.target.value)
                }
                placeholder="Eletrônicos"
                required
                value={watch("category") as string}
              />
            </div>
          </div>
          <div>
            <Select
              disabled={loading}
              error={errors.productType?.message}
              label="Tipo de Produto"
              onValueChange={(value: string) =>
                setValue("productType", value as "UNIT" | "WEIGHT" | "VOLUME")
              }
              options={productTypeOptions}
              placeholder="Selecione o tipo"
              required
              value={watch("productType") as string}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 border-b p-6">
        <h2 className="font-semibold text-lg">Preços</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Input
              disabled={loading}
              error={errors.costPrice?.message}
              label="Preço de Custo (R$)"
              onChange={(e) => {
                setValue(
                  "costPrice",
                  Number(removeCurrencyMask(e.target.value))
                );
              }}
              placeholder="R$ 0,00"
              type="text"
              value={applyCurrencyMask(watch("costPrice") as number)}
            />
          </div>

          <div>
            <Input
              disabled={loading}
              error={errors.salePrice?.message}
              label="Preço de Venda (R$)"
              onChange={(e) => {
                setValue(
                  "salePrice",
                  Number(removeCurrencyMask(e.target.value))
                );
              }}
              placeholder="R$ 0,00"
              required
              type="text"
              value={applyCurrencyMask(watch("salePrice") as number)}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 border-b p-6">
        <h2 className="font-semibold text-lg">Controle de Estoque</h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <Input
              disabled={loading}
              error={errors.stock?.message}
              label="Estoque Atual"
              min="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue("stock", Number(e.target.value))
              }
              placeholder="0"
              required
              type="number"
              value={watch("stock") as number}
            />
          </div>

          <div>
            <Select
              disabled={loading}
              error={errors.stockUnit?.message}
              label="Unidade de Estoque"
              onValueChange={(value: string) =>
                setValue(
                  "stockUnit",
                  value as
                    | "UNITS"
                    | "GRAMS"
                    | "KILOGRAMS"
                    | "LITERS"
                    | "MILLILITERS"
                )
              }
              options={stockUnitOptions}
              placeholder="Selecione a unidade"
              required
              value={watch("stockUnit") as string}
            />
          </div>

          <div>
            <Input
              disabled={loading}
              error={errors.minStock?.message}
              label="Estoque Mínimo"
              min="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(
                  "minStock",
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              placeholder="0"
              type="number"
              value={(watch("minStock") as number) || ""}
            />
          </div>

          <div>
            <Input
              disabled={loading}
              error={errors.maxStock?.message}
              label="Estoque Máximo"
              min="0"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setValue(
                  "maxStock",
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
              placeholder="0"
              type="number"
              value={(watch("maxStock") as number) || ""}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 p-6">
        <h2 className="font-semibold text-lg">Mídia</h2>

        <div>
          <Input
            disabled={loading}
            error={errors.imageUrl?.message}
            label="URL da Imagem"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setValue("imageUrl", e.target.value)
            }
            placeholder="https://exemplo.com/imagem.jpg"
            type="url"
            value={(watch("imageUrl") as string) || ""}
          />
        </div>
      </div>
    </form>
  );
}
