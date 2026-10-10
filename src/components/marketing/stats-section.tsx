import { ClipboardCheck, CreditCard, ShieldCheck, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Stat = {
  icon: LucideIcon;
  value: string;
  label: string;
  description: string;
};

const STATS: Stat[] = [
  {
    icon: Users,
    value: "3",
    label: "Distinct roles",
    description: "Candidate, Reviewer, and Admin workspaces.",
  },
  {
    icon: ClipboardCheck,
    value: "Auto + Manual",
    label: "Scoring pipeline",
    description: "MCQs auto-score, free-form answers get reviewed.",
  },
  {
    icon: CreditCard,
    value: "Stripe",
    label: "Secure payments",
    description: "Checkout sessions and webhook verification.",
  },
  {
    icon: ShieldCheck,
    value: "100%",
    label: "Audited actions",
    description: "Every critical event written to an audit log.",
  },
];

export function StatsSection() {
  return (
    <section className="border-b bg-card">
      <div className="mx-auto grid max-w-7xl gap-px bg-border px-0 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="bg-card px-6 py-10 sm:px-8">
              <Icon className="size-5 text-primary" aria-hidden="true" />

              <p className="mt-5 text-2xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {stat.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}