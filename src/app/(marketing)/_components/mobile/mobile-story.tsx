'use client';

import { type ReactNode, useState } from 'react';
import { Reveal } from '../ui/reveal';
import type { Device } from './devices/demo-data';
import { type Beat, DevicesShowcase } from './devices/devices-showcase';
import { type Task, TaskList } from './task-list';

// Story beats (choose products, charge, stock, sales list) to the task they illustrate.
const TASK_OF_BEAT = [0, 0, 1, 2];
const WHERE: Record<Device, string> = {
  phone: 'no celular',
  laptop: 'no computador',
};

/** Keeps the devices loop and the task list in step. Static copy comes in as slots. */
export function MobileStory({
  tasks,
  intro,
  cta,
}: {
  tasks: Task[];
  intro: ReactNode;
  cta: ReactNode;
}) {
  const [beat, setBeat] = useState<Beat | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-[clamp(32px,5vw,72px)]">
      <Reveal className="relative min-w-0 flex-[1.3_1_480px]">
        <DevicesShowcase onBeat={setBeat} />
      </Reveal>
      <Reveal className="min-w-0 flex-[1_1_340px]" delay={0.1}>
        {intro}
        <TaskList
          active={beat ? TASK_OF_BEAT[beat.index] : -1}
          tasks={tasks}
          where={beat ? WHERE[beat.device] : null}
        />
        {cta}
      </Reveal>
    </div>
  );
}
