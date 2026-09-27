import { cn } from '@/lib/utils';

export type Task = { title: string; description: string };

/** The section's task list; the task the devices are showing right now is highlighted. */
export function TaskList({
  tasks,
  active,
  where,
}: {
  tasks: Task[];
  /** Index of the highlighted task, or -1 for none. */
  active: number;
  /** Where the highlighted task is happening, e.g. "no celular". */
  where: string | null;
}) {
  return (
    <ul className="mt-8 border-border border-t">
      {tasks.map((task, i) => {
        const on = i === active;
        return (
          <li
            className="relative grid grid-cols-[minmax(0,190px)_minmax(0,1fr)] gap-x-6 gap-y-2 border-border border-b py-4.5 pl-4"
            key={task.title}
          >
            <span
              aria-hidden
              className={cn(
                'absolute inset-y-3 left-0 w-0.5 rounded-full bg-primary transition-opacity duration-500',
                on ? 'opacity-100' : 'opacity-0'
              )}
            />
            <span
              className={cn(
                'font-semibold text-base transition-colors duration-500',
                on ? 'text-primary' : 'text-foreground'
              )}
            >
              {task.title}
              <span
                aria-hidden
                className={cn(
                  'mt-0.5 block font-medium text-text-muted text-xs transition-opacity duration-500',
                  on && where ? 'opacity-100' : 'opacity-0'
                )}
              >
                {where ? `Agora ${where}` : ' '}
              </span>
            </span>
            <span className="text-pretty text-[15px] text-text-muted leading-normal">
              {task.description}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
