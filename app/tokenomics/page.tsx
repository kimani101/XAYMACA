import { PageShell } from "@/components/page-shell";

const allocations = [
  ["Public Sale", "400,000,000 XAY", "30.77%"],
  ["DAO Treasury", "250,000,000 XAY", "19.23%"],
  ["Staking Rewards", "450,000,000 XAY", "34.62%"],
  ["Ecosystem Growth", "100,000,000 XAY", "7.69%"],
  ["Team & Advisors", "100,000,000 XAY", "7.69%"],
] as const;

export default function TokenomicsPage() {
  return (
    <PageShell eyebrow="XAY supply" title="1,300,000,000 XAY">
      <p>
        The final December 29, 2024 XAY specification uses a fixed
        1.3-billion-token supply with no minting after deployment. Ordinary
        transfers use a 1% transfer burn until total supply reaches the
        30,000,000 XAY minimum-supply floor.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allocations.map(([name, amount, share]) => (
          <article
            key={name}
            className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <p className="text-sm font-semibold text-[var(--xay-gold)]">{share}</p>
            <h2 className="mt-2 text-xl font-bold text-white">{name}</h2>
            <p className="mt-3 text-base text-[var(--muted)]">{amount}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-3xl border border-[var(--xay-green)]/50 bg-[var(--surface)] p-6">
        <h2 className="text-lg font-bold text-white">Burn mechanics</h2>
        <p className="mt-2 text-base">
          The 1% transfer burn can never reduce supply below 30,000,000 XAY.
          If the normal burn would cross the floor, only the remaining amount
          down to the floor is burned. Transfers continue without a burn once
          that floor has been reached.
        </p>
      </div>
    </PageShell>
  );
}
