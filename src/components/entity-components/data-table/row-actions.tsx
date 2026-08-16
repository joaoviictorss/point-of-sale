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
  variant?: 'default' | 'destructive' | 'primary' | 'warning';
  disabled?: boolean;
};

type RowActionsProps = {
  actions: RowAction[];
};

const VARIANT_HOVER_CLASSNAME: Record<
  NonNullable<RowAction['variant']>,
  string
> = {
  default: 'hover:bg-muted hover:text-foreground',
  destructive: 'hover:bg-destructive/10 hover:text-destructive',
  primary: 'hover:bg-blue-50 hover:text-blue-600',
  warning: 'hover:bg-amber-50 hover:text-amber-600',
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
                'size-8 text-gray-400 transition-colors',
                VARIANT_HOVER_CLASSNAME[action.variant ?? 'default']
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
