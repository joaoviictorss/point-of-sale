'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/shadcn/button';

export function MobileCtaBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShow(window.innerWidth < 768 && window.scrollY > 480);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center gap-3 border-border border-t bg-white/95 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(17,24,39,.18)] backdrop-blur-md">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="font-semibold text-foreground text-sm">
          Comece grátis
        </span>
        <span className="text-text-muted text-xs">Sem cartão de crédito</span>
      </div>
      <Button asChild className="h-11" size="lg">
        <Link href="/sign-up">Criar conta</Link>
      </Button>
    </div>
  );
}
