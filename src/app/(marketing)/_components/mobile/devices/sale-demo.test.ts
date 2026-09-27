import { CATALOG, matchProducts, saleWhen, stockStatus } from './demo-data';
import { SaleDemo } from './sale-demo';

describe('stockStatus', () => {
  it('should ask to restock when stock is at or below the minimum', () => {
    expect(stockStatus({ stock: 3, minStock: 3 }).label).toBe('Repor agora');
  });

  it('should warn when stock is up to twice the minimum', () => {
    expect(stockStatus({ stock: 4, minStock: 3 }).label).toBe('Estoque baixo');
  });

  it('should be in stock above twice the minimum', () => {
    expect(stockStatus({ stock: 12, minStock: 3 }).label).toBe('Em estoque');
  });
});

describe('matchProducts', () => {
  it('should find products by the start of the name, ignoring case', () => {
    expect(matchProducts(CATALOG, 'Carreg').map((p) => p.id)).toEqual([
      'carregador',
    ]);
  });

  it('should rank a code prefix above a name match', () => {
    const [first] = matchProducts(CATALOG, '7896');
    expect(first.id).toBe('carregador');
  });

  it('should return nothing for an empty query', () => {
    expect(matchProducts(CATALOG, '  ')).toEqual([]);
  });
});

describe('saleWhen', () => {
  it('should label today and yesterday like the sales list', () => {
    const now = new Date(2026, 8, 26, 15, 0);
    expect(saleWhen(new Date(2026, 8, 26, 14, 32), now)).toBe('Hoje - 14:32');
    expect(saleWhen(new Date(2026, 8, 25, 18, 40), now)).toBe('Ontem - 18:40');
  });
});

describe('SaleDemo', () => {
  let demo: SaleDemo;

  beforeEach(() => {
    demo = new SaleDemo(new Date(2026, 8, 26, 15, 0));
  });

  afterEach(() => demo.dispose());

  it('should add the same product to one cart line', () => {
    demo.add('vinho');
    demo.add('vinho');
    expect(demo.state.cart).toEqual([{ id: 'vinho', qty: 2 }]);
    expect(demo.subtotal()).toBe(11_980);
  });

  it('should lower stock, record the sale and its movements when confirmed', () => {
    demo.add('vinho');
    demo.add('cafe');
    demo.add('carregador');
    demo.checkout();
    demo.choosePay('PIX');
    demo.confirm(new Date(2026, 8, 26, 15, 1));

    const { state } = demo;
    expect(state.phase).toBe('done');
    expect(state.sales[0]).toMatchObject({
      n: 144,
      total: 12_480,
      pay: 'PIX',
      seller: 'Ana Souza',
    });
    expect(demo.product('carregador').stock).toBe(3);
    expect(stockStatus(demo.product('carregador')).label).toBe('Repor agora');
    expect(state.moves.slice(0, 3).map((m) => m.detail)).toEqual([
      'Venda #144',
      'Venda #144',
      'Venda #144',
    ]);
    expect(state.toast?.text).toBe('Venda nº 0144 registrada');
  });

  it('should credit the sale to the seller of the selling device', () => {
    demo.setMode('laptop');
    demo.add('fone');
    demo.checkout();
    demo.confirm();
    expect(demo.state.sales[0].seller).toBe('João Victor');
    expect(demo.owner()).toBe('phone');
  });

  it('should not open checkout with an empty cart', () => {
    demo.checkout();
    expect(demo.state.phase).toBe('cart');
  });
});
