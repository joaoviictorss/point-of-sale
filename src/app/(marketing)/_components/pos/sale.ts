export type SalePhase = 'typing' | 'pix' | 'printed';

export type SaleState = {
  phase: SalePhase;
  digits: string;
};

export type SaleEvent =
  | { type: 'digit'; digit: string }
  | { type: 'backspace' }
  | { type: 'clear' }
  | { type: 'confirm' }
  | { type: 'approve' };

export const MAX_DIGITS = 6;

export const INITIAL_SALE: SaleState = { phase: 'typing', digits: '' };

const DIGIT = /^\d$/;

/** Digits enter from the cents side, like a card terminal: "1" -> "0,01", "1248" -> "12,48". */
export function formatAmount(digits: string): string {
  const cents = Number.parseInt(digits || '0', 10);
  const reais = Math.floor(cents / 100).toLocaleString('pt-BR');
  return `${reais},${String(cents % 100).padStart(2, '0')}`;
}

function typeDigit(state: SaleState, digit: string): SaleState {
  const accepted =
    state.phase === 'typing' &&
    DIGIT.test(digit) &&
    state.digits.length < MAX_DIGITS &&
    !(digit === '0' && state.digits === '');
  return accepted ? { ...state, digits: state.digits + digit } : state;
}

/** Correcting or clearing on the QR screen goes back to typing and keeps the amount. */
function edit(state: SaleState, digits: string): SaleState {
  if (state.phase === 'pix') {
    return { ...state, phase: 'typing' };
  }
  return state.phase === 'typing' ? { ...state, digits } : state;
}

function confirm(state: SaleState): SaleState {
  if (state.phase === 'typing') {
    return state.digits ? { ...state, phase: 'pix' } : state;
  }
  if (state.phase === 'pix') {
    return { ...state, phase: 'printed' };
  }
  return INITIAL_SALE;
}

export function saleReducer(state: SaleState, event: SaleEvent): SaleState {
  switch (event.type) {
    case 'digit':
      return typeDigit(state, event.digit);
    case 'backspace':
      return edit(state, state.digits.slice(0, -1));
    case 'clear':
      return edit(state, '');
    case 'confirm':
      return confirm(state);
    case 'approve':
      return state.phase === 'pix' ? { ...state, phase: 'printed' } : state;
    default:
      return state;
  }
}
