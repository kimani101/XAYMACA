import { PageShell } from "@/components/page-shell";

const faq = [
  ["What is XAY?", "XAY is the native digital asset of the Xaymaca ecosystem."],
  ["What network will XAY use?", "Polygon is the preferred production chain. Development and testing happen locally and on testnet first."],
  ["Is staking live?", "No. Staking will only be enabled after the contract is tested, deployed, and its address is verified in the application."],
  ["How is governance handled?", "The planned DAO uses on-chain voting with a Governor contract and timelocked execution."],
] as const;

export default function FaqPage() {
  return (
    <PageShell eyebrow="FAQ" title="Know what is live and what is planned">
      <div className="space-y-4">
        {faq.map(([question, answer]) => (
          <article key={question} className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h2 className="text-lg font-bold text-white">{question}</h2>
            <p className="mt-2 text-base">{answer}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
