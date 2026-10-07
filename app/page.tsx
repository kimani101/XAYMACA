import Link from "next/link";

const pillars = [
  {
    title: "Transparent tokenomics",
    body: "One billion XAY with a documented allocation model, no post-deployment minting, and a tested 1% transfer-burn design.",
  },
  {
    title: "Staking",
    body: "A separate staking system that only exposes balances and rewards after verified deployment.",
  },
  {
    title: "DAO governance",
    body: "Proposal, voting, treasury, and execution flows built around auditable on-chain governance.",
  },
] as const;

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto grid min-h-[76vh] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.1fr_.9fr]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.34em] text-[var(--xay-gold)]">
            XAY · Land of Wood and Water
          </p>
          <h1 className="mt-5 max-w-4xl text-6xl font-black tracking-[-0.055em] sm:text-8xl">
            Xaymaca
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
            A modern Web3 ecosystem for participation, staking, and transparent
            community governance—rebuilt from the original XAYMACA vision for
            an EVM future on Polygon.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/tokenomics"
              className="rounded-full bg-[var(--xay-green)] px-6 py-3 font-bold text-white transition hover:bg-[var(--xay-green-bright)]"
            >
              Explore tokenomics
            </Link>
            <Link
              href="/staking"
              className="rounded-full border border-[var(--border)] px-6 py-3 font-bold transition hover:border-[var(--xay-gold)]"
            >
              Open staking
            </Link>
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-full border border-[var(--xay-gold)]/35 bg-[radial-gradient(circle_at_50%_45%,rgba(31,157,85,.32),rgba(5,7,6,.8)_62%)] shadow-[0_0_100px_rgba(31,157,85,.18)]" />
          <div className="absolute inset-[12%] rounded-full border border-white/10" />
          <div className="absolute inset-[28%] flex items-center justify-center rounded-full border border-[var(--xay-gold)] bg-black/50 text-5xl font-black text-[var(--xay-gold)]">
            XAY
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-black/20">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 py-16 md:grid-cols-3">
          {pillars.map((pillar) => (
            <article key={pillar.title} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7">
              <h2 className="text-xl font-black">{pillar.title}</h2>
              <p className="mt-4 leading-7 text-[var(--muted)]">{pillar.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="rounded-[2rem] border border-[var(--xay-green)]/40 bg-[linear-gradient(135deg,rgba(31,157,85,.12),rgba(244,197,66,.06))] p-8 sm:p-12">
          <p className="text-sm font-black uppercase tracking-[0.3em] text-[var(--xay-gold)]">
            Build status
          </p>
          <h2 className="mt-4 text-3xl font-black sm:text-4xl">
            No simulated on-chain activity.
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-[var(--muted)]">
            Until verified contracts are deployed, staking and governance pages
            remain explicitly in pre-deployment mode. XAYMACA will not display
            fake balances, rewards, APY, proposal state, or contract addresses.
          </p>
        </div>
      </section>
    </main>
  );
}
