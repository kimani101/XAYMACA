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
        XAYMACA uses a fixed one-billion-token supply with no minting after
        deployment. Ordinary transfers use a 1% transfer burn until total
        supply reaches the 30,000,000 XAY minimum-supply floor.
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
          The design uses a 1% transfer burn with a hard 30,000,000 XAY
          minimum supply. If a normal burn would cross that floor, only the
          remaining amount down to the floor is burned; transfers after the
          floor is reached no longer reduce supply.
        </p>
      </div>
    </PageShell>
  );
}
