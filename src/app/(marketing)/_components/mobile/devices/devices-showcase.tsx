'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import type { Device } from './demo-data';
import { DemoCancelled, SaleDemo } from './sale-demo';
import { LaptopScreen, PhoneScreen } from './screens/index';

/** One beat of the story: which device acts and what it does. */
export type Beat = { index: number; device: Device };

type Props = {
  className?: string;
  /** Called as the story moves: 0 choose products, 1 charge, 2 stock, 3 sales list; -1 between loops. */
  onBeat?: (beat: Beat | null) => void;
};

type SceneHandle = {
  setFocus: (d: Device | null) => void;
  setActive: (a: boolean) => void;
  dispose: () => void;
};
type Setup = { demo: SaleDemo; hosts: Record<Device, HTMLElement> };

const BEAT_HOLD = [900, 1400, 1800, 2000];

/** A wait that only counts while the showcase is on screen, and stops the story once unmounted. */
function holdWhile(isDisposed: () => boolean, isPaused: () => boolean) {
  return async (ms: number) => {
    let left = ms;
    while (left > 0) {
      // biome-ignore lint/nursery/noAwaitInLoop: ticks one after another by design
      await new Promise((resolve) => setTimeout(resolve, 100));
      if (isDisposed()) {
        throw new DemoCancelled();
      }
      if (!isPaused()) {
        left -= 100;
      }
    }
  };
}

type Player = {
  demo: SaleDemo;
  hold: (ms: number) => Promise<void>;
  focus: (device: Device | null) => void;
  beat: (beat: Beat | null) => void;
};

/** Sell on one device, watch the other update, then swap roles; forever. */
async function playStory({ demo, hold, focus, beat }: Player) {
  const steps = [
    () => demo.chooseProducts(),
    () => demo.chargePix(),
    () => demo.showStock(),
    () => demo.showSales(),
  ];
  let seller: Device = 'phone';
  await hold(1600); // the lid opens first
  for (;;) {
    demo.setMode(seller);
    const owner: Device = seller === 'phone' ? 'laptop' : 'phone';
    for (const [index, run] of steps.entries()) {
      const device = index < 2 ? seller : owner;
      beat({ index, device });
      focus(device);
      // biome-ignore lint/nursery/noAwaitInLoop: the story plays one beat after another
      await hold(900);
      await run();
      await hold(BEAT_HOLD[index]);
    }
    focus(null);
    beat(null);
    await hold(2200);
    seller = owner;
  }
}

function makeHost(kind: Device) {
  const glass = document.createElement('div');
  glass.className = `screen-wrap ${kind}`;
  const app = document.createElement('div');
  app.className = `vns vns-${kind}`;
  glass.append(app);
  return glass;
}

/**
 * The notebook + phone loop: a sale made on one device shows up on the other, then they swap.
 * No input needed; it plays only while on screen. three.js loads when the section gets near,
 * with a still image holding the layout until then (and for reduced motion or no WebGL).
 */
export function DevicesShowcase({ className, onBeat }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const onBeatRef = useRef(onBeat);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [ready, setReady] = useState(false);

  onBeatRef.current = onBeat;

  useEffect(() => {
    const next: Setup = {
      demo: new SaleDemo(),
      hosts: { phone: makeHost('phone'), laptop: makeHost('laptop') },
    };
    setSetup(next);
    return () => next.demo.dispose();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (
      !(container && stage && setup) ||
      matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }
    const { demo, hosts } = setup;
    let disposed = false;
    let loading = false;
    let paused = true;
    let scene: SceneHandle | undefined;

    const loop = () =>
      playStory({
        demo,
        hold: holdWhile(
          () => disposed,
          () => paused
        ),
        focus: (device) => scene?.setFocus(device),
        beat: (b) => onBeatRef.current?.(b),
      });

    async function load() {
      loading = true;
      try {
        const { DevicesScene } = await import('./devices-scene');
        if (disposed || !stage) {
          return;
        }
        const created = new DevicesScene(stage, {
          hosts,
          reducedMotion: false,
        });
        await created.init();
        if (disposed) {
          created.dispose();
          return;
        }
        scene = created;
        scene.setActive(!paused);
        setReady(true);
        loop().catch((err) => {
          if (!(err instanceof DemoCancelled)) {
            throw err;
          }
        });
      } catch {
        // No WebGL or the model failed: the still image stays.
      }
    }

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          load();
        }
      },
      { rootMargin: '400px 0px' }
    );
    const seen = new IntersectionObserver(([entry]) => {
      paused = !entry.isIntersecting;
      scene?.setActive(entry.isIntersecting);
    });
    near.observe(container);
    seen.observe(container);
    return () => {
      disposed = true;
      near.disconnect();
      seen.disconnect();
      scene?.dispose();
    };
  }, [setup]);

  const phoneApp = setup?.hosts.phone.firstElementChild;
  const laptopApp = setup?.hosts.laptop.firstElementChild;
  return (
    <div
      aria-label="Animação: uma venda feita no celular aparece no estoque e na lista de vendas do computador, e depois o contrário."
      className={cn('relative aspect-[1.24/1] w-full', className)}
      ref={containerRef}
      role="img"
    >
      {/* The still is rendered from the same camera over the same bleed area, so the 3D replaces it in place. */}
      <div className="devices-stage" ref={stageRef}>
        <Image
          alt=""
          className={cn(
            'pointer-events-none object-contain transition-opacity duration-700',
            ready && 'opacity-0'
          )}
          fill
          priority={false}
          sizes="(min-width: 1024px) 720px, 100vw"
          src="/3d/devices/aparelhos.webp"
        />
      </div>
      {setup && phoneApp
        ? createPortal(<PhoneScreen demo={setup.demo} />, phoneApp)
        : null}
      {setup && laptopApp
        ? createPortal(<LaptopScreen demo={setup.demo} />, laptopApp)
        : null}
    </div>
  );
}
