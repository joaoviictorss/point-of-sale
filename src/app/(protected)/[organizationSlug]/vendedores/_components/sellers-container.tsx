'use client';

import { EntityContainer } from '@/components/entity-components/entity-container';
import { useDialog } from '@/hooks';
import { SellerFormModal } from './seller-form-modal';
import { SellersFilters } from './sellers-filters';

export const SellersContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const createDialog = useDialog();

  return (
    <>
      <EntityContainer
        createButtonOnClick={createDialog.openDialog}
        createButtonText="Criar novo vendedor"
        filters={<SellersFilters />}
      >
        {children}
      </EntityContainer>

      <SellerFormModal
        onOpenChange={createDialog.setOpen}
        open={createDialog.open}
        seller={null}
      />
    </>
  );
};
