import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardCheck, Users } from "lucide-react";

import type { Role } from "@/constants/roles";

const OVERVIEWS: Record<
  Role,
  {
    eyebrow: string;
    title: string;
    description: string;
    links: { label: string; href: string; description: string }[];
  }
> = {
  CANDIDATE: {
    eyebrow: "Candidate workspace",
    title: "Your assessment journey",
    description:
      "Explore developer assessments, track your attempts, and review your results.",
    links: [
      {
        label: "Browse assessments",
        href: "/candidate/assessments",
        description: "Find assessments that match your skills.",
      },
      {
        label: "My attempts",
        href: "/candidate/attempts",
        description: "Track your assessment progress.",
      },
      {
        label: "Payment history",
        href: "/candidate/payments",
        description: "Review your assessment payments.",
      },
    ],
  },
  REVIEWER: {
    eyebrow: "Reviewer workspace",
    title: "Manage your assessments",
    description:
      "Create assessments, organize questions, and evaluate candidate submissions.",
    links: [
      {
        label: "My assessments",
        href: "/reviewer/assessments",
        description: "Manage assessments you have created.",
      },
      {
        label: "Review queue",
        href: "/reviewer/reviews",
        description: "Review submitted candidate attempts.",
      },
      {
        label: "Analytics",
        href: "/reviewer/analytics",
        description: "Review your assessment activity.",
      },
    ],
  },
  ADMIN: {
    eyebrow: "Administration",
    title: "Platform overview",
    description:
      "Manage users, oversee assessments, and monitor platform activity.",
    links: [
      {
        label: "Manage users",
        href: "/admin/users",
        description: "Review user accounts and roles.",
      },
      {
        label: "Assessments",
        href: "/admin/assessments",
        description: "Oversee platform assessments.",
      },
      {
        label: "Audit logs",
        href: "/admin/audit-logs",
        description: "Inspect recorded administrative actions.",
      },
    ],
  },
};

export default function DashboardOverview({ role }: { role: Role }) {
  const overview = OVERVIEWS[role];

  return (
    <div className="space-y-8">
      <section className="border bg-card p-6 sm:p-8">
        <p className="text-sm font-semibold text-primary">{overview.eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          {overview.title}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {overview.description}
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Quick access</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Navigate to your main workspace activities.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overview.links.map((item, index) => {
            const Icon = [BookOpen, ClipboardCheck, Users][index];

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <div className="flex items-center justify-between">
                  <Icon className="size-5 text-primary" aria-hidden="true" />
                  <ArrowRight
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-5 font-semibold">{item.label}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
