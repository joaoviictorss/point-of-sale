import { useState } from "react";

export interface UseDialogReturn {
  open: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  toggleDialog: () => void;
  setOpen: (open: boolean) => void;
}

export function useDialog(initialOpen = false): UseDialogReturn {
  const [open, setOpen] = useState(initialOpen);

  const openDialog = () => setOpen(true);
  const closeDialog = () => setOpen(false);
  const toggleDialog = () => setOpen(!open);

  return {
    open,
    openDialog,
    closeDialog,
    toggleDialog,
    setOpen,
  };
}
