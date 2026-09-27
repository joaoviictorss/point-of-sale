'use client';

import { useInView } from 'framer-motion';
import { useRef } from 'react';
import type { Step } from './how-it-works';

// Horizontal centre of each hand-drawn circle, in % of the 1200-wide drawing.
const STEP_LEFT = [6.7, 24.3, 41.6, 59.2, 76.8, 94.1];

const CONNECTORS = [
  'M118 110C180 140 220 190 252 226',
  'M330 232C390 200 430 140 462 108',
  'M540 110C600 140 640 190 672 226',
  'M750 232C810 200 850 140 882 108',
  'M960 110C1020 140 1060 190 1092 226',
];

const CIRCLES = [
  'M83.9999 59.0002C104 63.0002 118 78.0002 116 101C114 122 94.9999 135 71.9999 132C50.9999 129 40.9999 111 43.9999 87.0002C46.9999 67.0002 62.9999 56.0002 83.9999 59.0002ZM83.9999 59.0002C89.9999 60.0002 95.9999 62.0002 101 66.0002',
  'M315.773 270.848C299.853 283.597 279.363 284.68 263.03 268.364C248.228 253.333 250.483 230.422 267.565 214.732C283.362 200.573 303.578 204.483 320.035 222.208C333.427 237.362 331.569 256.689 315.773 270.848ZM315.773 270.848C311.15 274.801 305.761 278.112 299.483 279.371',
  'M532.603 78.0542C540.798 96.7316 536.54 116.803 516.553 128.357C498.203 138.764 476.657 130.657 465.922 110.095C456.334 91.1726 465.343 72.6567 486.723 61.3483C504.827 52.3342 523.015 59.1313 532.603 78.0542ZM532.603 78.0542C535.225 83.5427 537.028 89.6048 536.62 95.9948',
  'M693.587 277.401C676.161 266.802 668.135 247.918 677.881 226.989C686.943 207.94 709.243 202.222 729.83 212.907C748.538 222.909 751.778 243.244 740.751 264.77C731.091 282.538 712.294 287.402 693.587 277.401ZM693.587 277.401C688.29 274.409 683.336 270.477 680.006 265.009',
  'M956.51 103.21C950.783 122.785 934.619 135.425 911.881 131.428C891.135 127.605 879.841 107.544 884.834 84.8931C889.653 64.2345 908.456 55.8414 932.103 60.9217C951.766 65.6534 961.329 82.5512 956.51 103.21ZM956.51 103.21C954.991 109.1 952.476 114.903 948.055 119.535',
  'M1096.6 227.587C1107.2 210.161 1126.08 202.135 1147.01 211.881C1166.06 220.943 1171.78 243.243 1161.09 263.83C1151.09 282.538 1130.76 285.778 1109.23 274.751C1091.46 265.091 1086.6 246.294 1096.6 227.587ZM1096.6 227.587C1099.59 222.29 1103.52 217.336 1108.99 214.006',
];

// Circle centres, where each step number sits.
const NUMBER_AT: [number, number][] = [
  [80, 95],
  [291, 240],
  [500, 95],
  [710, 244],
  [921, 95],
  [1129, 243],
];

/** The hand-drawn six-step path; it draws itself once the section is on screen. */
export function DesktopSteps({ steps }: { steps: Step[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.45 });

  return (
    <div className="relative mt-14 hidden lg:block" ref={ref}>
      <svg
        aria-hidden="true"
        className="block h-auto w-full"
        fill="none"
        viewBox="0 0 1200 340"
      >
        <defs>
          {CONNECTORS.map((d, i) => (
            <mask
              height="340"
              id={`stepseg${i}`}
              key={d}
              maskUnits="userSpaceOnUse"
              width="1200"
              x="0"
              y="0"
            >
              <path
                d={d}
                style={{
                  fill: 'none',
                  stroke: '#fff',
                  strokeWidth: 8,
                  strokeLinecap: 'round',
                  strokeDasharray: 600,
                  strokeDashoffset: on ? 0 : 600,
                  transition: `stroke-dashoffset .5s ease-in-out ${0.3 + i * 0.5}s`,
                }}
              />
            </mask>
          ))}
        </defs>
        {CONNECTORS.map((d, i) => (
          <path
            d={d}
            key={d}
            mask={`url(#stepseg${i})`}
            stroke="#6B7280"
            strokeDasharray="1 14"
            strokeLinecap="round"
            strokeWidth={2}
          />
        ))}
        {CIRCLES.map((d, i) => (
          <path
            d={d}
            key={d}
            stroke="#3B82F6"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            style={{
              strokeDasharray: 400,
              strokeDashoffset: on ? 0 : 400,
              transition: `stroke-dashoffset .6s ease-out ${i * 0.5}s`,
            }}
          />
        ))}
        {NUMBER_AT.map(([x, y], i) => (
          <text
            className="fill-foreground font-semibold"
            dominantBaseline="central"
            fontSize={24}
            key={x}
            style={{
              opacity: on ? 1 : 0,
              transition: `opacity .4s ease-out ${0.2 + i * 0.5}s`,
            }}
            textAnchor="middle"
            x={x}
            y={y}
          >
            {i + 1}
          </text>
        ))}
      </svg>
      {steps.map((step, i) => {
        const flipped = i % 2 === 1;
        const delay = `${i * 0.5 + 0.25}s`;
        return (
          <div
            className="absolute w-40 text-center"
            key={step.title}
            style={{
              left: `${STEP_LEFT[i]}%`,
              top: flipped ? 'auto' : '46%',
              bottom: flipped ? '46%' : 'auto',
              opacity: on ? 1 : 0,
              transform: on ? 'translate(-50%,0)' : 'translate(-50%,10px)',
              transition: `opacity .5s ease-out ${delay}, transform .5s cubic-bezier(.16,1,.3,1) ${delay}`,
            }}
          >
            <h3 className="font-semibold text-foreground text-sm">
              {step.title}
            </h3>
            <p className="mt-1 text-text-muted text-xs">{step.description}</p>
          </div>
        );
      })}
    </div>
  );
}
