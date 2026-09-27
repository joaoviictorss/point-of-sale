import type { CSSProperties } from 'react';
import type { Product } from '../demo-data';
import type { CartLine, DemoState } from '../sale-demo';

/** className + style for an element that may be flashing after a change. */
export type Fx = (
  key: string,
  base?: string,
  as?: string
) => { className: string; style?: CSSProperties };

/** Everything a screen renders, already derived from the demo store. */
export type ScreenView = {
  state: DemoState;
  lines: CartLine[];
  subtotal: number;
  matches: Product[];
  product: (id: string) => Product;
  fx: Fx;
};

export type ViewProps = { view: ScreenView };
