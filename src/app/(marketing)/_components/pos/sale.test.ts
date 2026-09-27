import {
  formatAmount,
  INITIAL_SALE,
  MAX_DIGITS,
  type SaleEvent,
  type SaleState,
  saleReducer,
} from './sale';

const run = (events: SaleEvent[], from: SaleState = INITIAL_SALE) =>
  events.reduce(saleReducer, from);
const digits = (value: string): SaleEvent[] =>
  [...value].map((digit) => ({ type: 'digit', digit }));

describe('formatAmount', () => {
  it('should read digits from the cents side', () => {
    expect(formatAmount('')).toBe('0,00');
    expect(formatAmount('1')).toBe('0,01');
    expect(formatAmount('12480')).toBe('124,80');
    expect(formatAmount('123456')).toBe('1.234,56');
  });
});

describe('saleReducer', () => {
  it('should ignore a leading zero and stop at the digit limit', () => {
    expect(run(digits('0')).digits).toBe('');
    expect(run(digits('1234567')).digits).toHaveLength(MAX_DIGITS);
  });

  it('should not charge an empty sale', () => {
    expect(run([{ type: 'confirm' }])).toEqual(INITIAL_SALE);
  });

  it('should go typing -> pix -> printed -> new sale on confirm', () => {
    const pix = run([...digits('4500'), { type: 'confirm' }]);
    expect(pix).toEqual({ phase: 'pix', digits: '4500' });
    const printed = saleReducer(pix, { type: 'confirm' });
    expect(printed.phase).toBe('printed');
    expect(saleReducer(printed, { type: 'confirm' })).toEqual(INITIAL_SALE);
  });

  it('should approve a pending PIX when the timer fires', () => {
    const pix = run([...digits('99'), { type: 'confirm' }]);
    expect(saleReducer(pix, { type: 'approve' }).phase).toBe('printed');
    expect(saleReducer(INITIAL_SALE, { type: 'approve' })).toBe(INITIAL_SALE);
  });

  it('should leave the QR and keep the amount when clearing or correcting during pix', () => {
    const pix = run([...digits('1250'), { type: 'confirm' }]);
    expect(saleReducer(pix, { type: 'clear' })).toEqual({
      phase: 'typing',
      digits: '1250',
    });
    expect(saleReducer(pix, { type: 'backspace' })).toEqual({
      phase: 'typing',
      digits: '1250',
    });
  });

  it('should correct and clear while typing', () => {
    expect(run([...digits('123'), { type: 'backspace' }]).digits).toBe('12');
    expect(run([...digits('123'), { type: 'clear' }]).digits).toBe('');
  });
});
