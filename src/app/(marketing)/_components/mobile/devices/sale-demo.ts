import {
  CATALOG,
  type Device,
  initialMoves,
  initialSales,
  type Movement,
  matchProducts,
  type OwnerPage,
  orderLabel,
  orderNumber,
  type PayMethod,
  type Product,
  type Sale,
  SELLERS,
  STORY_ITEMS,
} from './demo-data';

const FLASH_MS = 2400;
const TOAST_MS = 2600;

export type CartLine = Product & { qty: number };
type Phase = 'cart' | 'checkout' | 'done';
type LastSale = {
  n: number;
  total: number;
  pay: PayMethod;
  seller: string;
  ids: string[];
};

export type DemoState = {
  /** Which device sells; the other one shows the owner's pages. */
  mode: Device;
  ownerPage: OwnerPage;
  products: Product[];
  cart: { id: string; qty: number }[];
  search: string;
  typing: boolean;
  highlight: number;
  pressing: string | null;
  phase: Phase;
  pay: PayMethod;
  lastSale: LastSale | null;
  toast: { text: string; leaving: boolean } | null;
  sales: Sale[];
  moves: Movement[];
  now: Date;
};

export class DemoCancelled extends Error {}

/**
 * The sale the showcase acts out, as a tiny store (subscribe/getSnapshot for useSyncExternalStore).
 * Each story step is async and resolves once its screen change has played; dispose() cancels
 * whatever step is running.
 */
export class SaleDemo {
  state: DemoState;
  private version = 0;
  private readonly listeners = new Set<() => void>();
  private readonly flashes = new Map<string, number>();
  private readonly timers = new Set<ReturnType<typeof setTimeout>>();
  private flashTicker: ReturnType<typeof setInterval> | null = null;
  private nextOrder = 144;
  private nextMove = 6;
  private disposed = false;

  constructor(now = new Date()) {
    this.state = {
      mode: 'phone',
      ownerPage: 'vendas',
      products: CATALOG.map((p) => ({ ...p })),
      cart: [],
      search: '',
      typing: false,
      highlight: 0,
      pressing: null,
      phase: 'cart',
      pay: 'CASH',
      lastSale: null,
      toast: null,
      sales: initialSales(now),
      moves: initialMoves(now),
      now,
    };
  }

