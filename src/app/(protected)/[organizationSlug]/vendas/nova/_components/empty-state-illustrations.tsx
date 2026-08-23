// Seis opções de ilustração pro empty state da venda (cluster "Ilustrações
// para o empty state" do design), mesmo traço dos ícones do sistema: linha
// aberta, stroke único, neutros slate/gray + um só acento azul, sem
// preenchimento decorativo. `BlankReceiptIcon` é a usada em produção
// (`cart-items-list.tsx`); as demais ficam aqui prontas caso troquem.

const VIEW_BOX = '0 0 160 140';

export function BlankReceiptIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="130"
      viewBox={VIEW_BOX}
      width="150"
    >
      <ellipse className="fill-blue-50" cx="80" cy="122" rx="44" ry="5" />
      <path
        className="fill-white stroke-slate-500"
        d="M50 32a6 6 0 0 1 6-6h48a6 6 0 0 1 6 6v78l-7.5-5-7.5 5-7.5-5-7.5 5-7.5-5-7.5 5-7.5-5-7.5 5Z"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <path
        className="stroke-gray-300"
        d="M62 50h36M62 64h36M62 78h22"
        strokeDasharray="6 7"
        strokeLinecap="round"
        strokeWidth={2.5}
      />
      <circle className="fill-primary" cx="111" cy="35" r="14" />
      <path
        className="stroke-white"
        d="M111 29v12M105 35h12"
        strokeLinecap="round"
        strokeWidth={2.8}
      />
    </svg>
  );
}

export function PriceTagIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="130"
      viewBox={VIEW_BOX}
      width="150"
    >
      <ellipse className="fill-blue-50" cx="80" cy="122" rx="42" ry="5" />
      <rect
        className="fill-white stroke-slate-500"
        height="66"
        rx="9"
        strokeWidth={2.5}
        width="84"
        x="38"
        y="36"
      />
      <circle
        className="stroke-slate-500"
        cx="53"
        cy="51"
        r="4.5"
        strokeWidth={2.5}
      />
      <path
        className="stroke-gray-300"
        d="M52 70v20M59 70v20M66 70v20M73 70v20M80 70v20M87 70v20M94 70v20M101 70v20M108 70v20"
        strokeLinecap="round"
        strokeWidth={2.5}
      />
      <path
        className="stroke-primary"
        d="M44 80h72"
        strokeLinecap="round"
        strokeWidth={3}
      />
    </svg>
  );
}

export function EmptyBagIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="130"
      viewBox={VIEW_BOX}
      width="150"
    >
      <ellipse className="fill-blue-50" cx="80" cy="124" rx="40" ry="5" />
      <path
        className="fill-white stroke-slate-500"
        d="M45 54h70l-6 58a9 9 0 0 1-9 8H60a9 9 0 0 1-9-8Z"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <path
        className="stroke-primary"
        d="M65 54V41a15 15 0 0 1 30 0v13"
        strokeLinecap="round"
        strokeWidth={2.8}
      />
      <path
        className="stroke-gray-300"
        d="M66 82h28"
        strokeDasharray="6 7"
        strokeLinecap="round"
        strokeWidth={2.5}
      />
    </svg>
  );
}

export function BlankListIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="130"
      viewBox={VIEW_BOX}
      width="150"
    >
      <ellipse className="fill-blue-50" cx="80" cy="124" rx="42" ry="5" />
      <rect
        className="fill-white stroke-slate-500"
        height="88"
        rx="9"
        strokeWidth={2.5}
        width="74"
        x="43"
        y="28"
      />
      <rect
        className="fill-primary"
        height="15"
        rx="5"
        width="28"
        x="66"
        y="20"
      />
      <path
        className="stroke-gray-300"
        d="M57 58h46M57 76h46M57 94h26"
        strokeDasharray="6 7"
        strokeLinecap="round"
        strokeWidth={2.5}
      />
    </svg>
  );
}

export function EnterKeyIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="130"
      viewBox={VIEW_BOX}
      width="150"
    >
      <ellipse className="fill-blue-50" cx="80" cy="118" rx="44" ry="5" />
      <rect
        className="fill-white stroke-slate-500"
        height="60"
        rx="14"
        strokeWidth={2.5}
        width="92"
        x="34"
        y="40"
      />
      <path
        className="stroke-primary"
        d="M100 58v14a5 5 0 0 1-5 5H64"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
      <path
        className="stroke-primary"
        d="M73 68l-9 9 9 9"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={3}
      />
    </svg>
  );
}

export function EmptyBoxIcon() {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="130"
      viewBox={VIEW_BOX}
      width="150"
    >
      <ellipse className="fill-blue-50" cx="80" cy="124" rx="44" ry="5" />
      <path
        className="fill-white stroke-slate-500"
        d="M80 40 40 60l40 20 40-20Z"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <path
        className="fill-muted stroke-slate-500"
        d="M40 60v34l40 20V80Z"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <path
        className="fill-white stroke-slate-500"
        d="M120 60v34l-40 20V80Z"
        strokeLinejoin="round"
        strokeWidth={2.5}
      />
      <path
        className="stroke-primary"
        d="M80 22v12M96 28l-6 8M64 28l6 8"
        strokeLinecap="round"
        strokeWidth={2.8}
      />
    </svg>
  );
}
