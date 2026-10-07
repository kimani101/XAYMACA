import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-6 py-20 sm:py-28">
      <section className="max-w-4xl">
        <p className="text-sm font-bold uppercase tracking-[0.28em] text-[var(--xay-gold)]">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
          {title}
        </h1>
        <div className="mt-8 text-lg leading-8 text-[var(--muted)]">{children}</div>
      </section>
    </main>
  );
}
