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
        createButtonOnClick={createDialog.openDialog}
        createButtonText="Nova movimentação"
        filters={<StockMovementsFilters />}
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