  // ---------- store ----------
  subscribe = (fn: () => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  getSnapshot = () => this.version;

  private emit(patch: Partial<DemoState> = {}) {
    this.state = { ...this.state, ...patch };
    this.version++;
    for (const fn of this.listeners) {
      fn();
    }
  }

  /**
   * CSS for a row that just changed: a short highlight whose phase survives re-renders
   * (negative delay), so a redraw never restarts it.
   */
  flash(key: string): { className: string; delay: string } | null {
    const start = this.flashes.get(key);
    if (start === undefined) {
      return null;
    }
    const age = performance.now() - start;
    if (age > FLASH_MS) {
      this.flashes.delete(key);
      return null;
    }
    return { className: 'flash', delay: `-${Math.round(age)}ms` };
  }

  private mark(key: string) {
    this.flashes.set(key, performance.now());
    // Keep redrawing while something is highlighted so it clears on time.
    this.flashTicker ??= setInterval(() => {
      if (this.flashes.size === 0 && this.flashTicker) {
        clearInterval(this.flashTicker);
        this.flashTicker = null;
      }
      this.emit();
    }, 1200);
  }

  private wait(ms: number) {
    return new Promise<void>((resolve, reject) => {
      if (this.disposed) {
        reject(new DemoCancelled());
        return;
      }
      const t = setTimeout(() => {
        this.timers.delete(t);
        if (this.disposed) {
          reject(new DemoCancelled());
        } else {
          resolve();
        }
      }, ms);
      this.timers.add(t);
    });
  }

  dispose() {
    this.disposed = true;
    for (const t of this.timers) {
      clearTimeout(t);
    }
    this.timers.clear();
    if (this.flashTicker) {
      clearInterval(this.flashTicker);
    }
    this.listeners.clear();
  }

  // ---------- derived ----------
  product(id: string) {
    const found = this.state.products.find((p) => p.id === id);
    if (!found) {
      throw new Error(`Produto ${id} fora do catálogo`);
    }
    return found;
  }

  cartLines(): CartLine[] {
    return this.state.cart.map((l) => ({ ...this.product(l.id), qty: l.qty }));
  }

  subtotal() {
    return this.cartLines().reduce((sum, l) => sum + l.price * l.qty, 0);
  }

  matches() {
    return matchProducts(this.state.products, this.state.search);
  }

  owner(): Device {
    return this.state.mode === 'phone' ? 'laptop' : 'phone';
  }

  // ---------- actions ----------
  setMode(mode: Device) {
    this.emit({ mode });
    this.resetSale();
  }

  resetSale() {
    this.emit({
      cart: [],
      search: '',
      typing: false,
      pressing: null,
      phase: 'cart',
      pay: 'CASH',
      toast: null,
    });
  }

  add(id: string, qty = 1) {
    const cart = this.state.cart.some((l) => l.id === id)
      ? this.state.cart.map((l) =>
          l.id === id ? { ...l, qty: l.qty + qty } : l
        )
      : [...this.state.cart, { id, qty }];
    this.mark(`c-${id}`);
    this.emit({ cart });
  }

  async typeSearch(query: string, target?: string) {
    this.emit({ search: '', typing: true, highlight: 0 });
    for (const ch of query) {
      // biome-ignore lint/nursery/noAwaitInLoop: typing is one key after another
      await this.wait(115);
      this.emit({ search: this.state.search + ch });
    }
    const list = this.matches();
    const index = target ? list.findIndex((p) => p.id === target) : 0;
    this.emit({ typing: false, highlight: Math.max(0, index) });
  }

  async pick(id: string) {
    if (this.state.phase !== 'cart' || this.state.pressing) {
      return;
    }
    this.emit({ pressing: id });
    await this.wait(260);
    this.add(id);
    this.emit({ pressing: null, search: '' });
  }

  checkout() {
    if (this.state.cart.length > 0) {
      this.emit({ phase: 'checkout', pay: 'CASH' });
    }
  }

  choosePay(pay: PayMethod) {
    this.emit({ pay });
  }

  /** Registers the sale: stock down, movements and sale recorded, the app's success toast. */
  confirm(at = new Date()) {
    const lines = this.cartLines();
    if (lines.length === 0) {
      return;
    }
    const total = this.subtotal();
    const n = this.nextOrder++;
    const seller = SELLERS[this.state.mode];
    const qty = new Map(lines.map((l) => [l.id, l.qty]));
    const products = this.state.products.map((p) =>
      qty.has(p.id)
        ? { ...p, stock: Math.max(0, p.stock - (qty.get(p.id) ?? 0)) }
        : p
    );
    const moves: Movement[] = lines.map((l) => ({
      id: this.nextMove++,
      product: l.id,
      type: 'Venda',
      qty: -l.qty,
      detail: `Venda ${orderLabel(n)}`,
      user: seller,
      at,
      fresh: true,
    }));
    for (const l of lines) {
      this.mark(`p-${l.id}`);
    }
    for (const m of moves) {
      this.mark(`m-${m.id}`);
    }
    this.mark(`s-${n}`);
    this.emit({
      products,
      moves: [
        ...moves,
        ...this.state.moves.map((m) => ({ ...m, fresh: false })),
      ],
      sales: [
        { n, customer: null, seller, total, pay: this.state.pay, at },
        ...this.state.sales,
      ],
      lastSale: {
        n,
        total,
        pay: this.state.pay,
        seller,
        ids: lines.map((l) => l.id),
      },
      phase: 'done',
      toast: { text: `Venda nº ${orderNumber(n)} registrada`, leaving: false },
      now: at,
    });
    this.wait(TOAST_MS)
      .then(() => {
        this.emit({
          toast: this.state.toast && { ...this.state.toast, leaving: true },
        });
        return this.wait(300);
      })
      .then(() => this.emit({ toast: null }))
      .catch(() => {
        // the demo was disposed before the toast finished
      });
  }

  /** Shows an owner page and re-highlights what the last sale touched, so it's seen on arrival. */
  showPage(page: OwnerPage) {
    const last = this.state.lastSale;
    if (last) {
      if (page === 'produtos') {
        for (const id of last.ids) {
          this.mark(`p-${id}`);
        }
      } else if (page === 'vendas') {
        this.mark(`s-${last.n}`);
      } else {
        for (const m of this.state.moves.slice(0, last.ids.length)) {
          this.mark(`m-${m.id}`);
        }
      }
    }
    this.emit({ ownerPage: page });
  }

  // ---------- the story ----------
  async chooseProducts() {
    this.resetSale();
    for (const [id, query] of STORY_ITEMS) {
      // biome-ignore lint/nursery/noAwaitInLoop: the products are picked one after another
      await this.wait(250);
      await this.typeSearch(query, id);
      await this.wait(420);
      await this.pick(id);
      await this.wait(380);
    }
  }

  async chargePix() {
    if (this.state.cart.length === 0) {
      await this.chooseProducts();
    }
    this.checkout();
    await this.wait(700);
    this.choosePay('PIX');
    await this.wait(1100);
    this.confirm();
    await this.wait(900);
  }

  async showStock() {
    this.showPage('produtos');
    await this.wait(1600);
  }

  async showSales() {
    this.showPage('vendas');
    await this.wait(1600);
  }
}
