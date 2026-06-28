'use client';

import {
  EllipsisVerticalIcon,
  EyeIcon,
  PencilIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { Modal } from '@/components';
import { Badge, Button } from '@/components/shadcn';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/shadcn/table';
import { useOrganization } from '@/contexts/organization-context';
import {
  useDeleteProduct,
  useSuspenseProducts,
} from '@/hooks/product/use-products';
import { cn } from '@/lib/utils';
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

type StockVariant = 'destructive-soft' | 'warning' | 'info' | 'success';

function getStockState(p: ProductItem): {
  label: string;
  variant: StockVariant;
  dot: string;
} {
  const min = p.minStock ?? 0;
  const max = p.maxStock ?? 0;
  if (p.stock <= min) {
    return { label: 'Crítico', variant: 'destructive-soft', dot: 'bg-red-500' };
  }
  if (min > 0 && p.stock <= min * 2) {
    return { label: 'Baixo', variant: 'warning', dot: 'bg-amber-500' };
  }
  if (max > 0 && p.stock >= max) {
    return { label: 'No limite', variant: 'info', dot: 'bg-blue-500' };
  }
  return { label: 'Em dia', variant: 'success', dot: 'bg-green-500' };
}

function ProductThumb({ product }: { product: ProductItem }) {
  const media = product.medias?.[0];
  return (
    <div className="size-10 shrink-0">
      {media?.url ? (
        <Image
          alt={media.alt ?? product.name}
          className="size-10 rounded-lg object-cover"
          height={40}
          src={media.url}
          width={40}
        />
      ) : (
        <span className="inline-flex size-10 items-center justify-center rounded-lg border border-border border-dashed bg-muted text-muted-foreground">
          <PhotoIcon className="size-4" />
        </span>
      )}
    </div>
  );
}

function StockBadge({ product }: { product: ProductItem }) {
  const state = getStockState(product);
  const unit = UNIT_LABEL[product.stockUnit] ?? product.stockUnit;
  return (
    <Badge variant={state.variant}>
      <span className={cn('size-1.5 rounded-full', state.dot)} />
      {product.stock} {unit} · {state.label}
    </Badge>
  );
}

const EDGE_COLUMNS = new Set(['image', 'product', 'actions']);
const SKELETON_KEYS = ['sk-0', 'sk-1', 'sk-2', 'sk-3', 'sk-4'];
const columnHelper = createColumnHelper<ProductItem>();

interface ProductsListProps {
  isLoading?: boolean;
}

export const ProductsList = ({ isLoading }: ProductsListProps) => {
  const { slug: organizationSlug } = useOrganization();
  const products = useSuspenseProducts();
  const router = useRouter();
  const deleteProduct = useDeleteProduct();

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(
    null
  );
  const dropdownOpenRef = useRef(false);

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

  const columns = [
    columnHelper.display({
      id: 'image',
      size: 56,
      header: () => null,
      cell: ({ row }) => <ProductThumb product={row.original} />,
    }),

    columnHelper.display({
      id: 'product',
      header: 'Produto',
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground text-sm leading-snug">
            {row.original.name}
          </span>
          <span className="font-mono text-muted-foreground text-xs">
            #{row.original.code}
          </span>
        </div>
      ),
    }),

    columnHelper.accessor('category', {
      header: 'Categoria',
      cell: ({ getValue }) => {
        const cat = getValue();
        return cat ? (
          <Badge variant="secondary">{cat}</Badge>
        ) : (
          <span className="text-muted-foreground text-xs">—</span>
        );
      },
    }),

    columnHelper.accessor('salePrice', {
      header: 'Preço de venda',
      cell: ({ getValue }) => (
        <span className="font-semibold text-foreground text-sm tabular-nums">
          {applyCurrencyMask(getValue())}
        </span>
      ),
    }),

    columnHelper.display({
      id: 'stock',
      header: 'Estoque',
      cell: ({ row }) => <StockBadge product={row.original} />,
    }),

    columnHelper.display({
      id: 'actions',
      size: 56,
      header: () => null,
      cell: ({ row }) => {
        const product = row.original;
        const goToProduct = () =>
          router.push(`/${organizationSlug}/produtos/${product.id}`);

        return (
          <div className="flex justify-end">
            <DropdownMenu
              onOpenChange={(open) => {
                dropdownOpenRef.current = open;
                if (!open) {
                  setTimeout(() => { dropdownOpenRef.current = false; }, 0);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  className="size-8 text-muted-foreground hover:text-foreground"
                  size="icon"
                  type="button"
                  variant="ghost"
                >
                  <EllipsisVerticalIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem onClick={goToProduct}>
                  <EyeIcon className="size-4" />
                  Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={goToProduct}>
                  <PencilIcon className="size-4" />
                  Editar produto
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(event) => {
                    event.preventDefault();
                    setSelectedProduct(product);
                    setIsOpenDeleteModal(true);
                  }}
                  variant="destructive"
                >
                  <TrashIcon className="size-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    }),
  ];

  const items = products.data.items ?? [];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const isFetching = products.isFetching || isLoading;

  const skeletonRow = (key: string) => (
    <TableRow className="hover:bg-transparent" key={key}>
      <TableCell className="border-border border-b px-4 py-3">
        <div className="size-10 animate-pulse rounded-lg bg-secondary" />
      </TableCell>
      <TableCell className="border-border border-b px-4 py-3">
        <div className="flex flex-col gap-1.5">
          <div className="h-3.5 w-36 animate-pulse rounded bg-secondary" />
          <div className="h-3 w-16 animate-pulse rounded bg-secondary" />
        </div>
      </TableCell>
      <TableCell className="border-border border-b px-4 py-3 text-center">
        <div className="mx-auto h-5 w-20 animate-pulse rounded-full bg-secondary" />
      </TableCell>
      <TableCell className="border-border border-b px-4 py-3 text-center">
        <div className="mx-auto h-3.5 w-20 animate-pulse rounded bg-secondary" />
      </TableCell>
      <TableCell className="border-border border-b px-4 py-3 text-center">
        <div className="mx-auto h-6 w-32 animate-pulse rounded-full bg-secondary" />
      </TableCell>
      <TableCell className="border-border border-b px-4 py-3">
        <div className="ml-auto size-8 animate-pulse rounded-md bg-secondary" />
      </TableCell>
    </TableRow>
  );

  const renderBody = () => {
    if (isFetching) {
      return SKELETON_KEYS.map(skeletonRow);
    }
    if (table.getRowModel().rows.length === 0) {
      return (
        <TableRow className="hover:bg-transparent">
          <TableCell
            className="py-10 text-center text-muted-foreground text-sm"
            colSpan={columns.length}
          >
            Nenhum produto encontrado.
          </TableCell>
        </TableRow>
      );
    }
    return table.getRowModel().rows.map((row) => (
      <TableRow
        className="cursor-pointer border-border border-b transition-colors hover:bg-muted/50"
        key={row.id}
        onClick={() => {
          if (!dropdownOpenRef.current) {
            router.push(`/${organizationSlug}/produtos/${row.original.id}`);
          }
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            className={cn(
              'px-4 py-3 align-middle',
              !EDGE_COLUMNS.has(cell.column.id) && 'text-center'
            )}
            key={cell.id}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* table */}
        <div className="overflow-hidden rounded-lg border border-border bg-card shadow-xs">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow className="hover:bg-transparent" key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className={cn(
                        'whitespace-nowrap border-border border-b px-4 py-3 font-medium text-muted-foreground text-sm',
                        !EDGE_COLUMNS.has(header.id) && 'text-center'
                      )}
                      key={header.id}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>{renderBody()}</TableBody>
          </Table>
        </div>
      </div>

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
