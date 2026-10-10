import {
  ArrowRight,
  ClipboardCheck,
  Code2,
  LayoutDashboard,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type Role = {
  icon: LucideIcon;
  title: string;
  description: string;
  capabilities: string[];
  cta: string;
  href: string;
};

const ROLES: Role[] = [
  {
    icon: Code2,
    title: "Candidates",
    description:
      "A focused workspace to discover assessments, take them under real conditions, and see every result.",
    capabilities: [
      "Browse published assessments",
      "Enroll in free or paid attempts",
      "Answer under a live timer",
      "Track score, verdict, and reviewer feedback",
    ],
    cta: "Create a candidate account",
    href: "/register",
  },
  {
    icon: ClipboardCheck,
    title: "Reviewers",
    description:
      "Author assessments, manage questions, and grade submissions from a single review queue.",
    capabilities: [
      "Create MCQ, text, and code questions",
      "Publish when content is ready",
      "Claim submissions atomically",
      "Grade with per-answer feedback",
    ],
    cta: "Sign in as a reviewer",
    href: "/login",
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    description:
      "Oversee users, roles, assessments, and platform health with full traceability.",
    capabilities: [
      "Manage users, roles, and status",
      "Monitor assessments platform-wide",
      "Track payments and totals",
      "Inspect every audit-log entry",
    ],
    cta: "Sign in as an admin",
    href: "/login",
  },
];

export function RolesSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase">
          Built for three roles
        </p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          One platform, three focused workspaces
        </h2>
        <p className="mt-4 text-lg leading-8 text-muted-foreground">
          Each role sees only what it needs. Boundaries are enforced at the
          route level, not just hidden in the UI.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {ROLES.map((role) => {
          const Icon = role.icon;

          return (
            <article
              key={role.title}
              className="flex flex-col border bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="flex size-11 items-center justify-center bg-primary/10 text-primary">
                <Icon className="size-5" aria-hidden="true" />
              </div>

              <h3 className="mt-6 text-xl font-bold tracking-tight">
                {role.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {role.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3 border-t pt-6">
                {role.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex items-start gap-2.5 text-sm"
                  >
                    <LayoutDashboard
                      className="mt-0.5 size-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">{capability}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={role.href}
                className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
              >
                {role.cta}
                <ArrowRight className="size-3.5" aria-hidden="true" />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
