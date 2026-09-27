'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '@/components';
import { Button } from '@/components/shadcn/button';
import { cn } from '@/lib/utils';
import { WIDTH } from './ui/widths';

const links = [
  { href: '#recursos', label: 'Recursos' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#precos', label: 'Preços' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md transition-colors duration-300',
        scrolled ? 'border-border' : 'border-transparent'
      )}
    >
      <nav
        className={cn(
          'mx-auto flex items-center justify-between gap-6 px-6 py-3.5',
          WIDTH.page
        )}
      >
        <Link href="/">
          <Logo variant="small" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              className="font-medium text-sm text-text-muted transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button asChild className="hidden sm:inline-flex" variant="ghost">
            <Link href="/sign-in">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Comece grátis</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
