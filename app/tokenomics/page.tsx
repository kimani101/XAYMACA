import { PageShell } from "@/components/page-shell";

const allocations = [
  ["Public Sale", "400,000,000 XAY", "40%"],
  ["DAO Treasury", "250,000,000 XAY", "25%"],
  ["Staking Rewards", "150,000,000 XAY", "15%"],
  ["Ecosystem Growth", "100,000,000 XAY", "10%"],
  ["Team & Advisors", "100,000,000 XAY", "10%"],
] as const;

export default function TokenomicsPage() {
  return (
    <PageShell eyebrow="XAY supply" title="1,000,000,000 XAY">
      <p>
        The latest approved XAYMACA tokenomics define a fixed one-billion-token
        supply. The planned token contract includes a 1% transfer burn on
        ordinary transfers, protected by a minimum-supply safety floor.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allocations.map(([name, amount, share]) => (
          <article key={name} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <p className="text-sm font-semibold text-[var(--xay-gold)]">{share}</p>
            <h2 className="mt-2 text-xl font-bold text-white">{name}</h2>
            <p className="mt-3 text-base text-[var(--muted)]">{amount}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-[var(--xay-green)]/50 bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-white">Burn mechanics</h2>
        <p className="mt-2 text-base">
          The historical design uses a 1% transfer burn. The exact production
          minimum-supply floor will be locked and documented before deployment;
          earlier project work referenced roughly 30–31 million XAY.
        </p>
      </div>
    </PageShell>
  );
}
