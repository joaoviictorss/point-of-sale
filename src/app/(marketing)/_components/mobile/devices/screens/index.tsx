'use client';

import { useSyncExternalStore } from 'react';
import { cn } from '@/lib/utils';
import type { SaleDemo } from '../sale-demo';
import { LaptopOwner, PhoneOwner } from './owner';
import { LaptopSeller, PhoneSeller } from './sale';
import type { ScreenView } from './view';
import './screens.css';

// The VNS app screens inside the showcase devices, copied from src/app/(protected)/[organizationSlug].
// These two are the only stateful pieces: they subscribe to the demo store and hand a derived view
// to presentational screens. The notebook is laid out at 880x550 and the phone at 360x780.

function useScreenView(demo: SaleDemo): ScreenView {
  useSyncExternalStore(demo.subscribe, demo.getSnapshot, demo.getSnapshot);
  return {
    state: demo.state,
    lines: demo.cartLines(),
    subtotal: demo.subtotal(),
    matches: demo.matches(),
    product: (id) => demo.product(id),
    fx: (key, base, as = 'flash') => {
      const f = demo.flash(key);
      return {
        className: cn(base, f && as),
        style: f ? { animationDelay: f.delay } : undefined,
      };
    },
  };
}

export function LaptopScreen({ demo }: { demo: SaleDemo }) {
  const view = useScreenView(demo);
  return view.state.mode === 'laptop' ? (
    <LaptopSeller view={view} />
  ) : (
    <LaptopOwner view={view} />
  );
}

export function PhoneScreen({ demo }: { demo: SaleDemo }) {
  const view = useScreenView(demo);
  return view.state.mode === 'phone' ? (
    <PhoneSeller view={view} />
  ) : (
    <PhoneOwner view={view} />
  );
}
