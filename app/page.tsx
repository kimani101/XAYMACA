export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-24">
      <section className="max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.32em] text-[var(--xay-gold)]">
          XAY · Polygon-ready
        </p>
        <h1 className="text-5xl font-black tracking-tight sm:text-7xl">
          Xaymaca
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)] sm:text-xl">
          A modern Web3 ecosystem built around transparent tokenomics,
          staking, and community governance.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="/tokenomics"
            className="rounded-full bg-[var(--xay-green)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--xay-green-bright)]"
          >
            Explore tokenomics
          </a>
          <a
            href="/staking"
            className="rounded-full border border-[var(--border)] px-6 py-3 font-semibold transition hover:border-[var(--xay-gold)]"
          >
            Staking status
          </a>
        </div>
      </section>
    </main>
  );
}
