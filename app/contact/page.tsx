import { PageShell } from "@/components/page-shell";

export default function ContactPage() {
  return (
    <PageShell eyebrow="Contact" title="Follow the build transparently">
      <p>
        XAYMACA development is being rebuilt in public source control. Official
        social and community destinations will be linked here only after their
        ownership and URLs are verified.
      </p>
      <p className="mt-6">
        This avoids placeholder links that could send users to an unrelated or
        impersonated account.
      </p>
    </PageShell>
  );
}
