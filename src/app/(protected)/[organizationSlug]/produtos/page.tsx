'use client';

import {
  EyeIcon,
  FunnelIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Input, Modal } from '@/components';
import { Button } from '@/components/Shadcn';
import { Table } from '@/components/table';
import type { TableColumn } from '@/components/table/data';
import { useProducts } from '@/hooks';
import type { Product } from '@/types/api/product';
import { applyCurrencyMask } from '@/utils/functions';

const ProductsPage = () => {
  const { organizationSlug } = useParams<{ organizationSlug: string }>();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const router = useRouter();

  const handleOpenDeleteModal = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) {
      return;
    }

    try {
      await deleteProduct.mutateAsync(productToDelete.id);
      handleCloseDeleteModal();
    } catch {
      // Error handling can be improved with proper error reporting
    }
  };

  const {
    data,
    isFetching,
    deleteProduct,
    // currentPage,
    // totalPages,
    // hasNextPage,
    // hasPrevPage,
    // totalDocs,
    // currentCount,
    // nextPage,
    // prevPage,
  } = useProducts({
    organizationSlug,
    searchTerm,
    page: 1,
    limit: 2,
  });

  const columns: TableColumn<Product>[] = [
    {
      key: 'code',
      title: 'Código',
      dataIndex: 'code',
    },
    {
      key: 'name',
      title: 'Nome do Produto',
      dataIndex: 'name',
    },
    {
      key: 'category',
      title: 'Categoria',
      dataIndex: 'category',
    },
    {
      key: 'salePrice',
      title: 'Preço de Venda',
      dataIndex: 'salePrice',
      render: (_, record) => applyCurrencyMask(record.salePrice),
    },
    {
      key: 'costPrice',
      title: 'Preço de Custo',
      dataIndex: 'costPrice',
      render: (_, record) => applyCurrencyMask(record.costPrice),
    },
    {
      key: 'stock',
      title: 'Estoque',
      dataIndex: 'stock',
    },
    {
      key: 'actions',
      title: '',
      render: (_, record) => {
        const handleNavigateToView = () => {
          router.push(`/${organizationSlug}/produtos/${record.id}`);
        };

        const handleNavigateToEdit = () => {
          router.push(`/${organizationSlug}/produtos/${record.id}`);
        };

        const handleDelete = () => {
          handleOpenDeleteModal(record);
        };

        return (
          <div className="flex items-center gap-2">
            <button
              className="cursor-pointer p-2 transition duration-200 hover:scale-110 hover:text-primary"
              onClick={handleNavigateToView}
              title="Visualizar produto"
              type="button"
            >
              <EyeIcon className="size-4" />
            </button>
            <button
              className="cursor-pointer p-2 transition duration-200 hover:scale-110 hover:text-warning"
              onClick={handleNavigateToEdit}
              title="Editar produto"
              type="button"
            >
              <PencilIcon className="size-4" />
            </button>
            <button
              className="cursor-pointer p-2 transition duration-200 hover:scale-110 hover:text-error"
              onClick={handleDelete}
              title="Excluir produto"
              type="button"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <main className="flex flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <Input
            icon={<MagnifyingGlassIcon className={'size-4'} />}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar produto"
            type="text"
            value={searchTerm}
          />
          <Button className="gap-3" type="button" variant={'outline'}>
            <FunnelIcon className={'size-4'} />
            Filtrar
          </Button>
        </div>
        <Button
          onClick={() => router.push(`/${organizationSlug}/produtos/novo`)}
          type="button"
        >
          Criar novo produto
        </Button>
      </div>

      <Table<Product>
        columns={columns}
        data={data?.docs ?? []}
        loading={isFetching}
        rowKey="id"
      />

      {/* Modal de Delete */}
      <Modal
        actions={[
          {
            label: 'Cancelar',
            onClick: handleCloseDeleteModal,
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
        description="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        onOpenChange={setIsDeleteModalOpen}
        open={isDeleteModalOpen}
        title="Excluir Produto"
      />
    </main>
  );
};

export default ProductsPage;
