import {
  ClipboardCheck,
  Clock,
  Code2,
  CreditCard,
  ScrollText,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: Code2,
    title: "Three-role workspaces",
    description:
      "Candidates, reviewers, and administrators each get a focused dashboard with only the tools they need.",
  },
  {
    icon: Clock,
    title: "Timed, stateful attempts",
    description:
      "Every attempt moves through a strict state machine — pending payment, ready, in progress, submitted, and evaluated.",
  },
  {
    icon: ClipboardCheck,
    title: "Auto + manual scoring",
    description:
      "MCQs are graded instantly. Text and code answers are routed to reviewers with per-question feedback.",
  },
  {
    icon: CreditCard,
    title: "Stripe-backed payments",
    description:
      "Paid assessments use Stripe Checkout with signed webhook verification before the attempt becomes ready.",
  },
  {
    icon: ShieldCheck,
    title: "Role-based access",
    description:
      "Middleware on the server and conditional rendering on the client enforce boundaries for every role.",
  },
  {
    icon: ScrollText,
    title: "Complete audit trail",
    description:
      "Registrations, publishes, evaluations, and admin actions are all written to a searchable audit log.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Platform capabilities
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Everything a modern assessment pipeline needs
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          From authoring to evaluation, Assessly replaces scattered forms with a
          single, structured workflow.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;

          return (
            <article
              key={feature.title}
              className="group border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-10 items-center justify-center bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>
              <h3 className="mt-5 font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {feature.description}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
