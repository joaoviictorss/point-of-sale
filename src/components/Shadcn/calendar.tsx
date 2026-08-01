'use client';

import { ptBR } from 'date-fns/locale';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import * as React from 'react';
import {
  type DayButton,
  DayPicker,
  getDefaultClassNames,
} from 'react-day-picker';

import { Button, buttonVariants } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      className={cn('p-3', className)}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'relative flex flex-col gap-4 md:flex-row',
          defaultClassNames.months
        ),
        month: cn('flex w-full flex-col gap-4', defaultClassNames.month),
        nav: cn(
          'absolute inset-x-0 top-0 flex items-center justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 text-muted-foreground hover:text-foreground',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'size-8 p-0 text-muted-foreground hover:text-foreground',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex h-8 items-center justify-center',
          defaultClassNames.month_caption
        ),
        caption_label: cn(
          'font-medium text-foreground text-sm',
          defaultClassNames.caption_label
        ),
        month_grid: cn('w-full border-collapse', defaultClassNames.month_grid),
        weekdays: cn('flex', defaultClassNames.weekdays),
        weekday: cn(
          'w-8 flex-1 rounded-md font-normal text-[0.8rem] text-muted-foreground',
          defaultClassNames.weekday
        ),
        week: cn('mt-2 flex w-full', defaultClassNames.week),
        day: cn(
          'group/day relative aspect-square h-full w-8 select-none p-0 text-center',
          defaultClassNames.day
        ),
        range_start: cn('rounded-l-md', defaultClassNames.range_start),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md', defaultClassNames.range_end),
        today: cn(
          'rounded-md data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-muted-foreground opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
      }}
      locale={ptBR}
      showOutsideDays={showOutsideDays}
      {...props}
    />
  );
}

function CalendarChevron({
  className,
  orientation,
}: {
  className?: string;
  orientation?: 'up' | 'down' | 'left' | 'right';
  size?: number;
  disabled?: boolean;
}) {
  const Icon = orientation === 'left' ? ChevronLeftIcon : ChevronRightIcon;
  return <Icon className={cn('size-4', className)} />;
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (modifiers.focused) {
      ref.current?.focus();
    }
  }, [modifiers.focused]);

  return (
    <Button
      className={cn(
        'flex aspect-square size-8 w-full min-w-8 flex-col gap-1 font-normal leading-none',
        'data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground',
        'data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground',
        'data-[range-start=true]:rounded-r-none data-[range-start=true]:rounded-l-md data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground',
        'data-[range-end=true]:rounded-r-md data-[range-end=true]:rounded-l-none data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground',
        'group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-[3px] group-data-[focused=true]/day:ring-ring/50',
        className
      )}
      data-day={day.date.toLocaleDateString()}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      data-range-start={modifiers.range_start}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      ref={ref}
      size="icon"
      variant="ghost"
      {...props}
    />
  );
}

export { Calendar, CalendarDayButton };
