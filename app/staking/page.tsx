import { PageShell } from "@/components/page-shell";
import { StakingDashboard } from "@/components/staking-dashboard";

export default function StakingPage() {
  return (
    <PageShell eyebrow="Staking" title="Stake XAY">
      <p className="mb-8">
        The staking dashboard reads directly from the configured XAY and
        staking contracts. Until verified deployment addresses exist for the
        connected network, transaction controls remain unavailable.
      </p>
      <StakingDashboard />
    </PageShell>
  );
}
