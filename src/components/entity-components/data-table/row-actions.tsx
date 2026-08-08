'use client';

import type { ComponentType, SVGProps } from 'react';
import { Button } from '@/components/shadcn';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/shadcn/tooltip';
import { cn } from '@/lib/utils';

export type RowAction = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
  disabled?: boolean;
};

type RowActionsProps = {
  actions: RowAction[];
};

export const RowActions = ({ actions }: RowActionsProps) => {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {actions.map((action) => (
        <Tooltip key={action.label}>
          <TooltipTrigger asChild>
            <Button
              aria-label={action.label}
              className={cn(
                'size-8 text-text-muted transition-colors',
                action.variant === 'destructive'
                  ? 'hover:bg-destructive/10 hover:text-destructive'
                  : 'hover:bg-muted hover:text-foreground'
              )}
              disabled={action.disabled ?? !action.onClick}
              onClick={(event) => {
                event.stopPropagation();
                action.onClick?.();
              }}
              size="icon"
              type="button"
              variant="ghost"
            >
              <action.icon className="size-[18px]" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>{action.label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
