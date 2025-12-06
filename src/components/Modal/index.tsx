import { XMarkIcon } from '@heroicons/react/24/solid';
import type React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Shadcn/dialog';
import { cn } from '@/lib/utils';
import { Button } from '../Shadcn';

export interface DialogAction {
  label: string;
  onClick: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
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
  children?: React.ReactNode;

  // Configurações visuais
  size?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl'
    | '10xl'
    | 'full';
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
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
  '6xl': 'sm:max-w-6xl',
  '7xl': 'sm:max-w-7xl',
  '8xl': 'sm:max-w-8xl',
  '9xl': 'sm:max-w-9xl',
  '10xl': 'sm:max-w-10xl',
  full: 'sm:max-w-[90vw]',
};

type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>;

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  actions = [],
  showFooter = true,
  footerContent,
  className = '',
  headerClassName = '',
  contentClassName = '',
  footerClassName = '',
  subtitleClassName = '',
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
    if (!closeOnEscape && e.key === 'Escape') {
      e.preventDefault();
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange} open={open}>
      <DialogContent
        className={`${sizeClasses[size]} ${className}`}
        onEscapeKeyDown={handleEscapeKey}
        onPointerDownOutside={handleOverlayClick}
        showCloseButton={false}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <DialogHeader
            className={cn(
              'flex flex-col items-start justify-between gap-2',
              headerClassName
            )}
          >
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && (
              <DialogDescription className={cn('', subtitleClassName)}>
                {description}
              </DialogDescription>
            )}
            {showCloseButton && (
              <Button
                className="size absolute top-3 right-3 p-0"
                onClick={handleClose}
                size="sm"
                variant="ghost"
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
              <div className="flex justify-end gap-2">
                {actions.map(
                  ({ shouldRender = true, ...action }) =>
                    shouldRender && (
                      <Button
                        className="min-w-[80px]"
                        disabled={action.disabled || action.loading}
                        key={action.label}
                        onClick={action.onClick}
                        variant={action.variant || 'default'}
                      >
                        {action.loading ? (
                          <div className="size-4 animate-spin rounded-full border-2 border-b-transparent" />
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
