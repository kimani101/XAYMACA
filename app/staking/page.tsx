import { PageShell } from "@/components/page-shell";

export default function StakingPage() {
  return (
    <PageShell eyebrow="Staking" title="Stake XAY">
      <div className="rounded-3xl border border-[var(--xay-gold)]/40 bg-[var(--surface)] p-6">
        <p className="font-bold text-white">Staking is not yet deployed.</p>
        <p className="mt-3 text-base">
          The rebuilt interface will only display wallet balances, staked XAY,
          claimable rewards, and transaction controls after the staking
          contract has passed its tests and a verified address is configured.
        </p>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {["Connect wallet", "Stake or withdraw", "Claim verified rewards"].map((step, index) => (
          <div key={step} className="rounded-3xl border border-[var(--border)] p-5">
            <span className="text-sm font-bold text-[var(--xay-green-bright)]">0{index + 1}</span>
            <p className="mt-2 text-base font-semibold text-white">{step}</p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
