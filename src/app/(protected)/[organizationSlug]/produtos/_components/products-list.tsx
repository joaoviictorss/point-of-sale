"use client";

import { EyeIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import type { Product } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Modal } from "@/components";
import { Button } from "@/components/Shadcn";
import { Table } from "@/components/table";
import type { TableColumn } from "@/components/table/data";
import { useOrganization } from "@/contexts/organization-context";
import {
  useDeleteProduct,
  useSuspenseProducts,
} from "@/hooks/product/use-products";
import { applyCurrencyMask } from "@/utils/functions";

interface ProductsListProps {
  isLoading?: boolean;
}

export const ProductsList = ({ isLoading }: ProductsListProps) => {
  const { slug: organizationSlug } = useOrganization();
  const products = useSuspenseProducts();
  const router = useRouter();

  const deleteProduct = useDeleteProduct();

  const handleConfirmDelete = async (idToDelete: string | null) => {
    if (!idToDelete) {
      return;
    }
    await deleteProduct.mutateAsync({ id: idToDelete });
  };

  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );

  const handleCloseDeleteModal = () => {
    setIsOpenDeleteModal(false);
  };

  const columns: TableColumn<Product>[] = [
    {
      key: "code",
      title: "Código",
      dataIndex: "code",
    },
    {
      key: "name",
      title: "Nome do Produto",
      dataIndex: "name",
    },
    {
      key: "category",
      title: "Categoria",
      dataIndex: "category",
    },
    {
      key: "salePrice",
      title: "Preço de Venda",
      dataIndex: "salePrice",
      render: (_, record) => applyCurrencyMask(record.salePrice),
    },
    {
      key: "costPrice",
      title: "Preço de Custo",
      dataIndex: "costPrice",
      render: (_, record) => applyCurrencyMask(record.costPrice),
    },
    {
      key: "stock",
      title: "Estoque",
      dataIndex: "stock",
    },
    {
      key: "actions",
      title: "",
      render: (_, record) => {
        const handleNavigateToProductPage = () => {
          router.push(`/${organizationSlug}/produtos/${record.id}`);
        };

        const handleOpenDeleteModal = () => {
          setSelectedProductId(record.id);
          setIsOpenDeleteModal(true);
        };

        return (
          <div className="flex items-center gap-2">
            <Button
              className="cursor-pointer p-2 transition duration-200 hover:scale-110 hover:text-primary"
              onClick={handleNavigateToProductPage}
              size="icon"
              title="Visualizar produto"
              type="button"
              variant="ghost"
            >
              <EyeIcon className="size-4" />
            </Button>
            <Button
              className="cursor-pointer p-2 transition duration-200 hover:scale-110 hover:text-warning"
              onClick={handleNavigateToProductPage}
              size="icon"
              title="Editar produto"
              type="button"
              variant="ghost"
            >
              <PencilIcon className="size-4" />
            </Button>
            <Button
              className="cursor-pointer p-2 transition duration-200 hover:scale-110 hover:text-error"
              onClick={handleOpenDeleteModal}
              size="icon"
              title="Excluir produto"
              type="button"
              variant="ghost"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table<Product>
        columns={columns}
        data={products.data.items ?? []}
        loading={products.isFetching || isLoading}
        rowKey="id"
      />

      {/* Modal de Delete */}
      <Modal
        actions={[
          {
            label: "Cancelar",
            onClick: handleCloseDeleteModal,
            variant: "outline",
            shouldRender: true,
            disabled: deleteProduct.isPending,
          },
          {
            label: "Excluir",
            onClick: () => handleConfirmDelete(selectedProductId),
            variant: "destructive",
            shouldRender: true,
            disabled: deleteProduct.isPending,
            loading: deleteProduct.isPending,
          },
        ]}
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        onOpenChange={setIsOpenDeleteModal}
        open={isOpenDeleteModal}
        title="Excluir Produto"
      />
    </>
  );
};
