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
        filters={<SellersFilters />}
        primaryActionButtonOnClick={createDialog.openDialog}
        primaryActionButtonText="Criar novo vendedor"
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
