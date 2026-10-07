import { PageShell } from "@/components/page-shell";

export default function AboutPage() {
  return (
    <PageShell eyebrow="Land of Wood and Water" title="A community-first digital ecosystem">
      <p>
        Xaymaca takes its name from the Taíno-derived name associated with
        Jamaica: the land of wood and water. The project vision centers on
        prosperity, growth, sustainability, financial empowerment, inclusion,
        and transparent governance.
      </p>
      <p className="mt-6">
        XAY is designed as an EVM-compatible token with staking and DAO
        governance built as separate, reviewable systems. Polygon remains the
        preferred production network, with local and testnet validation before
        any live deployment.
      </p>
    </PageShell>
  );
}
