import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/Shadcn/dialog";
import { Button } from "../Shadcn";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  disabled?: boolean;
  loading?: boolean;
  shouldRender?: boolean;
}

export interface CustomDialogProps {
  // Controle de estado
  open: boolean;
  onOpenChange: (open: boolean) => void;

  // Conteúdo
  title?: string;
  description?: string;
  children: React.ReactNode;

  // Configurações visuais
  size?: "sm" | "md" | "lg" | "xl" | "full";
  showCloseButton?: boolean;
  closeOnEscape?: boolean;
  closeOnOverlayClick?: boolean;

  // Ações do footer
  actions?: DialogAction[];
  showFooter?: boolean;
  footerContent?: React.ReactNode;

  // Classes customizadas
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  footerClassName?: string;
  subtitleClassName?: string;

  // Callbacks
  onClose?: () => void;
  onOpen?: () => void;
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  full: "sm:max-w-[90vw]",
};

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  actions = [],
  showFooter = true,
  footerContent,
  className = "",
  headerClassName = "",
  contentClassName = "",
  footerClassName = "",
  subtitleClassName = "",
  onClose,
  onOpen,
}: CustomDialogProps) => {
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (isOpen && onOpen) {
      onOpen();
    } else if (!isOpen && onClose) {
      onClose();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    onClose?.();
  };

  const handleOverlayClick = (event: PointerDownOutsideEvent) => {
    if (!closeOnOverlayClick) {
      event.preventDefault();
      return;
    }
  };

  const handleEscapeKey = (e: KeyboardEvent) => {
    if (!closeOnEscape && e.key === "Escape") {
      e.preventDefault();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className={`${sizeClasses[size]} ${className}`}
        onPointerDownOutside={handleOverlayClick}
        onEscapeKeyDown={handleEscapeKey}
        showCloseButton={false}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <DialogHeader
            className={cn(
              "flex items-start justify-between flex-col gap-2",
              headerClassName
            )}
          >
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription className={cn("", subtitleClassName)}>
                {description}
              </DialogDescription>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                className="size p-0 absolute right-3 top-3"
                onClick={handleClose}
              >
                <XMarkIcon className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </Button>
            )}
          </DialogHeader>
        )}

        {/* Content */}
        <div className={`${contentClassName}`}>{children}</div>

        {/* Footer */}
        {showFooter && (actions.length > 0 || footerContent) && (
          <DialogFooter className={footerClassName}>
            {footerContent ? (
              footerContent
            ) : (
              <div className="flex gap-2 justify-end">
                {actions.map(
                  ({ shouldRender = true, ...action }, index) =>
                    shouldRender && (
                      <Button
                        key={index}
                        variant={action.variant || "default"}
                        onClick={action.onClick}
                        disabled={action.disabled || action.loading}
                        className="min-w-[80px]"
                      >
                        {action.loading ? (
                          <div className="animate-spin rounded-full size-4 border-2 border-b-transparent" />
                        ) : (
                          action.label
                        )}
                      </Button>
                    )
                )}
              </div>
            )}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};
