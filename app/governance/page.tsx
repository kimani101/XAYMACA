import { PageShell } from "@/components/page-shell";

export default function GovernancePage() {
  return (
    <PageShell eyebrow="DAO governance" title="Govern Xaymaca on-chain">
      <div className="rounded-3xl border border-[var(--xay-gold)]/40 bg-[var(--surface)] p-6">
        <p className="font-bold text-white">Governance is not yet deployed.</p>
        <p className="mt-3 text-base">
          XAYMACA governance will use tested OpenZeppelin Governor and
          TimelockController primitives. Proposal state, voting power, quorum,
          votes, and execution status will come from verified contracts rather
          than placeholder application data.
        </p>
      </div>
      <p className="mt-8">
        The DAO is intended to control protocol decisions and treasury actions
        through transparent proposals, voting, and delayed execution.
      </p>
    </PageShell>
  );
}
