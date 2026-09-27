import { cn } from '@/lib/utils';

export function Noise({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-0 bg-[length:260px_auto] bg-[url(/lp/textura-ruido.png)] opacity-[.08] mix-blend-overlay',
        className
      )}
    />
  );
}
