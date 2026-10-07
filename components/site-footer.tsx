import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--border)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="font-bold">Xaymaca · XAY</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--muted)]">
            Built around transparent tokenomics, community participation,
            staking, and on-chain governance. Production contracts are never
            implied before verified deployment.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          <Link href="/tokenomics">Tokenomics</Link>
          <Link href="/governance">Governance</Link>
          <Link href="/faq">FAQ</Link>
        </div>
      </div>
    </footer>
  );
}
