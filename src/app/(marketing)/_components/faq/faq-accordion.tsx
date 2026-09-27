'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import { useId, useState } from 'react';
import { cn } from '@/lib/utils';

export type FaqEntry = { q: string; a: string };

function FaqItem({
  entry,
  open,
  panelId,
  onToggle,
}: {
  entry: FaqEntry;
  open: boolean;
  panelId: string;
  onToggle: () => void;
}) {
  return (
    <div className="border-border border-b">
      <button
        aria-controls={panelId}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-medium text-base text-foreground"
        onClick={onToggle}
        type="button"
      >
        <span>{entry.q}</span>
        <span
          className={cn(
            'grid size-7 shrink-0 place-items-center rounded-full border border-border transition-[transform,background-color] duration-200 ease-out',
            open ? 'rotate-45 bg-gray-100' : 'bg-white'
          )}
        >
          <PlusIcon className="size-3.5 text-text-muted" />
        </span>
      </button>
      <div
        className={cn(
          'grid transition-[grid-template-rows] duration-250 ease-out',
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
        id={panelId}
        inert={!open}
      >
        <div className="overflow-hidden">
          <p className="text-pretty pr-11 pb-5 text-[15px] text-text-muted leading-relaxed">
            {entry.a}
          </p>
        </div>
      </div>
    </div>
  );
}

/** One answer open at a time; the first starts open. */
export function FaqAccordion({ entries }: { entries: FaqEntry[] }) {
  const [open, setOpen] = useState(0);
  const baseId = useId();

  return entries.map((entry, k) => (
    <FaqItem
      entry={entry}
      key={entry.q}
      onToggle={() => setOpen(open === k ? -1 : k)}
      open={open === k}
      panelId={`${baseId}-${k}`}
    />
  ));
}
