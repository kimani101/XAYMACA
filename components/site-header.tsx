import Link from "next/link";

const navItems = [
  ["About", "/about"],
  ["Tokenomics", "/tokenomics"],
  ["Staking", "/staking"],
  ["Governance", "/governance"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[#050706e8] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 font-black tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--xay-gold)] bg-[var(--surface)] text-sm text-[var(--xay-gold)]">
            X
          </span>
          <span className="text-xl">Xaymaca</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {navItems.map(([label, href]) => (
            <Link key={href} href={href} className="transition hover:text-white">
              {label}
            </Link>
          ))}
        </nav>
        <Link
          href="/staking"
          className="rounded-full border border-[var(--xay-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--xay-green)]"
        >
          Open app
        </Link>
      </div>
      <nav aria-label="Mobile navigation" className="mx-auto flex max-w-7xl gap-5 overflow-x-auto px-6 pb-3 text-xs text-[var(--muted)] md:hidden">
        {navItems.map(([label, href]) => (
          <Link key={href} href={href} className="whitespace-nowrap">
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
