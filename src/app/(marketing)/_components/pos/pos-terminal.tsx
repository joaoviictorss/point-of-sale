'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { NOTA_FISCAL_DISPONIVEL } from '../flags';
import type { SaleSource } from './pos-terminal-scene';
import { formatAmount, type SaleState } from './sale';

type PosTerminalProps = {
  className?: string;
  onSaleChange?: (sale: SaleState, source: SaleSource) => void;
};

type SceneHandle = {
  handleKey: (key: string) => boolean;
  appear: () => void;
  setActive: (active: boolean) => void;
};

const EDITABLE_TAG = /^(INPUT|TEXTAREA|SELECT)$/;

function isEditable(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || EDITABLE_TAG.test(target.tagName))
  );
}

function announce(sale: SaleState, source: SaleSource) {
  const amount = formatAmount(sale.digits);
  if (sale.phase === 'pix') {
    return `Cobrando R$ ${amount} no PIX`;
  }
  if (sale.phase === 'printed') {
    return `PIX de R$ ${amount} aprovado, ${NOTA_FISCAL_DISPONIVEL ? 'NFC-e impressa' : 'recibo impresso'}`;
  }
  return source === 'user' ? `Valor: R$ ${amount}` : null;
}

/**
 * Interactive 3D card terminal. three.js loads once the section is near the viewport; until then (or
 * without WebGL) a still of the first frame holds the layout. The terminal rises in only when the
 * stage is almost fully visible, then runs one demo sale.
 */
export function PosTerminal3D({ className, onSaleChange }: PosTerminalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<SceneHandle | null>(null);
  const hoverRef = useRef(false);
  const onSaleChangeRef = useRef(onSaleChange);
  const [ready, setReady] = useState(false);
  const [announcement, setAnnouncement] = useState('');

  onSaleChangeRef.current = onSaleChange;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    let disposed = false;
    let loading = false;
    let inView = false;
    let dispose: (() => void) | undefined;

    async function load(el: HTMLElement) {
      loading = true;
      try {
        const { PosTerminalScene } = await import('./pos-terminal-scene');
        if (disposed) {
          return;
        }
        const scene = new PosTerminalScene(el, {
          fontFamily: getComputedStyle(el).fontFamily,
          reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
          onChange: (sale, source) => {
            const text = announce(sale, source);
            if (text) {
              setAnnouncement(text);
            }
            onSaleChangeRef.current?.(sale, source);
          },
        });
        await scene.init();
        if (disposed) {
          scene.dispose();
          return;
        }
        sceneRef.current = scene;
        dispose = () => scene.dispose();
        if (inView) {
          scene.appear();
        }
        setReady(true);
      } catch {
        // No WebGL or an asset failed: the still image stays in place.
      }
    }

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          load(container);
        }
        sceneRef.current?.setActive(entry.isIntersecting);
      },
      { rootMargin: '600px 0px' }
    );
    near.observe(container);

    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= 0.85) {
          inView = true;
          sceneRef.current?.appear();
        }
      },
      { threshold: [0, 0.85, 1] }
    );
    seen.observe(container);

    return () => {
      disposed = true;
      near.disconnect();
      seen.disconnect();
      dispose?.();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    // Typing on the real keyboard works while the pointer is over the terminal or it has focus,
    // so digits typed elsewhere on the page are never captured.
    const onKeyDown = (e: KeyboardEvent) => {
      const focused = containerRef.current?.contains(document.activeElement);
      if (
        !(sceneRef.current && (hoverRef.current || focused)) ||
        isEditable(e.target) ||
        e.metaKey ||
        e.ctrlKey
      ) {
        return;
      }
      if (sceneRef.current.handleKey(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div
      aria-label="Maquininha interativa. Digite um valor com os números, confirme com Enter, corrija com Backspace e limpe com Esc."
      className={cn(
        'relative aspect-[1/1.08] touch-pan-y rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-white/70',
        className
      )}
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
      ref={containerRef}
      role="application"
      // biome-ignore lint/a11y/noNoninteractiveTabindex: the terminal takes keyboard input, so it must be focusable
      tabIndex={0}
    >
      <Image
        alt="Maquininha VNS mostrando a tela de nova venda"
        className={cn(
          'pointer-events-none object-contain transition-opacity duration-500',
          ready && 'opacity-0'
        )}
        fill
        sizes="(min-width: 768px) 620px, 86vw"
        src="/3d/pos/maquininha.webp"
      />
      <p aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}
