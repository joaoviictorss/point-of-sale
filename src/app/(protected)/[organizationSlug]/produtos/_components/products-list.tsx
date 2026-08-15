'use client';

import {
  EyeIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { createColumnHelper } from '@tanstack/react-table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Modal } from '@/components';
import {
  DataTable,
  type RowAction,
  RowActions,
} from '@/components/entity-components/data-table';
import { useOrganization } from '@/contexts/organization-context';
import {
  useDeleteProduct,
  useSuspenseProducts,
} from '@/hooks/product/use-products';
import { useProductsParams } from '@/hooks/product/use-products-params';
import { applyCurrencyMask } from '@/utils/functions';

type ProductItem = ReturnType<
  typeof useSuspenseProducts
>['data']['items'][number];

const UNIT_LABEL: Record<string, string> = {
  UNITS: 'un.',
  GRAMS: 'g',
  KILOGRAMS: 'kg',
  LITERS: 'L',
  MILLILITERS: 'ml',
};

function getStockColor(p: ProductItem): string {
  const min = p.minStock ?? 0;
  const max = p.maxStock ?? 0;
  if (p.stock <= min) {
    return 'text-destructive';
  }
  if (min > 0 && p.stock <= min * 2) {
    return 'text-warning';
  }
  if (max > 0 && p.stock >= max) {
    return 'text-primary';
  }
  return 'text-foreground';
}

function ProductThumb({ product }: { product: ProductItem }) {
  const media = product.medias?.[0];
  return (
    <div className="size-8 shrink-0">
      {media?.url ? (
        <Image
          alt={media.alt ?? product.name}
          className="size-8 rounded-md object-cover"
          height={32}
          src={media.url}
          width={32}
        />
      ) : (
        <span className="inline-flex size-8 items-center justify-center rounded-md border border-border border-dashed bg-muted text-muted-foreground">
          <PhotoIcon className="size-4" />
        </span>
      )}
    </div>
  );
}

function StockCell({ product }: { product: ProductItem }) {
  const unit = UNIT_LABEL[product.stockUnit] ?? product.stockUnit;
  return (
    <span className={getStockColor(product)}>
      {product.stock} {unit}
    </span>
  );
}

const columnHelper = createColumnHelper<ProductItem>();

interface ProductsListProps {
  isLoading?: boolean;
}

export const ProductsList = ({ isLoading }: ProductsListProps) => {
  const { slug: organizationSlug } = useOrganization();
  const products = useSuspenseProducts();
  const [, setParams] = useProductsParams();
  const router = useRouter();
  const deleteProduct = useDeleteProduct();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );

  const handleConfirmDelete = async () => {
    if (!selectedProduct) {
      return;
    }
    await deleteProduct.mutateAsync({
      organizationSlug,
      id: selectedProduct.id,
    });
    setIsOpenDeleteModal(false);
  };

  const rowActions = (product: ProductItem): RowAction[] => {
    const goToProduct = () =>
      router.push(`/${organizationSlug}/produtos/${product.id}`);

    return [
      { label: 'Ver detalhes', icon: EyeIcon, onClick: goToProduct },
      { label: 'Editar produto', icon: PencilIcon, onClick: goToProduct },
      {
        label: 'Excluir produto',
        icon: TrashIcon,
        onClick: () => {
          setSelectedProduct(product);
          setIsOpenDeleteModal(true);
        },
        variant: 'destructive',
      },
    ];
  };

  const columns = [
    columnHelper.accessor('code', {
      header: 'Código',
      cell: ({ getValue }) => (
        <span className="font-medium">#{getValue()}</span>
      ),
    }),

    columnHelper.accessor('name', {
      header: 'Produto',
      meta: { expand: true },
      cell: ({ row }) => (
        <span className="inline-flex items-center gap-2.5">
          <ProductThumb product={row.original} />
          {row.original.name}
        </span>
      ),
    }),

    columnHelper.accessor('category', {
      header: 'Categoria',
      cell: ({ getValue }) =>
        getValue() ?? <span className="text-muted-foreground">—</span>,
    }),

    columnHelper.accessor('costPrice', {
      header: 'Custo',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-16' },
      cell: ({ getValue }) => (
        <span className="text-muted-foreground tabular-nums">
          {applyCurrencyMask(getValue())}
        </span>
      ),
    }),

    columnHelper.accessor('salePrice', {
      header: 'Preço de venda',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-20' },
      cell: ({ getValue }) => (
        <span className="tabular-nums">{applyCurrencyMask(getValue())}</span>
      ),
    }),

    columnHelper.display({
      id: 'stock',
      header: 'Estoque',
      meta: { align: 'right', skeletonClassName: 'ml-auto w-16' },
      cell: ({ row }) => <StockCell product={row.original} />,
    }),

    columnHelper.display({
      id: 'actions',
      header: () => null,
      meta: { align: 'right', skeletonClassName: 'ml-auto w-8' },
      cell: ({ row }) => <RowActions actions={rowActions(row.original)} />,
    }),
  ];

  const items = products.data.items ?? [];
  const isFetching = products.isFetching || isLoading;

  return (
    <>
      <DataTable
        columns={columns}
        data={items}
        emptyMessage="Nenhum produto encontrado."
        isFetching={isFetching}
        onRowClick={(product) =>
          router.push(`/${organizationSlug}/produtos/${product.id}`)
        }
        pagination={{
          page: products.data.page,
          totalPages: products.data.totalPages,
          onPageChange: (page) => setParams({ page }),
        }}
        renderMobileCard={(product) => (
          <div className="flex gap-3">
            <ProductThumb product={product} />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-foreground text-sm">
                    {product.name}
                  </div>
                  <div className="truncate text-muted-foreground text-xs">
                    #{product.code} · {product.category ?? 'Sem categoria'}
                  </div>
                </div>
                <RowActions actions={rowActions(product)} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <StockCell product={product} />
                <span className="font-semibold tabular-nums">
                  {applyCurrencyMask(product.salePrice)}
                </span>
              </div>
            </div>
          </div>
        )}
      />

      <Modal
        actions={[
          {
            label: 'Cancelar',
            onClick: () => setIsOpenDeleteModal(false),
            variant: 'outline',
            shouldRender: true,
            disabled: deleteProduct.isPending,
          },
          {
            label: 'Excluir',
            onClick: handleConfirmDelete,
            variant: 'destructive',
            shouldRender: true,
            disabled: deleteProduct.isPending,
            loading: deleteProduct.isPending,
          },
        ]}
        description={
          selectedProduct
            ? `Tem certeza que deseja excluir "${selectedProduct.name}"? Esta ação não pode ser desfeita.`
            : 'Tem certeza que deseja excluir este produto?'
        }
        onOpenChange={setIsOpenDeleteModal}
        open={isOpenDeleteModal}
        title="Excluir Produto"
      />
    </>
  );
};
