'use client';

import { EntityContainer } from '@/components/entity-components/entity-container';
import { useDialog } from '@/hooks';
import { NewMovementModal } from './new-movement-modal';
import { StockMovementsFilters } from './stock-movements-filters';

export const StockContainer = ({ children }: { children: React.ReactNode }) => {
  const createDialog = useDialog();

  return (
    <>
      <EntityContainer
        filters={<StockMovementsFilters />}
        primaryActionButtonOnClick={createDialog.openDialog}
        primaryActionButtonText="Nova movimentação"
      >
        {children}
      </EntityContainer>

      <NewMovementModal
        onOpenChange={createDialog.setOpen}
        open={createDialog.open}
      />
    </>
  );
};
