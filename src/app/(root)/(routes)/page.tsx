"use client";

import { useEffect } from "react";
import { useOrganizationModal } from "@/hooks";

// Esta página é um "trigger automático" para abrir a modal de criação de organização.
export default function SetupPage() {
  const { onOpen, isOpen } = useOrganizationModal();

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}
